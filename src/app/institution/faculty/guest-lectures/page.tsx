"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentFaculty, companies } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { Mic, Calendar } from "lucide-react";

const invites = companies.slice(4, 10).map((c, i) => ({
  id: `gl-${i}`,
  company: c.name,
  topic: ["Modern System Design", "Cloud-Native Engineering", "AI in Production", "Data-Driven Decision Making", "Building Scalable APIs", "Career in FinTech"][i % 6],
  date: `2026-${String(9 + (i % 3)).padStart(2, "0")}-${String(10 + i * 2).padStart(2, "0")}`,
  logoColor: c.logoColor,
}));

export default function GuestLecturesPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Guest Lectures" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Guest Lecture Invitations</h1>
        <p className="text-sm text-muted-foreground">Industry-requested guest lectures matched to your expertise.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {invites.map((inv) => (
          <Card key={inv.id} className="p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white" style={{ background: inv.logoColor }}>
              <Mic className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{inv.topic}</p>
            <p className="text-xs text-muted-foreground">Requested by {inv.company}</p>
            <Badge variant="outline" className="mt-2"><Calendar className="mr-1 h-3 w-3 inline" />{inv.date}</Badge>
            <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => pushToast({ title: "Invitation accepted", description: inv.topic, variant: "success" })}>
              Accept Invitation
            </Button>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
