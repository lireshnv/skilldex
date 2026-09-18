"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Circle, PlayCircle, SkipForward, Flame, BookOpen,
  FolderKanban, Plus, ShieldCheck, Video, Lightbulb,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendAreaChart } from "@/components/charts/charts";
import { AIInsight } from "@/components/ui/ai-insight";
import { currentStudent, skills, projectsByStudent, skillName } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const tasks = [
  { id: "t1", time: "09:00", title: "DSA Practice — Arrays & Recursion", duration: "30 min" },
  { id: "t2", time: "11:00", title: "SQL Learning — Joins & Subqueries", duration: "45 min" },
  { id: "t3", time: "15:00", title: "Build Project — Portfolio Website", duration: "60 min" },
  { id: "t4", time: "18:00", title: "Mock Interview — Technical Round", duration: "30 min" },
];

const weekly = [
  { label: "Mon", value: 60 }, { label: "Tue", value: 75 }, { label: "Wed", value: 45 },
  { label: "Thu", value: 90 }, { label: "Fri", value: 65 }, { label: "Sat", value: 40 }, { label: "Sun", value: 20 },
];

const courses = [
  { id: "c1", title: "Complete DSA Masterclass", provider: "SkillDex Learning", skill: "sk-dsa", progress: 62, hours: 24 },
  { id: "c2", title: "SQL for Data Roles", provider: "SkillDex Learning", skill: "sk-sql", progress: 35, hours: 10 },
  { id: "c3", title: "System Design Primer", provider: "SkillDex Learning", skill: "sk-system-design", progress: 12, hours: 18 },
  { id: "c4", title: "React & Modern Frontend", provider: "SkillDex Learning", skill: "sk-react", progress: 80, hours: 16 },
  { id: "c5", title: "Cloud Computing Essentials (AWS)", provider: "SkillDex Learning", skill: "sk-cloud", progress: 5, hours: 14 },
  { id: "c6", title: "Machine Learning Foundations", provider: "SkillDex Learning", skill: "sk-ml", progress: 0, hours: 22 },
];

const technicalQs = [
  "Explain the difference between an array and a linked list.",
  "What is the time complexity of merge sort and why?",
  "How would you design a URL shortening service?",
  "Explain normalization in databases with an example.",
  "What is the difference between REST and GraphQL?",
];
const behavioralQs = [
  "Tell me about a time you faced a conflict in a team project.",
  "Describe a challenging bug you fixed and how you approached it.",
  "Why do you want to work at this company?",
  "Tell me about a project you're most proud of.",
  "How do you handle tight deadlines?",
];

export default function StudentGrowthPage() {
  const completed = useSkillDexStore((s) => s.completedTasks);
  const toggleTaskComplete = useSkillDexStore((s) => s.toggleTaskComplete);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const streak = useSkillDexStore((s) => s.streak);
  const doneCount = tasks.filter((t) => completed.includes(t.id)).length;

  const [projectOpen, setProjectOpen] = useState(false);
  const projects = projectsByStudent(currentStudent.id);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Growth" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Growth</h1>
        <p className="text-sm text-muted-foreground">Your daily plan, learning, projects, and interview readiness — all in one place.</p>
      </div>

      <Tabs defaultValue="plan">
        <TabsList className="mb-6">
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        {/* ---------- PLAN ---------- */}
        <TabsContent value="plan">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Today&apos;s Tasks</CardTitle>
                <Badge variant="blue">{doneCount}/{tasks.length} complete</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={(doneCount / tasks.length) * 100} className="mb-2" />
                {tasks.map((t) => {
                  const done = completed.includes(t.id);
                  return (
                    <div key={t.id} className={cn("flex items-center gap-3 rounded-[var(--radius-md)] border p-3", done ? "border-emerald/30 bg-emerald-light/40" : "border-border")}>
                      <button onClick={() => toggleTaskComplete(t.id)} className="cursor-pointer">
                        {done ? <CheckCircle2 className="h-5 w-5 text-emerald" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", done ? "text-muted-foreground line-through" : "text-foreground")}>{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.time} · {t.duration}</p>
                      </div>
                      {!done && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="primary" onClick={() => { toggleTaskComplete(t.id); pushToast({ title: "Task completed", description: t.title, variant: "success" }); }}>
                            <PlayCircle className="h-3.5 w-3.5" /> Start
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => pushToast({ title: "Task skipped", description: t.title })}>
                            <SkipForward className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-amber" /> Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendAreaChart data={weekly} dataKey="value" color="var(--brand-blue)" height={180} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {streak > 0
                    ? <>You&apos;re on a <strong className="text-foreground">{streak}-day streak</strong>. Keep it going!</>
                    : "Complete a task today to start your streak."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <AIInsight>
              Completing today&apos;s plan will raise your <strong>DSA readiness</strong> from 65% to an estimated <strong>71%</strong>,
              moving you closer to interview-ready status for Software Engineer roles.
            </AIInsight>
          </div>
        </TabsContent>

        {/* ---------- LEARN ---------- */}
        <TabsContent value="learn">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => {
              const skill = skills.find((s) => s.id === c.skill);
              return (
                <Card key={c.id} className="p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-blue-light text-blue-2">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.provider} · {c.hours}h</p>
                  {skill && <Badge variant="outline" className="mt-2">{skill.name}</Badge>}
                  <Progress value={c.progress} className="mt-3" />
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.progress}% complete</p>
                  <Button size="sm" variant={c.progress > 0 ? "outline" : "primary"} className="mt-3 w-full" onClick={() => pushToast({ title: "Resuming course", description: c.title })}>
                    <PlayCircle className="h-3.5 w-3.5" /> {c.progress > 0 ? "Continue" : "Start Course"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ---------- BUILD ---------- */}
        <TabsContent value="build">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Projects become verified evidence in your Skill Passport.</p>
            <Button variant="primary" onClick={() => setProjectOpen(true)}><Plus className="h-4 w-4" /> Add Project</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-violet-light text-violet">
                    <FolderKanban className="h-4.5 w-4.5" />
                  </div>
                  {p.verified && <Badge variant="emerald"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}
                </div>
              </Card>
            ))}
          </div>

          <Dialog open={projectOpen} onOpenChange={setProjectOpen} title="Add a Project" description="Add project details — SkillDex will match it to relevant skills.">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setProjectOpen(false);
                pushToast({ title: "Project submitted for verification", description: "It will appear in your Skill Passport shortly.", variant: "success" });
              }}
            >
              <Input placeholder="Project title" required />
              <Textarea placeholder="Brief description" required />
              <Input placeholder="Skills used (comma separated)" />
              <Button type="submit" variant="primary" className="w-full">Submit Project</Button>
            </form>
          </Dialog>
        </TabsContent>

        {/* ---------- PRACTICE ---------- */}
        <TabsContent value="practice">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="technical">
                <TabsList>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                </TabsList>
                <TabsContent value="technical" className="mt-4 space-y-2.5">
                  {technicalQs.map((q, i) => (
                    <Card key={i} className="p-4 text-sm text-foreground">{i + 1}. {q}</Card>
                  ))}
                </TabsContent>
                <TabsContent value="behavioral" className="mt-4 space-y-2.5">
                  {behavioralQs.map((q, i) => (
                    <Card key={i} className="p-4 text-sm text-foreground">{i + 1}. {q}</Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-1.5"><Video className="h-4 w-4 text-blue-2" /> Mock Interview</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Practice live with an AI interviewer or book a session with an alumni mentor.</p>
                  <Link href="/institution/student/mock-interview">
                    <Button variant="primary" size="sm" className="mt-3 w-full">Start Mock Interview</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-1.5"><Lightbulb className="h-4 w-4 text-amber" /> Tips</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• Structure answers using the STAR method for behavioral questions.</p>
                  <p>• Think aloud during technical questions — interviewers value process.</p>
                  <p>• Always clarify requirements before diving into a solution.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
