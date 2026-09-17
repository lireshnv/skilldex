"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { ShieldCheck, MapPin, GraduationCap, Briefcase, Award, CalendarCheck2, KanbanSquare } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { RadialProgress } from "@/components/ui/progress";
import { SkillBar } from "@/components/skill-bar";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { studentById, skillName, projectsByStudent, resultsByStudent, assessmentById, readinessLabel } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = studentById(id);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  if (!student) return notFound();

  const projects = projectsByStudent(student.id);
  const results = resultsByStudent(student.id);

  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition" breadcrumbs={[{ label: "Recruiter", href: "/industry/recruiter" }, { label: "Talent Discovery", href: "/industry/recruiter/talent" }, { label: student.name }]}>
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} color={student.avatarColor} size={64} />
            <div>
              <p className="flex items-center gap-1.5 text-lg font-bold text-foreground">{student.name} <ShieldCheck className="h-4 w-4 text-emerald" /></p>
              <p className="text-sm text-muted-foreground">{student.targetRole}</p>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {student.college}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {student.location}</span>
              </div>
            </div>
          </div>
          <RadialProgress value={student.readiness} color="var(--accent-emerald)" sublabel="Readiness" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant={readinessLabel(student.readiness) === "Ready" ? "emerald" : "amber"}>{readinessLabel(student.readiness)}</Badge>
          <Badge variant="outline">CGPA {student.cgpa}</Badge>
          <Badge variant="outline">{student.internships} internships</Badge>
          <Badge variant="outline">{student.projects} projects</Badge>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{student.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => pushToast({ title: "Candidate shortlisted", description: student.name, variant: "success" })}>Shortlist</Button>
          <Button variant="outline" onClick={() => pushToast({ title: "Interview scheduling opened", description: student.name })}><CalendarCheck2 className="h-4 w-4" /> Schedule Interview</Button>
          <Button variant="ghost" onClick={() => pushToast({ title: "Added to pipeline", description: student.name })}><KanbanSquare className="h-4 w-4" /> Add to Pipeline</Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <RevealOnView className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Verified Skill Evidence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {student.skills.slice(0, 8).map((s) => (
                <SkillBar key={s.skillId} label={skillName(s.skillId)} value={s.confidence} />
              ))}
            </CardContent>
          </Card>
        </RevealOnView>

        <RevealOnView>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Award className="h-4 w-4 text-amber" /> Assessments</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {results.length > 0 ? results.map((r) => (
                <div key={r.id} className="rounded-[var(--radius-sm)] border border-border p-2.5 text-xs">
                  <p className="font-medium text-foreground">{assessmentById(r.assessmentId)?.title}</p>
                  <p className="text-muted-foreground">Score: {r.score}% · Accuracy: {r.accuracy}%</p>
                </div>
              )) : <p className="text-xs text-muted-foreground">No assessments on record.</p>}
            </CardContent>
          </Card>
        </RevealOnView>

        <RevealOnView className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-blue-2" /> Projects</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {projects.map((p) => (
                <div key={p.id} className="rounded-[var(--radius-md)] border border-border p-3">
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{p.skills.map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}</div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-xs text-muted-foreground">No projects on record.</p>}
            </CardContent>
          </Card>
        </RevealOnView>

        <RevealOnView>
          <Card>
            <CardHeader><CardTitle>Relevant Roles</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {["Software Engineer", "Backend Developer", "Full Stack Developer"].map((r) => (
                <div key={r} className="rounded-[var(--radius-sm)] border border-border p-2.5 text-sm text-foreground">{r}</div>
              ))}
            </CardContent>
          </Card>
        </RevealOnView>
      </div>
    </PortalShell>
  );
}
