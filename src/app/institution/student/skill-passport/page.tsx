"use client";
import { useState } from "react";
import { Award, FolderKanban, Briefcase, ClipboardCheck, Sparkles, ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { RadialProgress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { currentStudent, skillName, skillById, projectsByStudent, resultsByStudent, assessmentById } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function SkillPassportPage() {
  const [whyOpen, setWhyOpen] = useState<string | null>(null);
  const projects = projectsByStudent(currentStudent.id);
  const results = resultsByStudent(currentStudent.id);
  const activeSkill = whyOpen ? currentStudent.skills.find((s) => s.skillId === whyOpen) : null;

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Skill Passport" }]}
    >
      <div className="mb-6 flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-gradient-to-br from-navy to-navy-2 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={currentStudent.name} color="#ffffff33" size={64} />
          <div>
            <p className="flex items-center gap-1.5 text-lg font-bold">
              {currentStudent.name} <ShieldCheck className="h-4 w-4 text-emerald" />
            </p>
            <p className="text-sm text-white/70">{currentStudent.targetRole} · {currentStudent.college}</p>
            <p className="text-xs text-white/50">Digital Skill Passport · Demo verification</p>
          </div>
        </div>
        <RadialProgress value={currentStudent.profileStrength} color="#ffffff" label={`${currentStudent.profileStrength}%`} sublabel="Profile Strength" />
      </div>

      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skills">Verified Skills</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <div className="grid gap-3 sm:grid-cols-2">
            {currentStudent.skills.map((s) => {
              const skill = skillById(s.skillId);
              return (
                <Card key={s.skillId} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{skillName(s.skillId)}</p>
                      <Badge variant="blue" className="mt-1.5">{s.level}</Badge>
                    </div>
                    <RadialProgress value={s.confidence} size={54} strokeWidth={5} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{s.evidenceCount} evidence items · verified {formatDate(s.lastVerified)}</span>
                    <button onClick={() => setWhyOpen(s.skillId)} className="font-medium text-blue-2 hover:underline cursor-pointer">Why this score?</button>
                  </div>
                  {skill && <p className="mt-2 text-[11px] text-muted-foreground">Industry demand: {skill.demand}%</p>}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r) => {
              const def = assessmentById(r.assessmentId);
              return (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-blue-2" />
                      <p className="text-sm font-semibold text-foreground">{def?.title}</p>
                    </div>
                    <Badge variant={r.score >= 75 ? "emerald" : r.score >= 55 ? "amber" : "rose"}>{r.score}%</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Taken on {formatDate(r.takenOn)} · {r.accuracy}% accuracy</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.strengths.map((s) => <Badge key={s} variant="emerald">{s}</Badge>)}
                  </div>
                </Card>
              );
            })}
            {results.length === 0 && <p className="text-sm text-muted-foreground">No assessments taken yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-violet" />
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  </div>
                  {p.verified && <Badge variant="emerald"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}
                </div>
              </Card>
            ))}
            {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects added yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4 text-center">
              <Briefcase className="mx-auto h-5 w-5 text-blue-2" />
              <p className="mt-2 text-xl font-bold text-foreground">{currentStudent.internships}</p>
              <p className="text-xs text-muted-foreground">Internships</p>
            </Card>
            <Card className="p-4 text-center">
              <Award className="mx-auto h-5 w-5 text-amber" />
              <p className="mt-2 text-xl font-bold text-foreground">{currentStudent.certifications}</p>
              <p className="text-xs text-muted-foreground">Certifications</p>
            </Card>
            <Card className="p-4 text-center">
              <Sparkles className="mx-auto h-5 w-5 text-emerald" />
              <p className="mt-2 text-xl font-bold text-foreground">{currentStudent.offers}</p>
              <p className="text-xs text-muted-foreground">Offers</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!whyOpen} onOpenChange={() => setWhyOpen(null)} title="Why this score?">
        {activeSkill && (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Your <strong className="text-foreground">{skillName(activeSkill.skillId)}</strong> confidence of{" "}
              <strong className="text-foreground">{activeSkill.confidence}%</strong> is calculated from:
            </p>
            <ul className="space-y-1.5 pl-1">
              <li>• Assessment performance (weighted 40%)</li>
              <li>• Verified project evidence — {activeSkill.evidenceCount} items (weighted 30%)</li>
              <li>• Recency of last verification: {formatDate(activeSkill.lastVerified)} (weighted 15%)</li>
              <li>• Peer & mentor endorsements (weighted 15%)</li>
            </ul>
          </div>
        )}
      </Dialog>
    </PortalShell>
  );
}
