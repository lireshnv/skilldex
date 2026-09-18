"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { faculty, alumni, companies } from "@/lib/data";
import { ArrowRight, Users, GraduationCap, Wrench } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";

const labs = [
  { name: "AI & Machine Learning Lab", capacity: 40, equipped: true },
  { name: "Cloud Computing Lab", capacity: 30, equipped: true },
  { name: "Cybersecurity Lab", capacity: 25, equipped: true },
  { name: "IoT & Embedded Systems Lab", capacity: 20, equipped: false },
];

export default function ResourcesPage() {
  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Resource Intelligence" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">College Resource Intelligence</h1>
        <p className="text-sm text-muted-foreground">Available resources mapped against institutional skill gaps.</p>
      </div>

      <Card className="mb-6 border-amber/30 bg-amber-light/40">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground">Gap: Cloud Computing (62% below benchmark)</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="emerald">3 Faculty Available</Badge>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <Badge variant="emerald">Cloud Lab Available</Badge>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <Badge variant="amber">Missing: Industry-certified trainer</Badge>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <Badge variant="blue">Recommended: Partner with AWS-certified alumni</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faculty">
        <TabsList>
          <TabsTrigger value="faculty">Faculty Expertise</TabsTrigger>
          <TabsTrigger value="labs">Labs & Courses</TabsTrigger>
          <TabsTrigger value="alumni">Alumni Network</TabsTrigger>
          <TabsTrigger value="partners">Industry Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-2" /><p className="text-sm font-semibold text-foreground">{f.name}</p></div>
              <div className="mt-2 flex flex-wrap gap-1">{f.expertise.map((e) => <Badge key={e} variant="outline">{e}</Badge>)}</div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="labs" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {labs.map((l) => (
            <Card key={l.name} className="p-4">
              <Wrench className="h-4 w-4 text-violet" />
              <p className="mt-2 text-sm font-semibold text-foreground">{l.name}</p>
              <p className="text-xs text-muted-foreground">Capacity: {l.capacity}</p>
              <Badge variant={l.equipped ? "emerald" : "amber"} className="mt-2">{l.equipped ? "Fully Equipped" : "Needs Upgrade"}</Badge>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alumni" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.slice(0, 9).map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-emerald" /><p className="text-sm font-semibold text-foreground">{a.name}</p></div>
              <p className="mt-1 text-xs text-muted-foreground">{a.role} at {a.company}</p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="partners" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.slice(0, 9).map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center gap-2"><CompanyLogo name={c.name} color={c.logoColor} size={28} /><p className="text-sm font-semibold text-foreground">{c.name}</p></div>
              <p className="mt-1 text-xs text-muted-foreground">{c.industry} · Relationship: {c.relationshipScore}/100</p>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
