"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiLineChart, ComparisonBarChart, DonutChart } from "@/components/charts/charts";
import { colleges } from "@/lib/data";

const hiringTrend = [
  { label: "2023", hires: 12, internships: 22 }, { label: "2024", hires: 18, internships: 28 },
  { label: "2025", hires: 24, internships: 34 }, { label: "2026", hires: 19, internships: 29 },
];

const collegePerformance = colleges.slice(0, 6).map((c) => ({ label: c.name.split(" ").slice(0, 2).join(" "), score: c.industryEngagementScore }));

const candidateQuality = [
  { name: "Excellent", value: 28, color: "var(--accent-emerald)" },
  { name: "Good", value: 44, color: "var(--brand-blue)" },
  { name: "Average", value: 20, color: "var(--accent-amber)" },
  { name: "Below Average", value: 8, color: "var(--accent-rose)" },
];

export default function CompanyAnalyticsPage() {
  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Analytics" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Industry Analytics</h1>
        <p className="text-sm text-muted-foreground">Hiring trends, college performance and collaboration ROI.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Hiring & Internship Trend</CardTitle></CardHeader>
          <CardContent>
            <MultiLineChart data={hiringTrend} lines={[{ key: "hires", color: "var(--brand-blue)", name: "Hires" }, { key: "internships", color: "var(--accent-emerald)", name: "Internships" }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Candidate Quality Distribution</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={candidateQuality} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>College Engagement Performance</CardTitle></CardHeader>
          <CardContent>
            <ComparisonBarChart data={collegePerformance} layout="vertical" height={280} bars={[{ key: "score", color: "var(--brand-blue)", name: "Engagement Score" }]} />
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
