"use client";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobs, skillName } from "@/lib/data";
import { PlusCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

const types = ["Live Project", "Hackathon", "Workshop", "Mentorship", "Research", "Consultancy"] as const;
const opportunities = jobs.filter((j) => types.includes(j.type as typeof types[number])).slice(0, 15);

export default function OpportunitiesPage() {
  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Opportunities" }]}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground">Manage projects, hackathons, mentorship and research you&apos;ve posted.</p>
        </div>
        <Link href="/industry/company/opportunities/new"><Button variant="primary"><PlusCircle className="h-4 w-4" /> Post Opportunity</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((j) => (
          <Card key={j.id} className="p-4">
            <Badge variant="blue">{j.type}</Badge>
            <p className="mt-3 text-sm font-semibold text-foreground">{j.title}</p>
            <p className="text-xs text-muted-foreground">{j.location}</p>
            <div className="mt-2 flex flex-wrap gap-1">{j.requiredSkills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}</div>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Closes {formatDate(j.deadline)}</p>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
