"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { School, FileStack, Rocket, GitBranch, Trophy, Users2 } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIInsight } from "@/components/ui/ai-insight";
import { colleges, jobs } from "@/lib/data";

const hubLinks = [
  { label: "College Discovery", href: "/industry/company/colleges", icon: School },
  { label: "Opportunities", href: "/industry/company/opportunities", icon: FileStack },
  { label: "Startup Assistant", href: "/industry/company/startup-assistant", icon: Rocket },
  { label: "Collaborations", href: "/industry/company/collaborations", icon: GitBranch },
  { label: "Hackathons", href: "/industry/company/hackathons", icon: Trophy },
  { label: "Faculty Network", href: "/industry/company/faculty", icon: Users2 },
];

export default function CompanyDashboard() {
  const router = useRouter();
  const activeOpportunities = jobs.filter((j) => ["Live Project", "Hackathon", "Workshop", "Mentorship", "Research", "Consultancy"].includes(j.type)).length;

  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Industry Collaboration Hub</h1>
        <p className="text-sm text-muted-foreground">Discover talent ecosystems and build lasting academia partnerships.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Partner Colleges" value={colleges.length} icon={School} accent="blue" />
        <KpiCard label="Active Opportunities" value={activeOpportunities} icon={FileStack} accent="emerald" />
        <KpiCard label="Collaborations" value={14} icon={GitBranch} accent="violet" trend={9} />
        <KpiCard label="Faculty Connections" value={22} icon={Users2} accent="amber" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hubLinks.map((h) => (
          <Link key={h.href} href={h.href}>
            <Card className="flex items-center gap-3 p-4 hover:border-blue/30 hover:shadow-[var(--shadow-md)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-navy text-white"><h.icon className="h-5 w-5" /></div>
              <p className="text-sm font-semibold text-foreground">{h.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Top Matching Colleges</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[...colleges].sort((a, b) => b.industryEngagementScore - a.industryEngagementScore).slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.city}, {c.state} · {c.placementRate}% placement rate</p>
                </div>
                <Badge variant="emerald">{c.industryEngagementScore}% engagement</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <AIInsight actionLabel="Discover Colleges" onAction={() => router.push("/industry/company/colleges")}>
          <strong>Vellore Institute of Technology</strong> shows strong AI talent depth and 15 active hackathons — a strong collaboration candidate this quarter.
        </AIInsight>
      </div>
    </PortalShell>
  );
}
