"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, Trophy } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { colleges } from "@/lib/data";

export default function CollegeDiscoveryPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("engagement");

  const filtered = useMemo(() => {
    return colleges
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === "engagement" ? b.industryEngagementScore - a.industryEngagementScore : b.placementRate - a.placementRate));
  }, [query, sort]);

  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "College Discovery" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">College Discovery</h1>
        <p className="text-sm text-muted-foreground">Find colleges based on real activity — not just rankings.</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by college or city..." className="pl-9" />
        </div>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-56">
          <option value="engagement">Sort by Industry Engagement</option>
          <option value="placement">Sort by Placement Rate</option>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link key={c.id} href={`/industry/company/colleges/${c.id}`}>
            <Card className="h-full p-5 transition-shadow hover:shadow-[var(--shadow-md)] hover:border-blue/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: c.logoColor }}>{c.name[0]}</div>
              <p className="mt-3 text-sm font-semibold text-foreground">{c.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {c.city}, {c.state}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> {c.totalStudents.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Trophy className="h-3 w-3" /> {c.hackathons} hackathons</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">{c.topSkills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
              <Badge variant="emerald" className="mt-2">{c.industryEngagementScore}% engagement</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
