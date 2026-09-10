"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, BadgeCheck } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { currentStudent, jobs, companyById } from "@/lib/data";
import { cn } from "@/lib/utils";

const rules = [
  { label: "Minimum CGPA", value: "6.0", met: currentStudent.cgpa >= 6.0 },
  { label: "Maximum active backlogs", value: "1", met: currentStudent.backlogs <= 1 },
  { label: "Previous offer restriction", value: currentStudent.offers > 0 ? "1 offer already accepted" : "No offers accepted yet", met: currentStudent.offers === 0 },
  { label: "Eligible department", value: currentStudent.department, met: true },
  { label: "Eligible graduation year", value: `Year ${currentStudent.year}`, met: currentStudent.year >= 3 },
];

export default function EligibilityPage() {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const job = jobs.find((j) => j.id === selectedJobId)!;
  const company = companyById(job.companyId);

  const checks = [
    { label: `CGPA ≥ ${job.eligibility.minCgpa}`, met: currentStudent.cgpa >= job.eligibility.minCgpa, detail: `Your CGPA: ${currentStudent.cgpa}` },
    { label: `Backlogs ≤ ${job.eligibility.maxBacklogs}`, met: currentStudent.backlogs <= job.eligibility.maxBacklogs, detail: `Your backlogs: ${currentStudent.backlogs}` },
    { label: `Department in [${job.eligibility.departments.join(", ")}]`, met: job.eligibility.departments.includes(currentStudent.department), detail: `Your department: ${currentStudent.department}` },
    { label: `Year in [${job.eligibility.years.join(", ")}]`, met: job.eligibility.years.includes(currentStudent.year), detail: `Your year: ${currentStudent.year}` },
  ];
  const eligible = checks.every((c) => c.met);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Eligibility" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Placement Eligibility</h1>
        <p className="text-sm text-muted-foreground">Understand institution placement rules and whether you qualify for a specific opportunity.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Institution Placement Rules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {rules.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.value}</p>
                </div>
                {r.met ? <CheckCircle2 className="h-5 w-5 text-emerald" /> : <XCircle className="h-5 w-5 text-rose" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Can I apply?</CardTitle>
            <Select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} className="mt-2 w-full sm:w-80">
              {jobs.slice(0, 20).map((j) => (
                <option key={j.id} value={j.id}>{j.title} — {companyById(j.companyId)?.name}</option>
              ))}
            </Select>
          </CardHeader>
          <CardContent>
            <div className={cn("flex items-center gap-3 rounded-[var(--radius-md)] p-4", eligible ? "bg-emerald-light" : "bg-rose-light")}>
              {eligible ? <CheckCircle2 className="h-8 w-8 text-emerald" /> : <XCircle className="h-8 w-8 text-rose" />}
              <div>
                <p className={cn("text-lg font-bold", eligible ? "text-emerald" : "text-rose")}>{eligible ? "Eligible ✓" : "Not Eligible"}</p>
                <p className="text-xs text-muted-foreground">{job.title} at {company?.name}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Why:</p>
              {checks.map((c) => (
                <div key={c.label} className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-border p-2.5 text-sm">
                  {c.met ? <BadgeCheck className="h-4 w-4 shrink-0 text-emerald" /> : <XCircle className="h-4 w-4 shrink-0 text-rose" />}
                  <div>
                    <p className="text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
