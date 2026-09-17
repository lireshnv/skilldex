"use client";
import { useMemo, useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { companies } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { TrendingUp, Users, Trophy, Mic, Sparkles } from "lucide-react";

export default function IndustryRelationsPage() {
  const [sizeFilter, setSizeFilter] = useState("All");
  const pushToast = useSkillDexStore((s) => s.pushToast);

  const activePartners = [...companies].sort((a, b) => b.relationshipScore - a.relationshipScore);
  const discovered = useMemo(() => {
    return companies
      .filter((c) => sizeFilter === "All" || c.size === sizeFilter)
      .filter((c) => c.relationshipScore < 80)
      .sort((a, b) => a.relationshipScore - b.relationshipScore);
  }, [sizeFilter]);

  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Industry Relations" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Industry Relations</h1>
        <p className="text-sm text-muted-foreground">Manage existing partnerships and discover new companies to reach out to.</p>
      </div>

      <Tabs defaultValue="relations">
        <TabsList className="mb-6">
          <TabsTrigger value="relations">Company Relations</TabsTrigger>
          <TabsTrigger value="discovery">Company Discovery</TabsTrigger>
        </TabsList>

        <TabsContent value="relations">
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activePartners.map((c) => (
              <StaggerItem key={c.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: c.logoColor }}>{c.name[0]}</div>
                    <Badge variant={c.relationshipScore >= 80 ? "emerald" : c.relationshipScore >= 65 ? "amber" : "outline"}>{c.relationshipScore}/100</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.industry}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.history.at(-1)?.hires} hires (2025)</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {c.history.at(-1)?.internships} interns</span>
                  </div>
                  <div className="mt-3 rounded-[var(--radius-sm)] bg-blue-light/60 p-2.5 text-xs text-blue-2">
                    Next best engagement: {c.relationshipScore < 70 ? "Schedule a relationship-building call" : "Invite for campus hackathon"}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => pushToast({ title: "Hackathon invite sent", description: c.name })}><Trophy className="h-3.5 w-3.5" /> Invite Hackathon</Button>
                    <Button size="sm" variant="primary" onClick={() => pushToast({ title: "Guest lecture requested", description: c.name })}><Mic className="h-3.5 w-3.5" /> Request Lecture</Button>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </TabsContent>

        <TabsContent value="discovery">
          <div className="mb-4 flex justify-end">
            <Select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="w-full sm:w-48">
              <option>All</option>
              <option>Startup</option>
              <option>Mid-size</option>
              <option>Enterprise</option>
            </Select>
          </div>
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discovered.map((c) => (
              <StaggerItem key={c.id}>
                <Card className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: c.logoColor }}>{c.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.industry} · {c.size}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-1.5 rounded-[var(--radius-sm)] bg-blue-light/60 p-2.5 text-xs text-blue-2">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Why SkillDex recommends: {c.hiringStatus} · avg package ₹{c.avgPackage} LPA · growing hiring trend
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">View Company</Button>
                    <Button size="sm" variant="primary" onClick={() => pushToast({ title: "Outreach initiated", description: c.name, variant: "success" })}>Reach Out</Button>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
