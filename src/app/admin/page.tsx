"use client";
import Link from "next/link";
import { Users, Building2, School, ClipboardCheck, FileStack, Activity, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { students, faculty, companies, colleges, jobs, assessmentDefs, applications } from "@/lib/data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const activity = [
  { text: "New application: Priya Verma → Zoho Frontend Intern", time: "2 min ago" },
  { text: "Assessment completed: Rahul Iyer scored 82% on DSA", time: "14 min ago" },
  { text: "New company onboarded: HealthBridge AI", time: "1 hr ago" },
  { text: "Faculty consultancy request: Dr. Ramesh Chandran ↔ Razorpay", time: "3 hrs ago" },
  { text: "Placement Cell created Cloud Computing Bootcamp", time: "5 hrs ago" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Admin" }]} />
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Portal Selection
        </Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
          <p className="text-sm text-muted-foreground">A lightweight administrative view of the SkillDex ecosystem.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard label="Students" value={students.length} icon={Users} accent="blue" />
          <KpiCard label="Faculty" value={faculty.length} icon={Users} accent="violet" />
          <KpiCard label="Institutions" value={colleges.length} icon={School} accent="emerald" />
          <KpiCard label="Companies" value={companies.length} icon={Building2} accent="amber" />
          <KpiCard label="Assessments" value={assessmentDefs.length} icon={ClipboardCheck} accent="rose" />
          <KpiCard label="Opportunities" value={jobs.length} icon={FileStack} accent="navy" />
        </div>

        <Card className="mt-6">
          <CardContent className="p-5">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground"><Activity className="h-4 w-4 text-blue-2" /> System Activity</p>
            <div className="space-y-2.5">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border p-2.5 text-sm">
                  <span className="text-foreground">{a.text}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{applications.length} total applications tracked</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
