"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { companies } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { TrendingUp, Users, Trophy, Mic } from "lucide-react";

export default function PlacementCompaniesPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const sorted = [...companies].sort((a, b) => b.relationshipScore - a.relationshipScore);

  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Company Relations" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Company Relationship Management</h1>
        <p className="text-sm text-muted-foreground">Track engagement history and recommended next actions for each partner.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: c.logoColor }}>{c.name[0]}</div>
              <Badge variant={c.relationshipScore >= 80 ? "emerald" : c.relationshipScore >= 65 ? "amber" : "outline"}>{c.relationshipScore}/100</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.industry}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.history.at(-1)?.hires} hires (2025)</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {c.history.at(-1)?.internships} interns</span>
            </div>
            <div className="mt-3 rounded-[var(--radius-sm)] bg-blue-light/60 p-2.5 text-xs text-blue-2">
              Next best engagement: {c.relationshipScore < 70 ? "Schedule a relationship-building call" : "Invite for campus hackathon"}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => pushToast({ title: "Hackathon invite sent", description: c.name })}><Trophy className="h-3.5 w-3.5" /> Invite Hackathon</Button>
              <Button size="sm" variant="primary" onClick={() => pushToast({ title: "Guest lecture requested", description: c.name })}><Mic className="h-3.5 w-3.5" /> Request Lecture</Button>
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
