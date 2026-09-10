"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { students, jobs } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { pipelineStages } from "@/lib/data/applications";
import { cn } from "@/lib/utils";
import { ApplicationRecord } from "@/lib/types";

const stageColors: Record<string, string> = {
  Applied: "border-t-border-strong", Screened: "border-t-blue", Shortlisted: "border-t-blue",
  Assessment: "border-t-amber", Interview: "border-t-amber", Final: "border-t-violet",
  Offer: "border-t-emerald", Hired: "border-t-emerald",
};

export default function PipelinePage() {
  const applications = useSkillDexStore((s) => s.applications);
  const moveApplicationStage = useSkillDexStore((s) => s.moveApplicationStage);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const [dragging, setDragging] = useState<string | null>(null);

  const relevantApps = useMemo(() => applications.filter((a) => pipelineStages.includes(a.stage)).slice(0, 60), [applications]);

  function handleDrop(stage: ApplicationRecord["stage"]) {
    if (!dragging) return;
    moveApplicationStage(dragging, stage);
    pushToast({ title: "Candidate moved", description: `Moved to ${stage}`, variant: "success" });
    setDragging(null);
  }

  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition" breadcrumbs={[{ label: "Recruiter", href: "/industry/recruiter" }, { label: "Pipeline" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Recruitment Pipeline</h1>
        <p className="text-sm text-muted-foreground">Drag candidates between stages to move them through your hiring pipeline.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const items = relevantApps.filter((a) => a.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
              className="w-64 shrink-0"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-foreground">{stage}</p>
                <Badge variant="outline">{items.length}</Badge>
              </div>
              <div className={cn("min-h-[120px] space-y-2 rounded-[var(--radius-md)] border-t-4 bg-surface-muted/50 p-2", stageColors[stage])}>
                {items.map((app) => {
                  const student = students.find((s) => s.id === app.studentId);
                  const job = jobs.find((j) => j.id === app.jobId);
                  if (!student) return null;
                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={() => setDragging(app.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <Card className="p-3">
                        <Link href={`/industry/recruiter/candidates/${student.id}`} className="flex items-center gap-2">
                          <Avatar name={student.name} color={student.avatarColor} size={32} />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground">{student.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{job?.title}</p>
                          </div>
                        </Link>
                        <Badge variant="emerald" className="mt-2">{app.matchScore}% match</Badge>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PortalShell>
  );
}
