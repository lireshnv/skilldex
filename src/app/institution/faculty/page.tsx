"use client";
import Link from "next/link";
import { Users, Lightbulb, FlaskConical, HandCoins } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalHero } from "@/components/portal-hero";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIInsight } from "@/components/ui/ai-insight";
import { currentFaculty, jobs, companyById } from "@/lib/data";

const opportunityTypes = [
  { label: "Industry Engagement", href: "/institution/faculty/industry", icon: Lightbulb, count: jobs.filter((j) => ["Workshop", "Consultancy"].includes(j.type)).length },
  { label: "Research", href: "/institution/faculty/research", icon: FlaskConical, count: jobs.filter((j) => j.type === "Research").length },
];

export default function FacultyDashboard() {
  const industryOpportunities = jobs.filter((j) => ["Research", "Consultancy", "Workshop"].includes(j.type)).slice(0, 4);

  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
    >
      <PortalHero
        icon={Users}
        eyebrow="Faculty Workspace"
        title="Faculty Intelligence Dashboard"
        subtitle={`Welcome back, ${currentFaculty.name.replace("Dr. ", "")}.`}
        accent="#a78bfa"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Students Mentored" value={currentFaculty.studentsMentored} icon={Users} accent="blue" />
        <KpiCard label="Publications" value={currentFaculty.publications} icon={FlaskConical} accent="violet" />
        <KpiCard label="Industry Connections" value={currentFaculty.industryConnections} icon={HandCoins} accent="emerald" />
        <KpiCard label="Active Opportunities" value={industryOpportunities.length} icon={Lightbulb} accent="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>My Expertise</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentFaculty.expertise.map((e) => <Badge key={e} variant="blue">{e}</Badge>)}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{currentFaculty.bio}</p>
            <Link href="/institution/faculty/expertise">
              <Button variant="outline" size="sm" className="mt-4">View Expertise Graph</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Explore Opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {opportunityTypes.map((o) => (
              <Link key={o.href} href={o.href} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3 hover:border-blue/30 hover:bg-blue-light/20">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground"><o.icon className="h-4 w-4 text-blue-2" /> {o.label}</span>
                <Badge variant="outline">{o.count}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Industry Demand for Your Expertise</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {industryOpportunities.map((j) => {
            const company = companyById(j.companyId);
            return (
              <div key={j.id} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{j.title}</p>
                  <p className="text-xs text-muted-foreground">{company?.name} · {j.type}</p>
                </div>
                <Badge variant="blue">{j.type}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="mt-6">
        <AIInsight>
          Your expertise in <strong>{currentFaculty.expertise[0]}</strong> is trending upward in industry demand.
          3 companies are actively seeking faculty consultancy in this area this quarter.
        </AIInsight>
      </div>
    </PortalShell>
  );
}
