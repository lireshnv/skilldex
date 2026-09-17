"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, TrendingUp, Briefcase, Award, CheckCircle2 } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparisonBarChart, MultiLineChart } from "@/components/charts/charts";
import { AIInsight } from "@/components/ui/ai-insight";
import { students, applications, readinessLabel, pipelineStages } from "@/lib/data";

const facultyName = "Placement Officer";

const deptReadiness = ["CSE", "IT", "ECE", "AI & DS", "Mechanical"].map((dept) => {
  const deptStudents = students.filter((s) => s.department === dept);
  const avg = deptStudents.length ? Math.round(deptStudents.reduce((a, s) => a + s.readiness, 0) / deptStudents.length) : 0;
  return { label: dept, readiness: avg };
});

const placementTrend = [
  { label: "2022", placed: 68, applied: 90 },
  { label: "2023", placed: 74, applied: 95 },
  { label: "2024", placed: 79, applied: 98 },
  { label: "2025", placed: 84, applied: 99 },
  { label: "2026", placed: 71, applied: 88 },
];

export default function PlacementDashboard() {
  const router = useRouter();
  const readyCount = students.filter((s) => readinessLabel(s.readiness) === "Ready").length;
  const nearReadyCount = students.filter((s) => readinessLabel(s.readiness) === "Near Ready").length;
  const needsDevCount = students.filter((s) => readinessLabel(s.readiness) === "Needs Development").length;

  const funnelCounts = pipelineStages.map((stage, i) => {
    // simulate a decreasing funnel
    const base = applications.length;
    const decay = [1, 0.8, 0.62, 0.48, 0.34, 0.22, 0.14, 0.09][i] ?? 0.05;
    return { label: stage, count: Math.round(base * decay) };
  });

  const placementRate = Math.round((readyCount / students.length) * 100);

  return (
    <PortalShell portal="placement" userName={facultyName} userColor="#0b1e3f" userRole="Placement Cell">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Placement Intelligence Command Center</h1>
        <p className="text-sm text-muted-foreground">A real-time view of institutional placement readiness and outcomes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Students" value={students.length} icon={Users} accent="blue" />
        <KpiCard label="Ready" value={readyCount} icon={CheckCircle2} accent="emerald" trend={5} />
        <KpiCard label="Near Ready" value={nearReadyCount} icon={TrendingUp} accent="amber" />
        <KpiCard label="Needs Development" value={needsDevCount} icon={Users} accent="rose" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Applications" value={applications.length} icon={Briefcase} accent="blue" />
        <KpiCard label="Interviews" value={funnelCounts[4]?.count ?? 0} icon={Users} accent="violet" />
        <KpiCard label="Offers" value={funnelCounts[6]?.count ?? 0} icon={Award} accent="emerald" />
        <KpiCard label="Placement %" value={placementRate} suffix="%" icon={TrendingUp} accent="navy" trend={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Placement Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelCounts.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">{f.label}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue to-sky transition-all"
                      style={{ width: `${(f.count / funnelCounts[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs font-semibold text-foreground">{f.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Department Readiness</CardTitle></CardHeader>
          <CardContent>
            <ComparisonBarChart data={deptReadiness} bars={[{ key: "readiness", color: "var(--brand-blue)", name: "Readiness %" }]} height={220} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Placement Trend (5-Year)</CardTitle></CardHeader>
          <CardContent>
            <MultiLineChart
              data={placementTrend}
              lines={[{ key: "applied", color: "var(--brand-blue)", name: "Applied %" }, { key: "placed", color: "var(--accent-emerald)", name: "Placed %" }]}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <AIInsight actionLabel="View Skill Gap Analytics" onAction={() => router.push("/institution/placement/skill-gaps")}>
            <strong>Cloud Computing</strong> readiness is 18 points below industry benchmark across final-year CSE students.
            A focused 4-week bootcamp could close this gap before placement season.
          </AIInsight>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/institution/placement/skill-gaps">
              <Card className="p-4 hover:border-blue/30"><p className="text-sm font-semibold text-foreground">Skill Gap Analytics</p><p className="text-xs text-muted-foreground">Identify institutional gaps</p></Card>
            </Link>
            <Link href="/institution/placement/industry-relations">
              <Card className="p-4 hover:border-blue/30"><p className="text-sm font-semibold text-foreground">Industry Relations</p><p className="text-xs text-muted-foreground">Manage partnerships</p></Card>
            </Link>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
