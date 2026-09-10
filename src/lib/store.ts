"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApplicationRecord } from "./types";
import { applications as seedApplications } from "./data/applications";
import { notificationsSeed } from "./data/notifications";

export type DemoRole = "student" | "faculty" | "placement" | "recruiter" | "company" | null;

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
}

interface SkillDexState {
  demoRole: DemoRole;
  setDemoRole: (r: DemoRole) => void;

  applications: ApplicationRecord[];
  applyToJob: (jobId: string, studentId: string) => void;
  moveApplicationStage: (appId: string, stage: ApplicationRecord["stage"]) => void;

  savedJobs: string[];
  toggleSavedJob: (jobId: string) => void;

  connections: string[];
  toggleConnection: (alumniId: string) => void;

  readNotifications: string[];
  markNotificationRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;

  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  aiCopilotOpen: boolean;
  setAiCopilotOpen: (v: boolean) => void;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;

  completedTasks: string[];
  toggleTaskComplete: (id: string) => void;
}

export const useSkillDexStore = create<SkillDexState>()(
  persist(
    (set, get) => ({
      demoRole: null,
      setDemoRole: (r) => set({ demoRole: r }),

      applications: seedApplications,
      applyToJob: (jobId, studentId) => {
        const exists = get().applications.some((a) => a.jobId === jobId && a.studentId === studentId);
        if (exists) return;
        const newApp: ApplicationRecord = {
          id: `app-local-${Date.now()}`,
          studentId,
          jobId,
          stage: "Applied",
          appliedOn: new Date().toISOString().slice(0, 10),
          matchScore: 75,
        };
        set({ applications: [newApp, ...get().applications] });
      },
      moveApplicationStage: (appId, stage) => {
        set({
          applications: get().applications.map((a) => (a.id === appId ? { ...a, stage } : a)),
        });
      },

      savedJobs: [],
      toggleSavedJob: (jobId) => {
        const saved = get().savedJobs;
        set({
          savedJobs: saved.includes(jobId) ? saved.filter((j) => j !== jobId) : [...saved, jobId],
        });
      },

      connections: [],
      toggleConnection: (alumniId) => {
        const c = get().connections;
        set({
          connections: c.includes(alumniId) ? c.filter((x) => x !== alumniId) : [...c, alumniId],
        });
      },

      readNotifications: [],
      markNotificationRead: (id) => {
        const r = get().readNotifications;
        if (!r.includes(id)) set({ readNotifications: [...r, id] });
      },
      markAllRead: (ids) => {
        const r = new Set([...get().readNotifications, ...ids]);
        set({ readNotifications: Array.from(r) });
      },

      toasts: [],
      pushToast: (t) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set({ toasts: [...get().toasts, { ...t, id }] });
        setTimeout(() => get().dismissToast(id), 4000);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      aiCopilotOpen: false,
      setAiCopilotOpen: (v) => set({ aiCopilotOpen: v }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      completedTasks: [],
      toggleTaskComplete: (id) => {
        const c = get().completedTasks;
        set({
          completedTasks: c.includes(id) ? c.filter((x) => x !== id) : [...c, id],
        });
      },
    }),
    {
      name: "skilldex-store",
      partialize: (state) => ({
        demoRole: state.demoRole,
        applications: state.applications,
        savedJobs: state.savedJobs,
        connections: state.connections,
        readNotifications: state.readNotifications,
        completedTasks: state.completedTasks,
      }),
    }
  )
);

export function useUnreadCount(audience: "student" | "faculty" | "placement" | "recruiter" | "company") {
  const read = useSkillDexStore((s) => s.readNotifications);
  return notificationsSeed.filter((n) => n.audience === audience && !read.includes(n.id)).length;
}
