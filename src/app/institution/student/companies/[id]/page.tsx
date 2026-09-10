"use client";
import { use } from "react";
import Link from "next/link";
import { MapPin, TrendingUp, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComparisonBarChart } from "@/components/charts/charts";
import { companyById, jobs, skillName, currentStudent, alumni } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { notFound } from "next/navigation";

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const company = companyById(id);
  const applications = useSkillDexStore((s) => s.applications);
  const applyToJob = useSkillDexStore((s) => s.applyToJob);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  if (!company) return notFound();

  const companyJobs = jobs.filter((j) => j.companyId === company.id);
  const relatedAlumni = alumni.filter((a) => a.company === company.name).slice(0, 3);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[
        { label: "Student", href: "/institution/student" },
        { label: "Company Explorer", href: "/institution/student/companies" },
        { label: company.name },
      ]}
    >
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] text-xl font-bold text-white" style={{ background: company.logoColor }}>
              {company.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
              <p className="text-sm text-muted-foreground">{company.industry} · {company.size} · <MapPin className="inline h-3.5 w-3.5" /> {company.location}</p>
            </div>
          </div>
          <Badge variant={company.hiringStatus === "Actively Hiring" ? "emerald" : "amber"}>{company.hiringStatus}</Badge>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{company.about}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {company.requiredSkills.map((s) => <Badge key={s} variant="blue">{skillName(s)}</Badge>)}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Open Roles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {companyJobs.map((j) => {
                const applied = applications.some((a) => a.jobId === j.id && a.studentId === currentStudent.id);
                return (
                  <div key={j.id} className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{j.title}</p>
                      <p className="text-xs text-muted-foreground">{j.type} · {j.package} · {j.location}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={applied ? "subtle" : "primary"}
                      disabled={applied}
                      onClick={() => { applyToJob(j.id, currentStudent.id); pushToast({ title: "Application submitted", description: j.title, variant: "success" }); }}
                    >
                      {applied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                );
              })}
              {companyJobs.length === 0 && <p className="text-sm text-muted-foreground">No open roles currently.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hiring & Internship Trend</CardTitle></CardHeader>
            <CardContent>
              <ComparisonBarChart
                data={company.history}
                xKey="year"
                bars={[
                  { key: "hires", color: "var(--brand-blue)", name: "Hires" },
                  { key: "internships", color: "var(--accent-emerald)", name: "Internships" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hiring Process</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Online Assessment", "Technical Interview", "HR Round", "Final Offer"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-light px-3 py-1.5 text-xs font-medium text-blue-2">{i + 1}. {step}</span>
                    {i < 3 && <ArrowRight className="h-3.5 w-3.5 text-border-strong" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-blue-2" /> Relationship Score</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{company.relationshipScore}<span className="text-sm text-muted-foreground">/100</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Based on hiring history, engagement and outcomes.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Users className="h-4 w-4 text-violet" /> Alumni at {company.name}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {relatedAlumni.length > 0 ? relatedAlumni.map((a) => (
                <Link key={a.id} href="/institution/student/alumni" className="flex items-center gap-2.5 text-sm hover:text-blue-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald" /> {a.name} — {a.role}
                </Link>
              )) : <p className="text-xs text-muted-foreground">No alumni experiences shared yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
