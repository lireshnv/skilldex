"use client";
import { Suspense, useState } from "react";
import { Award, FolderKanban, Briefcase, ClipboardCheck, Sparkles, ShieldCheck, Search, Clock, BarChart3, TrendingUp } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { RadialProgress } from "@/components/ui/progress";
import { SkillBar } from "@/components/skill-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { SkillGraphPanel } from "@/components/skill-graph-panel";
import { currentStudent, skillName, skillById, projectsByStudent, resultsByStudent, assessmentById, assessmentDefs, discoverSkillsFor } from "@/lib/data";
import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";

const categories = ["All", "Technical", "Aptitude", "Soft Skills", "Domain"] as const;
const difficultyColor: Record<string, "emerald" | "amber" | "rose"> = { Beginner: "emerald", Intermediate: "amber", Advanced: "rose" };

export default function StudentSkillsPage() {
  return (
    <Suspense fallback={null}>
      <StudentSkillsPageInner />
    </Suspense>
  );
}

function StudentSkillsPageInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = ["overview", "passport", "graph", "assess"].includes(tabParam ?? "") ? tabParam! : "overview";
  const [whyOpen, setWhyOpen] = useState<string | null>(null);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");

  const projects = projectsByStudent(currentStudent.id);
  const results = resultsByStudent(currentStudent.id);
  const activeSkill = whyOpen ? currentStudent.skills.find((s) => s.skillId === whyOpen) : null;
  const resultMap = new Map(results.map((r) => [r.assessmentId, r]));
  const topSkills = [...currentStudent.skills].sort((a, b) => b.confidence - a.confidence).slice(0, 6);
  const discovered = discoverSkillsFor(currentStudent, projects);

  const filteredAssessments = useMemo(() => {
    return assessmentDefs.filter((a) => (category === "All" || a.category === category) && a.title.toLowerCase().includes(query.toLowerCase()));
  }, [category, query]);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Skills" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Skills</h1>
        <p className="text-sm text-muted-foreground">Your verified skill profile, the graph behind it, and how to grow it.</p>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="passport">Passport</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="assess">Assess</TabsTrigger>
        </TabsList>

        {/* ---------- OVERVIEW ---------- */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-foreground">Skill Signal</p>
                <div className="mt-4 space-y-4">
                  {topSkills.map((s) => (
                    <SkillBar key={s.skillId} label={skillName(s.skillId)} value={s.confidence} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="h-fit">
              <CardContent className="p-5 text-center">
                <RadialProgress value={currentStudent.profileStrength} label={`${currentStudent.profileStrength}%`} sublabel="Profile Strength" />
                <p className="mt-4 text-xs text-muted-foreground">{currentStudent.skills.length} skills tracked · {projects.length} verified evidence items</p>
              </CardContent>
            </Card>
          </div>

          {discovered.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-5">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-blue-2" /> Skills Discovered
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Not on your skill list yet — but your activity already shows them.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {discovered.map((d) => (
                    <div key={d.label} className="rounded-[var(--radius-md)] border border-border p-3">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald" /> {d.label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.evidence}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ---------- PASSPORT ---------- */}
        <TabsContent value="passport">
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
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <Badge variant="blue">{s.level}</Badge>
                            <VerificationBadge level={s.verification} />
                          </div>
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
        </TabsContent>

        {/* ---------- GRAPH ---------- */}
        <TabsContent value="graph">
          <SkillGraphPanel />
        </TabsContent>

        {/* ---------- ASSESS ---------- */}
        <TabsContent value="assess">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    category === c ? "border-blue bg-blue-light text-blue-2" : "border-border-strong text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assessments..." className="pl-9" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAssessments.map((a) => {
              const result = resultMap.get(a.id);
              return (
                <Card key={a.id} className="flex flex-col p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-blue-light text-blue-2">
                      <ClipboardCheck className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant={difficultyColor[a.difficulty]}>{a.difficulty}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{a.title}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{a.questionCount} Questions</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.duration} min</span>
                  </div>
                  {result && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald">
                      <BarChart3 className="h-3.5 w-3.5" /> Last score: {result.score}%
                    </div>
                  )}
                  <Link href={`/institution/student/assessment/${a.id}`} className="mt-4">
                    <Button variant={result ? "outline" : "primary"} size="sm" className="w-full">
                      {result ? "Retake Assessment" : "Start Assessment"}
                    </Button>
                  </Link>
                </Card>
              );
            })}
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
