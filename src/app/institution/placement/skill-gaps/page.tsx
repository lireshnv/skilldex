"use client";
import { useMemo, useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ComparisonBarChart } from "@/components/charts/charts";
import { students, skills, skillName } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { AlertTriangle } from "lucide-react";

export default function SkillGapsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  const gaps = useMemo(() => {
    const relevantSkills = skills.filter((s) => s.category === "Technical").slice(0, 12);
    return relevantSkills
      .map((skill) => {
        const withSkill = students.filter((s) => s.skills.some((ss) => ss.skillId === skill.id));
        const avgConfidence = withSkill.length
          ? Math.round(withSkill.reduce((a, s) => a + (s.skills.find((ss) => ss.skillId === skill.id)?.confidence ?? 0), 0) / withSkill.length)
          : 20;
        const gapScore = Math.max(0, skill.demand - avgConfidence);
        return { label: skill.name, id: skill.id, current: avgConfidence, demand: skill.demand, gap: gapScore };
      })
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 8);
  }, []);

  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Skill Gap Analytics" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Skill Gap Analytics</h1>
        <p className="text-sm text-muted-foreground">Institutional skill gaps ranked by severity and industry demand.</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Top Missing Skills</CardTitle></CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={gaps}
            layout="vertical"
            height={340}
            bars={[
              { key: "current", color: "var(--brand-blue)", name: "Current Avg %" },
              { key: "demand", color: "var(--accent-rose)", name: "Industry Demand %" },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gaps.slice(0, 4).map((g) => (
          <Card key={g.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{g.label}</p>
              <Badge variant="rose"><AlertTriangle className="h-3 w-3" /> {g.gap}pt gap</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{g.current}% current vs {g.demand}% industry demand</p>
            <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => setOpen(g.id)}>Recommend Intervention</Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)} title="Recommended Institutional Intervention">
        {open && (
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-foreground">Run a 4-week {skillName(open)} Bootcamp</p>
            <p className="text-muted-foreground">Based on available resources, SkillDex recommends the following plan:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[var(--radius-sm)] bg-surface-muted p-2.5"><p className="font-bold text-foreground">3</p><p className="text-xs text-muted-foreground">Faculty available</p></div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted p-2.5"><p className="font-bold text-foreground">Available</p><p className="text-xs text-muted-foreground">Lab access</p></div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted p-2.5"><p className="font-bold text-foreground">7</p><p className="text-xs text-muted-foreground">Alumni mentors</p></div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted p-2.5"><p className="font-bold text-foreground">2</p><p className="text-xs text-muted-foreground">Industry partners</p></div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { setOpen(null); pushToast({ title: "Training program created", description: `${skillName(open)} Bootcamp scheduled`, variant: "success" }); }}>
              Create Training Program
            </Button>
          </div>
        )}
      </Dialog>
    </PortalShell>
  );
}
