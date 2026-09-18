"use client";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/layout/portal-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OpportunityBoard } from "@/components/opportunity-board";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchBadge } from "@/components/ui/match-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { currentStudent, jobs, companyById } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { ApplicationRecord } from "@/lib/types";
import { FileStack, CheckCircle2 } from "lucide-react";

const stages: ApplicationRecord["stage"][] = ["Applied", "Screened", "Shortlisted", "Assessment", "Interview", "Final", "Offer", "Hired"];

const stageBadge: Record<string, "default" | "blue" | "amber" | "emerald" | "rose"> = {
  Applied: "default", Screened: "blue", Shortlisted: "blue", Assessment: "amber",
  Interview: "amber", Final: "amber", Offer: "emerald", Hired: "emerald", Rejected: "rose",
};

export default function StudentOpportunitiesPage() {
  const router = useRouter();
  const applications = useSkillDexStore((s) => s.applications).filter((a) => a.studentId === currentStudent.id);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Opportunities" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
        <p className="text-sm text-muted-foreground">Jobs, internships and live projects matched to your skill profile.</p>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="mb-6">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="internships">Internships & Live Projects</TabsTrigger>
          <TabsTrigger value="applications">My Applications{applications.length > 0 ? ` (${applications.length})` : ""}</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <OpportunityBoard showHeader={false} types={["Full-time"]} title="Jobs" subtitle="Full-time roles matched to your skill profile." />
        </TabsContent>

        <TabsContent value="internships">
          <OpportunityBoard showHeader={false} types={["Internship", "Live Project"]} title="Internships & Live Projects" subtitle="Hands-on opportunities to build real-world evidence." />
        </TabsContent>

        <TabsContent value="applications">
          {applications.length === 0 ? (
            <EmptyState
              icon={FileStack}
              title="No applications yet"
              description="Explore opportunities matched to your skill profile."
              actionLabel="Explore Jobs"
              onAction={() => router.push("/institution/student/opportunities")}
            />
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                const company = job ? companyById(job.companyId) : undefined;
                const stageIndex = stages.indexOf(app.stage);
                return (
                  <Card key={app.id} className="p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{job?.title}</p>
                        <p className="text-xs text-muted-foreground">{company?.name} · Applied {formatDate(app.appliedOn)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MatchBadge score={app.matchScore} />
                        <Badge variant={stageBadge[app.stage] ?? "default"}>{app.stage}</Badge>
                      </div>
                    </div>
                    {app.stage !== "Rejected" && (
                      <div className="mt-4 flex items-center">
                        {stages.map((s, i) => (
                          <div key={s} className="flex flex-1 items-center last:flex-none">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${i <= stageIndex ? "bg-blue text-white" : "bg-surface-muted text-muted-foreground"}`}>
                                {i <= stageIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                              </div>
                              <span className="hidden text-[9px] text-muted-foreground sm:block">{s}</span>
                            </div>
                            {i < stages.length - 1 && <div className={`h-0.5 flex-1 ${i < stageIndex ? "bg-blue" : "bg-surface-muted"}`} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
