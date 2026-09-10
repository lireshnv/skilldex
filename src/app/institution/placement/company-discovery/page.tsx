"use client";
import { useMemo, useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { companies } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export default function CompanyDiscoveryPage() {
  const [sizeFilter, setSizeFilter] = useState("All");
  const pushToast = useSkillDexStore((s) => s.pushToast);

  const discovered = useMemo(() => {
    return companies
      .filter((c) => sizeFilter === "All" || c.size === sizeFilter)
      .filter((c) => c.relationshipScore < 80)
      .sort((a, b) => a.relationshipScore - b.relationshipScore);
  }, [sizeFilter]);

  return (
    <PortalShell portal="placement" userName="Placement Officer" userColor="#0b1e3f" userRole="Placement Cell" breadcrumbs={[{ label: "Placement Cell", href: "/institution/placement" }, { label: "Company Discovery" }]}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Company Discovery</h1>
          <p className="text-sm text-muted-foreground">Companies and startups SkillDex recommends for outreach.</p>
        </div>
        <Select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="w-full sm:w-48">
          <option>All</option>
          <option>Startup</option>
          <option>Mid-size</option>
          <option>Enterprise</option>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {discovered.map((c) => (
          <Card key={c.id} className="p-5">
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
        ))}
      </div>
    </PortalShell>
  );
}
