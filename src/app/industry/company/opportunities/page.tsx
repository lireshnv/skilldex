"use client";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { jobs, colleges, skillName } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { PlusCircle, Clock, Trophy, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

const types = ["Live Project", "Hackathon", "Workshop", "Mentorship", "Research", "Consultancy"] as const;
const opportunities = jobs.filter((j) => types.includes(j.type as typeof types[number])).slice(0, 15);
const hackathons = jobs.filter((j) => j.type === "Hackathon");

export default function OpportunitiesPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);

  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Opportunities" }]}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground">Manage projects, hackathons, mentorship and research you&apos;ve posted.</p>
        </div>
        <Link href="/industry/company/opportunities/new"><Button variant="primary"><PlusCircle className="h-4 w-4" /> Post Opportunity</Button></Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Opportunities</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((j) => (
              <StaggerItem key={j.id}>
                <Card hover className="p-4">
                  <Badge variant="blue">{j.type}</Badge>
                  <p className="mt-3 text-sm font-semibold text-foreground">{j.title}</p>
                  <p className="text-xs text-muted-foreground">{j.location}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{j.requiredSkills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}</div>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Closes {formatDate(j.deadline)}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </TabsContent>

        <TabsContent value="hackathons">
          <p className="mb-4 text-sm text-muted-foreground">Run branded hackathons across your partner college network.</p>
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hackathons.map((h, i) => (
              <StaggerItem key={h.id}>
                <Card hover className="p-4">
                  <Trophy className="h-6 w-6 text-amber" />
                  <p className="mt-3 text-sm font-semibold text-foreground">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{h.package}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(h.deadline)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {colleges[i % colleges.length].name}</span>
                  </div>
                  <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => pushToast({ title: "Hackathon proposal sent", description: colleges[i % colleges.length].name, variant: "success" })}>
                    Propose to College
                  </Button>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
