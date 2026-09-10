"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { currentStudent } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { ShieldCheck, Bell, Lock, Share2 } from "lucide-react";

export default function StudentSettingsPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Settings" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, privacy and notification preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={currentStudent.name} color={currentStudent.avatarColor} size={56} />
              <div>
                <p className="text-sm font-semibold text-foreground">{currentStudent.name}</p>
                <p className="text-xs text-muted-foreground">{currentStudent.college}</p>
              </div>
            </div>
            <Input defaultValue={currentStudent.name} placeholder="Full name" />
            <Input defaultValue={currentStudent.targetRole} placeholder="Target role" />
            <Button variant="primary" size="sm" onClick={() => pushToast({ title: "Profile updated", variant: "success" })}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-blue-2" /> Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Make profile visible to recruiters", on: true },
              { label: "Share verified evidence with placement cell", on: true },
              { label: "Allow alumni to view my applications", on: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3 text-sm">
                <span className="text-foreground">{s.label}</span>
                <Badge variant={s.on ? "emerald" : "outline"}>{s.on ? "On" : "Off"}</Badge>
              </div>
            ))}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Demo verification — no real data is shared.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Bell className="h-4 w-4 text-amber" /> Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Application updates", "New opportunity matches", "Assessment reminders", "Alumni messages"].map((s) => (
              <div key={s} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3 text-sm">
                <span className="text-foreground">{s}</span>
                <Badge variant="emerald">On</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Share2 className="h-4 w-4 text-violet" /> Share Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Share your verified Skill Passport with recruiters or mentors.</p>
            <div className="flex gap-2">
              <Input readOnly value={`skilldex.app/p/${currentStudent.id}`} />
              <Button variant="outline" size="sm" onClick={() => pushToast({ title: "Link copied", variant: "success" })}>Copy Link</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
