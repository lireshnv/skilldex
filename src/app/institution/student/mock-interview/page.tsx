"use client";
import { useState } from "react";
import { Video, Mic, MicOff, PhoneOff, Bot, CheckCircle2 } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadialProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { currentStudent } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

const interviewQuestions = [
  "Tell me about yourself and your journey into software engineering.",
  "Walk me through how you'd design a scalable notification system.",
  "Describe a time you had to debug a difficult production issue.",
  "Why do you want to work in this role, and what excites you about it?",
];

export default function MockInterviewPage() {
  const [stage, setStage] = useState<"setup" | "live" | "done">("setup");
  const [qIndex, setQIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Mock Interview" }]}
    >
      {stage === "setup" && (
        <Card className="mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
            <Bot className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">AI Mock Interview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A simulated technical + behavioral interview for your target role: <strong className="text-foreground">{currentStudent.targetRole}</strong>.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3"><p className="font-bold text-foreground">4</p><p className="text-xs text-muted-foreground">Questions</p></div>
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3"><p className="font-bold text-foreground">~20 min</p><p className="text-xs text-muted-foreground">Duration</p></div>
          </div>
          <Button variant="primary" className="mt-6 w-full" onClick={() => setStage("live")}>
            <Video className="h-4 w-4" /> Start Interview
          </Button>
        </Card>
      )}

      {stage === "live" && (
        <div className="mx-auto max-w-2xl">
          <Card className="overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-navy">
              <div className="text-center text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Bot className="h-8 w-8 animate-pulse-soft" />
                </div>
                <p className="mt-3 text-sm font-medium">SkillDex AI Interviewer</p>
              </div>
            </div>
            <CardContent>
              <Badge variant="blue">Question {qIndex + 1} of {interviewQuestions.length}</Badge>
              <p className="mt-3 text-base font-medium text-foreground">{interviewQuestions[qIndex]}</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button variant={muted ? "destructive" : "outline"} size="icon" onClick={() => setMuted((m) => !m)}>
                  {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (qIndex < interviewQuestions.length - 1) setQIndex((i) => i + 1);
                    else { setStage("done"); pushToast({ title: "Mock interview complete", variant: "success" }); }
                  }}
                >
                  {qIndex < interviewQuestions.length - 1 ? "Next Question" : "Finish Interview"}
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setStage("setup")}>
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {stage === "done" && (
        <Card className="mx-auto max-w-lg p-8 text-center">
          <RadialProgress value={81} size={110} color="var(--accent-emerald)" />
          <h2 className="mt-4 text-lg font-bold text-foreground">Interview Complete</h2>
          <div className="mt-4 space-y-2 text-left text-sm">
            <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald" /> Strong structured communication</p>
            <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald" /> Clear technical reasoning</p>
            <p className="flex items-center gap-2 text-muted-foreground">→ Work on concise answers under time pressure</p>
          </div>
          <Button variant="primary" className="mt-6 w-full" onClick={() => { setStage("setup"); setQIndex(0); }}>Practice Again</Button>
        </Card>
      )}
    </PortalShell>
  );
}
