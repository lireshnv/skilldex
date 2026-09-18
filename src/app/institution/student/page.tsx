"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  Target, TrendingUp, IdCard, ClipboardCheck, ArrowRight, CalendarClock,
  Video, FileStack, Users, Sparkles, MapPin, Clock, Flame,
  GraduationCap,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalHero } from "@/components/portal-hero";
import { CompanyLogo } from "@/components/company-logo";
import { SectionLabel } from "@/components/ui/section-label";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIInsight } from "@/components/ui/ai-insight";
import { MatchBadge } from "@/components/ui/match-badge";
import { RadialProgress } from "@/components/ui/progress";
import { SkillBar } from "@/components/skill-bar";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { currentStudent, jobs, skillName, companyById } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const roleRequiredSkills = ["sk-python", "sk-ml", "sk-dsa", "sk-sql"];

const colorClassMap: Record<string, string> = {
  blue: "bg-blue-light text-blue-2",
  violet: "bg-violet-light text-violet",
  rose: "bg-rose-light text-rose",
  amber: "bg-amber-light text-amber",
  emerald: "bg-emerald-light text-emerald",
};

const upcoming = [
  { type: "Assessment", title: "System Design Fundamentals", date: "2026-09-14", icon: ClipboardCheck, color: "blue" },
  { type: "Interview", title: "TCS Software Engineer — Technical Round", date: "2026-09-16", icon: Video, color: "violet" },
  { type: "Deadline", title: "Razorpay SDE Internship applications close", date: "2026-09-18", icon: FileStack, color: "rose" },
  { type: "Workshop", title: "Cloud Architecture Bootcamp", date: "2026-09-20", icon: CalendarClock, color: "amber" },
  { type: "Alumni Session", title: "Interview experiences at Google", date: "2026-09-22", icon: Users, color: "emerald" },
];

export default function StudentDashboard() {
  const router = useRouter();
  const applications = useSkillDexStore((s) => s.applications);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const applyToJob = useSkillDexStore((s) => s.applyToJob);
  const streak = useSkillDexStore((s) => s.streak);

  const myApplications = applications.filter((a) => a.studentId === currentStudent.id);

  const skillMap = useMemo(() => {
    const m = new Map(currentStudent.skills.map((s) => [s.skillId, s.confidence]));
    return m;
  }, []);

  const recommended = useMemo(() => {
    return jobs
      .filter((j) => j.type === "Full-time" || j.type === "Internship")
      .map((j) => {
        const overlap = j.requiredSkills.filter((s) => skillMap.has(s)).length;
        const match = Math.round((overlap / j.requiredSkills.length) * 100);
        return { job: j, match: Math.max(match, 40) };
      })
      .sort((a, b) => b.match - a.match)
      .slice(0, 4);
  }, [skillMap]);

  const firstName = currentStudent.name.split(" ")[0];

  return (
    <PortalShell portal="student" userName={currentStudent.name} userColor={currentStudent.avatarColor} userRole={`${currentStudent.department} · Year ${currentStudent.year}`}>
      <PortalHero
        icon={GraduationCap}
        eyebrow="Student Workspace"
        title={`Good morning, ${firstName} 👋`}
        subtitle="Your career journey, powered by SkillDex."
        accent="#5b8def"
      >
        <Link
          href="/institution/student/community"
          className="flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber-light px-3.5 py-1.5 text-xs font-semibold text-amber hover:border-amber/50 transition-colors"
        >
          <Flame className="h-3.5 w-3.5" /> {streak > 0 ? `${streak}-day streak` : "Start your streak"}
        </Link>
      </PortalHero>

      <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem><KpiCard label="Skill Readiness" value={`${currentStudent.readiness}`} suffix="%" icon={Target} accent="blue" trend={4} /></StaggerItem>
        <StaggerItem><KpiCard label="Industry Match" value={`${currentStudent.industryMatch}`} suffix="%" icon={TrendingUp} accent="emerald" trend={6} /></StaggerItem>
        <StaggerItem><KpiCard label="Profile Strength" value={`${currentStudent.profileStrength}`} suffix="%" icon={IdCard} accent="violet" trend={2} /></StaggerItem>
        <StaggerItem><KpiCard label="Applications" value={myApplications.length} icon={FileStack} accent="amber" trendLabel="active pipeline" /></StaggerItem>
      </StaggerGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Target role */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <SectionLabel>Focus</SectionLabel>
              <CardTitle>Target Role</CardTitle>
              <p className="mt-1 text-lg font-bold text-foreground">{currentStudent.targetRole}</p>
              <p className="text-xs text-muted-foreground">Target companies: Google, Microsoft, Innovate Labs, HealthBridge AI</p>
            </div>
            <RadialProgress value={currentStudent.readiness} label={`${currentStudent.readiness}%`} sublabel="Readiness" color="var(--brand-blue)" />
          </CardHeader>
          <CardContent className="space-y-4">
            {roleRequiredSkills.map((sid) => (
              <SkillBar key={sid} label={skillName(sid)} value={skillMap.get(sid) ?? 30} />
            ))}
            <div className="rounded-[var(--radius-md)] bg-amber-light px-3 py-2.5 text-xs text-amber">
              Improve Data Structures &amp; Algorithms to become interview ready for your target companies.
            </div>
          </CardContent>
        </Card>

        {/* Next best action */}
        <Card className="flex flex-col">
          <CardHeader>
            <SectionLabel>Guidance</SectionLabel>
            <CardTitle className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-2" /> Next Best Action</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Your highest-impact next step</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Complete 30 DSA problems this week to close your largest readiness gap before placement season.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/institution/student/growth">
                <Button variant="primary" size="sm">Start Practice</Button>
              </Link>
              <Link href="/institution/student/skills">
                <Button variant="outline" size="sm">View Plan</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Upcoming */}
        <Card>
          <CardHeader>
            <SectionLabel>Schedule</SectionLabel>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <StaggerGrid className="space-y-3">
              {upcoming.map((u) => (
                <StaggerItem key={u.title} className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${colorClassMap[u.color]}`}>
                    <u.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{u.type}</p>
                    <p className="truncate text-sm font-medium text-foreground">{u.title}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(u.date)}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CardContent>
        </Card>

        {/* Recommended opportunities */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-end justify-between">
            <div>
              <SectionLabel>Matched for you</SectionLabel>
              <CardTitle>Recommended Opportunities</CardTitle>
            </div>
            <Link href="/institution/student/opportunities" className="text-xs font-medium text-blue-2 hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <StaggerGrid className="space-y-3">
              {recommended.map(({ job, match }) => {
                const company = companyById(job.companyId);
                const applied = myApplications.some((a) => a.jobId === job.id);
                return (
                  <StaggerItem key={job.id} className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <CompanyLogo name={company?.name ?? "?"} color={company?.logoColor} size={40} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{company?.name} · <MapPin className="inline h-3 w-3" /> {job.location}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          <MatchBadge score={match} />
                          <Badge variant="outline"><Clock className="mr-1 h-3 w-3 inline" />Due {formatDate(job.deadline)}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={applied ? "subtle" : "primary"}
                      size="sm"
                      disabled={applied}
                      onClick={() => {
                        applyToJob(job.id, currentStudent.id);
                        pushToast({ title: "Application submitted", description: `Applied to ${job.title} at ${company?.name}`, variant: "success" });
                      }}
                    >
                      {applied ? "Applied" : "Apply"}
                    </Button>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AIInsight actionLabel="Explore Skill Graph" onAction={() => router.push("/institution/student/skills?tab=graph")}>
          Your <strong>Python</strong> and <strong>Data Structures</strong> skills connect to 3 strong project matches and 6 open roles at companies actively hiring this month.
        </AIInsight>
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/institution/student/skills?tab=graph" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-2 hover:underline">
          Explore your full Skill Graph <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PortalShell>
  );
}
