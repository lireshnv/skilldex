"use client";
import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  ArrowLeft, RotateCcw, BookOpen,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, RadialProgress } from "@/components/ui/progress";
import { assessmentById, questionsFor, currentStudent } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Stage = "intro" | "quiz" | "results";

export default function AssessmentRunnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const def = assessmentById(id);
  const questions = useMemo(() => (def ? questionsFor(def.skillId) : []), [def]);

  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState((def?.duration ?? 15) * 60);

  useEffect(() => {
    if (stage !== "quiz" || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [stage, secondsLeft]);

  useEffect(() => {
    if (stage !== "quiz" || secondsLeft > 0) return;
    const t = setTimeout(() => setStage("results"), 0);
    return () => clearTimeout(t);
  }, [stage, secondsLeft]);

  if (!def) {
    return (
      <PortalShell portal="student" userName={currentStudent.name} userColor={currentStudent.avatarColor} userRole="Student">
        <p className="text-sm text-muted-foreground">Assessment not found.</p>
        <Link href="/institution/student/skills?tab=assess" className="text-blue-2 text-sm hover:underline">Back to assessments</Link>
      </PortalShell>
    );
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
  const score = Math.round((correctCount / questions.length) * 100);
  const accuracy = Object.keys(answers).length ? Math.round((correctCount / Object.keys(answers).length) * 100) : 0;

  function toggleFlag(i: number) {
    setFlagged((f) => {
      const next = new Set(f);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function submit() {
    setStage("results");
    pushToast({ title: "Assessment submitted", description: `You scored ${score}% on ${def!.title}`, variant: "success" });
  }

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[
        { label: "Student", href: "/institution/student" },
        { label: "Skills", href: "/institution/student/skills?tab=assess" },
        { label: def.title },
      ]}
    >
      {stage === "intro" && (
        <Card className="mx-auto max-w-xl p-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-blue-light text-blue-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">{def.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{def.category} · {def.difficulty}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
              <p className="text-lg font-bold text-foreground">{questions.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
              <p className="text-lg font-bold text-foreground">{def.duration} min</p>
              <p className="text-xs text-muted-foreground">Time limit</p>
            </div>
          </div>
          <ul className="mt-5 space-y-1.5 text-left text-xs text-muted-foreground">
            <li>• You can flag questions to revisit later.</li>
            <li>• Your results will update your verified Skill Passport.</li>
            <li>• The assessment auto-submits when time runs out.</li>
          </ul>
          <Button variant="primary" className="mt-6 w-full" onClick={() => setStage("quiz")}>Start Assessment</Button>
        </Card>
      )}

      {stage === "quiz" && questions.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="blue">Question {current + 1} of {questions.length}</Badge>
                <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", secondsLeft < 60 ? "bg-rose-light text-rose" : "bg-surface-muted text-foreground")}>
                  <Clock className="h-3.5 w-3.5" /> {mins}:{secs}
                </div>
              </div>
              <Progress value={((current + 1) / questions.length) * 100} className="mb-6" />

              <p className="text-base font-medium text-foreground">{questions[current].text}</p>
              <div className="mt-5 space-y-2.5">
                {questions[current].options.map((opt, i) => {
                  const selected = answers[current] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-colors cursor-pointer",
                        selected ? "border-blue bg-blue-light text-blue-2 font-medium" : "border-border-strong hover:bg-surface-muted"
                      )}
                    >
                      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]", selected ? "border-blue bg-blue text-white" : "border-border-strong text-muted-foreground")}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => toggleFlag(current)}>
                  <Flag className={cn("h-4 w-4", flagged.has(current) && "fill-amber text-amber")} />
                  {flagged.has(current) ? "Flagged" : "Flag for review"}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  {current < questions.length - 1 ? (
                    <Button variant="primary" size="sm" onClick={() => setCurrent((c) => c + 1)}>
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={submit}>Submit</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit p-4">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">Question Navigator</p>
            <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-xs font-medium cursor-pointer",
                    i === current ? "bg-blue text-white" : answers[i] !== undefined ? "bg-emerald-light text-emerald" : "bg-surface-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                  {flagged.has(i) && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber" />}
                </button>
              ))}
            </div>
            <Button variant="primary" size="sm" className="mt-4 w-full" onClick={submit}>Submit Assessment</Button>
          </Card>
        </div>
      )}

      {stage === "results" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card className="flex flex-col items-center gap-4 p-8 text-center">
            <RadialProgress value={score} size={120} strokeWidth={10} color={score >= 75 ? "var(--accent-emerald)" : score >= 50 ? "var(--brand-blue)" : "var(--accent-amber)"} />
            <div>
              <h2 className="text-xl font-bold text-foreground">Assessment Complete</h2>
              <p className="mt-1 text-sm text-muted-foreground">{def.title}</p>
            </div>
            <div className="grid w-full grid-cols-3 gap-3">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                <p className="text-lg font-bold text-foreground">{score}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                <p className="text-lg font-bold text-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                <p className="text-lg font-bold text-foreground">{correctCount}/{questions.length}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="mb-3 text-sm font-semibold text-foreground">Answer Review</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {questions.map((q, i) => {
                const correct = answers[i] === q.correctIndex;
                return (
                  <div key={i} className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-border p-2.5 text-xs">
                    {correct ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" /> : <XCircle className="h-4 w-4 shrink-0 text-rose" />}
                    <div>
                      <p className="font-medium text-foreground">{q.text}</p>
                      <p className="mt-0.5 text-muted-foreground">
                        Your answer: {answers[i] !== undefined ? q.options[answers[i]] : "Not answered"}
                        {!correct && <span> · Correct: {q.options[q.correctIndex]}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { setStage("intro"); setAnswers({}); setCurrent(0); setFlagged(new Set()); setSecondsLeft(def.duration * 60); }}>
              <RotateCcw className="h-4 w-4" /> Retake
            </Button>
            <Link href="/institution/student/skills?tab=passport">
              <Button variant="primary">View Updated Skill Passport</Button>
            </Link>
            <Link href="/institution/student/skills?tab=assess">
              <Button variant="ghost"><ArrowLeft className="h-4 w-4" /> All Assessments</Button>
            </Link>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
