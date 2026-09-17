"use client";
import { Mic, Calendar, FlaskConical } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { FacultyOpportunityBoard } from "@/components/faculty-opportunity-board";
import { currentFaculty, companies } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

const trainingPrograms = companies.slice(0, 6).map((c, i) => ({
  id: `it-${i}`,
  company: c.name,
  title: `Industrial Training Placement — ${c.industry}`,
  duration: ["2 weeks", "4 weeks", "6 weeks"][i % 3],
  seats: 8 + i * 3,
  logoColor: c.logoColor,
}));

const lectureInvites = companies.slice(4, 10).map((c, i) => ({
  id: `gl-${i}`,
  company: c.name,
  topic: ["Modern System Design", "Cloud-Native Engineering", "AI in Production", "Data-Driven Decision Making", "Building Scalable APIs", "Career in FinTech"][i % 6],
  date: `2026-${String(9 + (i % 3)).padStart(2, "0")}-${String(10 + i * 2).padStart(2, "0")}`,
  logoColor: c.logoColor,
}));

export default function FacultyIndustryPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);

  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Industry" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Industry Engagement</h1>
        <p className="text-sm text-muted-foreground">FDPs, industrial training, guest lectures and consultancy — all matched to your expertise.</p>
      </div>

      <Tabs defaultValue="fdp">
        <TabsList className="mb-6">
          <TabsTrigger value="fdp">FDP</TabsTrigger>
          <TabsTrigger value="training">Industrial Training</TabsTrigger>
          <TabsTrigger value="lectures">Guest Lectures</TabsTrigger>
          <TabsTrigger value="consultancy">Consultancy</TabsTrigger>
        </TabsList>

        <TabsContent value="fdp">
          <FacultyOpportunityBoard showHeader={false} types={["Workshop"]} title="Faculty Development Programs" subtitle="FDPs and bootcamps matched to your expertise areas." />
        </TabsContent>

        <TabsContent value="training">
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainingPrograms.map((p) => (
              <StaggerItem key={p.id}>
                <Card className="p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: p.logoColor }}>
                    <FlaskConical className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.company} · {p.duration}</p>
                  <Badge variant="outline" className="mt-2">{p.seats} seats available</Badge>
                  <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => pushToast({ title: "Coordination request sent", description: p.company, variant: "success" })}>
                    Coordinate Placement
                  </Button>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </TabsContent>

        <TabsContent value="lectures">
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lectureInvites.map((inv) => (
              <StaggerItem key={inv.id}>
                <Card className="p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white" style={{ background: inv.logoColor }}>
                    <Mic className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{inv.topic}</p>
                  <p className="text-xs text-muted-foreground">Requested by {inv.company}</p>
                  <Badge variant="outline" className="mt-2"><Calendar className="mr-1 h-3 w-3 inline" />{inv.date}</Badge>
                  <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => pushToast({ title: "Invitation accepted", description: inv.topic, variant: "success" })}>
                    Accept Invitation
                  </Button>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </TabsContent>

        <TabsContent value="consultancy">
          <FacultyOpportunityBoard showHeader={false} types={["Consultancy"]} title="Consultancy Engagements" subtitle="Paid advisory engagements matched to your domain expertise." />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
