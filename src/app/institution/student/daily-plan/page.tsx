"use client";
import { CheckCircle2, Circle, PlayCircle, SkipForward, Flame } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendAreaChart } from "@/components/charts/charts";
import { AIInsight } from "@/components/ui/ai-insight";
import { currentStudent } from "@/lib/data";
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

export default function DailyPlanPage() {
  const completed = useSkillDexStore((s) => s.completedTasks);
  const toggleTaskComplete = useSkillDexStore((s) => s.toggleTaskComplete);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const streak = useSkillDexStore((s) => s.streak);
  const doneCount = tasks.filter((t) => completed.includes(t.id)).length;

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Daily Plan" }]}
    >
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Your plan for today</h1>
        <p className="text-sm text-muted-foreground">Based on your skill gaps and target role.</p>
      </div>

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
    </PortalShell>
  );
}
