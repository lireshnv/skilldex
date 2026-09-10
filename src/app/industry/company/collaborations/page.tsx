"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { colleges } from "@/lib/data";
import { CheckCircle2 } from "lucide-react";

const timeline = ["Proposal", "College Approval", "Participants", "Execution", "Completion", "Outcome"];

const collaborations = [
  { college: colleges[8], title: "Hackathon: AI for Good", stage: 5, status: "Active" },
  { college: colleges[4], title: "Live Project: Fraud Detection Model", stage: 3, status: "Active" },
  { college: colleges[2], title: "Research: Applied ML in Manufacturing", stage: 2, status: "Pending" },
  { college: colleges[0], title: "Faculty Consultancy: Cloud Migration", stage: 6, status: "Completed" },
];

export default function CollaborationsPage() {
  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Collaborations" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Active Collaborations</h1>
        <p className="text-sm text-muted-foreground">Track proposals from submission through to outcomes.</p>
      </div>

      <div className="space-y-5">
        {collaborations.map((c, i) => (
          <Card key={i} className="p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.college.name}</p>
              </div>
              <Badge variant={c.status === "Completed" ? "emerald" : c.status === "Active" ? "blue" : "amber"}>{c.status}</Badge>
            </div>
            <Progress value={(c.stage / timeline.length) * 100} className="mt-4 mb-3" />
            <div className="flex items-center overflow-x-auto scrollbar-none">
              {timeline.map((t, i2) => (
                <div key={t} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${i2 < c.stage ? "bg-blue text-white" : "bg-surface-muted text-muted-foreground"}`}>
                      {i2 < c.stage ? <CheckCircle2 className="h-3.5 w-3.5" /> : i2 + 1}
                    </div>
                    <span className="whitespace-nowrap text-[9px] text-muted-foreground">{t}</span>
                  </div>
                  {i2 < timeline.length - 1 && <div className={`h-0.5 flex-1 ${i2 < c.stage - 1 ? "bg-blue" : "bg-surface-muted"}`} />}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
