"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentFaculty, companies } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { FlaskConical } from "lucide-react";

const programs = companies.slice(0, 6).map((c, i) => ({
  id: `it-${i}`,
  company: c.name,
  title: `Industrial Training Placement — ${c.industry}`,
  duration: ["2 weeks", "4 weeks", "6 weeks"][i % 3],
  seats: 8 + i * 3,
  logoColor: c.logoColor,
}));

export default function IndustrialTrainingPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Industrial Training" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Industrial Training Programs</h1>
        <p className="text-sm text-muted-foreground">Coordinate structured industrial training placements for your students.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: p.logoColor }}>
              <FlaskConical className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{p.title}</p>
            <p className="text-xs text-muted-foreground">{p.company} · {p.duration}</p>
            <Badge variant="outline" className="mt-2">{p.seats} seats available</Badge>
            <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => pushToast({ title: "Coordination request sent", description: p.company, variant: "success" })}>
              Coordinate Placement
            </Button>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
