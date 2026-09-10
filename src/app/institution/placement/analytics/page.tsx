"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart, ComparisonBarChart, MultiLineChart } from "@/components/charts/charts";
import { students } from "@/lib/data";

const offerDistribution = [
  { name: "0-6 LPA", value: 18, color: "var(--brand-blue)" },
  { name: "6-12 LPA", value: 34, color: "var(--accent-emerald)" },
  { name: "12-20 LPA", value: 22, color: "var(--accent-amber)" },
  { name: "20+ LPA", value: 9, color: "var(--accent-violet)" },
];

const internshipConversion = [
  { label: "2023", rate: 58 }, { label: "2024", rate: 63 }, { label: "2025", rate: 69 }, { label: "2026", rate: 61 },
];

const genderDept = ["CSE", "IT", "ECE", "AI & DS", "Mechanical"].map((d) => ({
  label: d,
  applied: students.filter((s) => s.department === d).length * 2,
  offered: Math.round(students.filter((s) => s.department === d).length * 0.6),
}));

export default function PlacementAnalyticsPage() {
  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Analytics" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Placement Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep-dive analytics across offers, conversion and department performance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Offer Distribution</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={offerDistribution} />
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
              {offerDistribution.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name}</span>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Internship-to-Offer Conversion</CardTitle></CardHeader>
          <CardContent><MultiLineChart data={internshipConversion} lines={[{ key: "rate", color: "var(--accent-emerald)", name: "Conversion %" }]} /></CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Department-wise Applications vs Offers</CardTitle></CardHeader>
          <CardContent>
            <ComparisonBarChart data={genderDept} bars={[{ key: "applied", color: "var(--brand-blue)", name: "Applied" }, { key: "offered", color: "var(--accent-emerald)", name: "Offered" }]} />
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
