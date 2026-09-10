"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobs, colleges } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { Trophy, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

const hackathons = jobs.filter((j) => j.type === "Hackathon");

export default function HackathonsPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Hackathons" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hackathons</h1>
        <p className="text-sm text-muted-foreground">Run branded hackathons across your partner college network.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hackathons.map((h, i) => (
          <Card key={h.id} className="p-4">
            <Trophy className="h-6 w-6 text-amber" />
            <p className="mt-3 text-sm font-semibold text-foreground">{h.title}</p>
            <p className="text-xs text-muted-foreground">{h.package}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(h.deadline)}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {colleges[i % colleges.length].name}</span>
            </div>
            <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => pushToast({ title: "Hackathon proposal sent", description: colleges[i % colleges.length].name, variant: "success" })}>
              Propose to College
            </Button>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
