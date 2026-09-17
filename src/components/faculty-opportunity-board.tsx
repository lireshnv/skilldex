"use client";
import { Building2, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { jobs, companyById, skillName } from "@/lib/data";
import { Job } from "@/lib/types";
import { useSkillDexStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export function FacultyOpportunityBoard({
  types,
  title,
  subtitle,
  showHeader = true,
}: {
  types: Job["type"][];
  title: string;
  subtitle: string;
  showHeader?: boolean;
}) {
  const pool = jobs.filter((j) => types.includes(j.type));
  const pushToast = useSkillDexStore((s) => s.pushToast);

  return (
    <div>
      {showHeader && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      )}

      {pool.length === 0 ? (
        <EmptyState title="No opportunities right now" description="Check back soon for new industry engagements." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pool.map((j) => {
            const company = companyById(j.companyId);
            return (
              <Card key={j.id} className="flex flex-col p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: company?.logoColor }}>
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{j.title}</p>
                <p className="text-xs text-muted-foreground">{company?.name}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(j.deadline)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{j.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {j.requiredSkills.slice(0, 2).map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  className="mt-3"
                  onClick={() => pushToast({ title: "Interest expressed", description: `${company?.name} will be notified of your interest in "${j.title}".`, variant: "success" })}
                >
                  Express Interest
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
