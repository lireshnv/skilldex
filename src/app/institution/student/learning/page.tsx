"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { currentStudent, skills } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { BookOpen, PlayCircle } from "lucide-react";

const courses = [
  { id: "c1", title: "Complete DSA Masterclass", provider: "SkillDex Learning", skill: "sk-dsa", progress: 62, hours: 24 },
  { id: "c2", title: "SQL for Data Roles", provider: "SkillDex Learning", skill: "sk-sql", progress: 35, hours: 10 },
  { id: "c3", title: "System Design Primer", provider: "SkillDex Learning", skill: "sk-system-design", progress: 12, hours: 18 },
  { id: "c4", title: "React & Modern Frontend", provider: "SkillDex Learning", skill: "sk-react", progress: 80, hours: 16 },
  { id: "c5", title: "Cloud Computing Essentials (AWS)", provider: "SkillDex Learning", skill: "sk-cloud", progress: 5, hours: 14 },
  { id: "c6", title: "Machine Learning Foundations", provider: "SkillDex Learning", skill: "sk-ml", progress: 0, hours: 22 },
];

export default function LearningPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Learning" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Learning</h1>
        <p className="text-sm text-muted-foreground">Curated courses to close your skill gaps, ranked by impact on your readiness.</p>
      </div>

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
    </PortalShell>
  );
}
