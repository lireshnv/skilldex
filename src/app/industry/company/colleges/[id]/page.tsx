"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { MapPin, Users, Trophy, Rocket, Sparkles } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeById, students } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const college = collegeById(id);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  if (!college) return notFound();

  const topStudents = students.filter((s) => s.collegeId === college.id).sort((a, b) => b.readiness - a.readiness).slice(0, 6);

  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "College Discovery", href: "/industry/company/colleges" }, { label: college.name }]}>
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] text-xl font-bold text-white" style={{ background: college.logoColor }}>{college.name[0]}</div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{college.name}</h1>
              <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {college.city}, {college.state}</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => pushToast({ title: "Partnership proposal sent", description: college.name, variant: "success" })}>Propose Collaboration</Button>
        </div>
      </Card>

      <Card className="mb-6 border-blue/20 bg-blue-light/40">
        <CardContent className="p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-blue-2"><Sparkles className="h-4 w-4" /> Why this college?</p>
          <ul className="mt-2 space-y-1 text-sm text-foreground">
            <li>• Strong talent depth in {college.topSkills.slice(0, 2).join(" and ")}</li>
            <li>• {college.hackathons} active hackathons this year</li>
            <li>• {college.placementRate}% placement rate with {college.startupParticipation} startup participants</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-2" /> Overview</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Students</span><span className="font-semibold text-foreground">{college.totalStudents.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Placement Rate</span><span className="font-semibold text-foreground">{college.placementRate}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Departments</span><span className="font-semibold text-foreground">{college.departments.length}</span></div>
            <div className="flex flex-wrap gap-1 pt-2">{college.departments.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-amber" /> Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Hackathons</span><span className="font-semibold text-foreground">{college.hackathons}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Startup Participation</span><span className="font-semibold text-foreground">{college.startupParticipation}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Engagement Score</span><span className="font-semibold text-foreground">{college.industryEngagementScore}%</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Rocket className="h-4 w-4 text-violet" /> Top Talent</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{s.name}</span>
                <Badge variant="emerald">{s.readiness}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
