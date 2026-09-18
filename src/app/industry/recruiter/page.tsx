"use client";
import Link from "next/link";
import { UserSearch, Users, Clock, Award } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalHero } from "@/components/portal-hero";
import { SectionLabel } from "@/components/ui/section-label";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIInsight } from "@/components/ui/ai-insight";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { jobs, students, applications } from "@/lib/data";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecruiterDashboard() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const openJobs = jobs.filter((j) => j.status === "Open" && j.type === "Full-time").length;
  const totalApplicants = applications.length;

  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition">
      <PortalHero
        icon={UserSearch}
        eyebrow="Recruiter Workspace"
        title="Talent Intelligence"
        subtitle="Discover, assess and hire verified talent across partner institutions."
        accent="#6ea8ff"
      />

      <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem><KpiCard label="Open Jobs" value={openJobs} icon={UserSearch} accent="blue" /></StaggerItem>
        <StaggerItem><KpiCard label="Applicants" value={totalApplicants} icon={Users} accent="violet" trend={12} /></StaggerItem>
        <StaggerItem><KpiCard label="Shortlisted" value={Math.round(totalApplicants * 0.3)} icon={Award} accent="amber" /></StaggerItem>
        <StaggerItem><KpiCard label="Avg. Time to Hire" value="18" suffix=" days" icon={Clock} accent="emerald" trend={-8} /></StaggerItem>
      </StaggerGrid>

      <Card className="mt-6">
        <CardHeader><SectionLabel>Discovery</SectionLabel><CardTitle>Find your next candidate</CardTitle></CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/industry/recruiter/talent?q=${encodeURIComponent(query)}`);
            }}
          >
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by skill, role, college, readiness..." className="flex-1" />
            <Button variant="primary" type="submit"><UserSearch className="h-4 w-4" /> Search Talent</Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {["React", "System Design", "Machine Learning", "SQL"].map((s) => (
              <button key={s} onClick={() => setQuery(s)} className="rounded-full border border-border-strong px-3 py-1 text-xs text-muted-foreground hover:border-blue hover:text-blue-2 cursor-pointer">{s}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><SectionLabel>Ranked by readiness</SectionLabel><CardTitle>Top Matching Candidates</CardTitle></CardHeader>
          <CardContent>
            <StaggerGrid className="space-y-3">
              {[...students].sort((a, b) => b.readiness - a.readiness).slice(0, 4).map((s) => (
                <StaggerItem key={s.id}>
                  <Link href={`/industry/recruiter/candidates/${s.id}`} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3 hover:border-blue/30 hover:bg-blue-light/20">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.targetRole} · {s.college}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald">{s.readiness}% ready</span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Link href="/industry/recruiter/jobs/new"><Button variant="primary" className="w-full">Post a New Job</Button></Link>
          <Link href="/industry/recruiter/pipeline"><Button variant="outline" className="w-full">View Pipeline</Button></Link>
          <AIInsight>
            <strong>48 verified candidates</strong> match your Backend Developer requirement this week — 12 new since last check.
          </AIInsight>
        </div>
      </div>
    </PortalShell>
  );
}
