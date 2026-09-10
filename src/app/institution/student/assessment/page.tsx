"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ClipboardCheck, Clock, BarChart3, Search } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { assessmentDefs, resultsByStudent, currentStudent } from "@/lib/data";

const categories = ["All", "Technical", "Aptitude", "Soft Skills", "Domain"] as const;

const difficultyColor: Record<string, "emerald" | "amber" | "rose"> = {
  Beginner: "emerald",
  Intermediate: "amber",
  Advanced: "rose",
};

export default function AssessmentListPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const results = resultsByStudent(currentStudent.id);
  const resultMap = new Map(results.map((r) => [r.assessmentId, r]));

  const filtered = useMemo(() => {
    return assessmentDefs.filter((a) => {
      const matchesCategory = category === "All" || a.category === category;
      const matchesQuery = a.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Skill Assessment" }]}
    >
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Skill Assessment</h1>
        <p className="text-sm text-muted-foreground">Take assessments to verify your skills and improve your readiness score.</p>
      </div>

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
        {filtered.map((a) => {
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
    </PortalShell>
  );
}
