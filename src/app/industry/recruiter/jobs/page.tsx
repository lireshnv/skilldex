"use client";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobs, applicationsByJob, skillName } from "@/lib/data";
import { PlusCircle, Users, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

const myJobs = jobs.filter((j) => j.type === "Full-time" || j.type === "Internship").slice(0, 12);

export default function RecruiterJobsPage() {
  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition" breadcrumbs={[{ label: "Recruiter", href: "/industry/recruiter" }, { label: "Jobs" }]}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
          <p className="text-sm text-muted-foreground">Manage your open roles and track applicant volume.</p>
        </div>
        <Link href="/industry/recruiter/jobs/new"><Button variant="primary"><PlusCircle className="h-4 w-4" /> Post a Job</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myJobs.map((j) => {
          const apps = applicationsByJob(j.id);
          return (
            <Card key={j.id} className="p-4">
              <div className="flex items-start justify-between">
                <Badge variant="blue">{j.type}</Badge>
                <Badge variant={j.status === "Open" ? "emerald" : "outline"}>{j.status}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{j.title}</p>
              <p className="text-xs text-muted-foreground">{j.location} · {j.package}</p>
              <div className="mt-2 flex flex-wrap gap-1">{j.requiredSkills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {apps.length} applicants</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDate(j.deadline)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </PortalShell>
  );
}
