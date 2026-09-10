"use client";
import { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { jobs, companyById, students } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { Mail, Bell, LayoutDashboard, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

const feed = jobs.slice(0, 8);

export default function PlacementNotificationsPage() {
  const [target, setTarget] = useState<typeof feed[0] | null>(null);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const eligibleCount = Math.max(8, students.length - 12);

  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Notifications" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Institution Notifications</h1>
        <p className="text-sm text-muted-foreground">New opportunities, deadlines and events — notify eligible students in one click.</p>
      </div>

      <div className="space-y-3">
        {feed.map((j) => {
          const company = companyById(j.companyId);
          return (
            <Card key={j.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge variant="blue" className="mb-1.5">{j.type}</Badge>
                <p className="text-sm font-semibold text-foreground">{j.title} — {company?.name}</p>
                <p className="text-xs text-muted-foreground">Deadline: {formatDate(j.deadline)}</p>
              </div>
              <Button size="sm" variant="primary" onClick={() => setTarget(j)}>
                <Bell className="h-3.5 w-3.5" /> Notify Eligible Students
              </Button>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!target} onOpenChange={() => setTarget(null)} title="Notify Eligible Students">
        {target && (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              <strong className="text-foreground">{eligibleCount} students</strong> are eligible for {target.title} at {companyById(target.companyId)?.name}.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Send via:</p>
              <div className="flex gap-2">
                <Badge variant="blue"><Mail className="h-3 w-3" /> College Email</Badge>
                <Badge variant="emerald"><LayoutDashboard className="h-3 w-3" /> In-App</Badge>
                <Badge variant="violet"><Users className="h-3 w-3" /> Dashboard</Badge>
              </div>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                setTarget(null);
                pushToast({ title: "Notification sent", description: `${eligibleCount} students notified about ${target.title}`, variant: "success" });
              }}
            >
              Send Notification
            </Button>
          </div>
        )}
      </Dialog>
    </PortalShell>
  );
}
