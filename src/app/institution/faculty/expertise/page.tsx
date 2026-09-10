"use client";
import { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentFaculty, students, jobs, companyById } from "@/lib/data";

export default function ExpertisePage() {
  const [active, setActive] = useState(currentFaculty.expertise[0]);
  const relatedStudents = students.filter((s) => s.targetRole.toLowerCase().includes("engineer") || s.targetRole.toLowerCase().includes("data")).slice(0, 5);
  const relatedJobs = jobs.filter((j) => j.type === "Research" || j.type === "Consultancy").slice(0, 4);

  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Expertise Graph" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Expertise Graph</h1>
        <p className="text-sm text-muted-foreground">See how your expertise connects to students, companies, research and consultancy.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {currentFaculty.expertise.map((e) => (
          <button key={e} onClick={() => setActive(e)} className="cursor-pointer">
            <Badge variant={active === e ? "navy" : "outline"}>{e}</Badge>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground">Connected Students</p>
            <div className="mt-3 space-y-2">
              {relatedStudents.map((s) => (
                <div key={s.id} className="rounded-[var(--radius-sm)] border border-border p-2.5 text-sm text-foreground">{s.name} <span className="text-xs text-muted-foreground">· {s.targetRole}</span></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground">Industry Demand ({active})</p>
            <div className="mt-3 space-y-2">
              {relatedJobs.map((j) => (
                <div key={j.id} className="rounded-[var(--radius-sm)] border border-border p-2.5 text-sm text-foreground">
                  {j.title} <span className="text-xs text-muted-foreground">· {companyById(j.companyId)?.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground">Engagement Summary</p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Research Projects</span><span className="font-semibold text-foreground">4</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Consultancy Engagements</span><span className="font-semibold text-foreground">2</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">FDPs Attended</span><span className="font-semibold text-foreground">6</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Students Mentored</span><span className="font-semibold text-foreground">{currentFaculty.studentsMentored}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
