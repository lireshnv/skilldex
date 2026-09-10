"use client";
import { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { students, jobs } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { Video, CheckCircle2 } from "lucide-react";

const upcoming = students.slice(0, 5).map((s, i) => ({ student: s, job: jobs[i % jobs.length], round: ["Technical", "System Design", "Behavioral", "HR", "Culture Fit"][i % 5], time: `${9 + i}:00 AM` }));
const completed = students.slice(5, 9).map((s, i) => ({ student: s, job: jobs[(i + 3) % jobs.length], round: "Technical", score: 65 + i * 7 }));

export default function InterviewsPage() {
  const [evaluating, setEvaluating] = useState<typeof completed[0] | null>(null);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition" breadcrumbs={[{ label: "Recruiter", href: "/industry/recruiter" }, { label: "Interviews" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Interviews</h1>
        <p className="text-sm text-muted-foreground">Manage upcoming interviews and submit scorecards.</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.map((u, i) => (
            <Card key={i} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={u.student.name} color={u.student.avatarColor} size={40} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{u.student.name}</p>
                  <p className="text-xs text-muted-foreground">{u.job.title} · {u.round} Round · {u.time}</p>
                </div>
              </div>
              <Button size="sm" variant="primary" onClick={() => pushToast({ title: "Joining interview room", description: u.student.name })}><Video className="h-3.5 w-3.5" /> Join</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.map((c, i) => (
            <Card key={i} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={c.student.name} color={c.student.avatarColor} size={40} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.student.name}</p>
                  <p className="text-xs text-muted-foreground">{c.job.title} · {c.round} Round</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.score >= 75 ? "emerald" : "amber"}>{c.score}% score</Badge>
                <Button size="sm" variant="outline" onClick={() => setEvaluating(c)}>View Scorecard</Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!evaluating} onOpenChange={() => setEvaluating(null)} title="Interview Scorecard">
        {evaluating && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">{evaluating.student.name} — {evaluating.round} Round</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-[var(--radius-sm)] bg-surface-muted p-2.5"><p className="font-bold text-foreground">{evaluating.score}%</p><p className="text-xs text-muted-foreground">Overall Score</p></div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted p-2.5"><p className="font-bold text-foreground">Strong</p><p className="text-xs text-muted-foreground">Recommendation</p></div>
            </div>
            <Textarea placeholder="Add evaluation notes..." defaultValue="Strong problem-solving skills, communicated approach clearly, could improve on edge case handling." />
            <Button variant="primary" className="w-full" onClick={() => { setEvaluating(null); pushToast({ title: "Evaluation submitted", variant: "success" }); }}>
              <CheckCircle2 className="h-4 w-4" /> Submit Evaluation
            </Button>
          </div>
        )}
      </Dialog>
    </PortalShell>
  );
}
