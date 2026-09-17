"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchBadge } from "@/components/ui/match-badge";
import { Input, Select } from "@/components/ui/input";
import { companies, currentStudent, skillName } from "@/lib/data";

const industries = ["All Industries", ...Array.from(new Set(companies.map((c) => c.industry)))];
const skillIds = new Set(currentStudent.skills.map((s) => s.skillId));

export default function CompanyExplorerPage() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [hiring, setHiring] = useState("All");

  const filtered = useMemo(() => {
    return companies
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .filter((c) => industry === "All Industries" || c.industry === industry)
      .filter((c) => hiring === "All" || c.hiringStatus === hiring)
      .map((c) => {
        const overlap = c.requiredSkills.filter((s) => skillIds.has(s)).length;
        const match = Math.round((overlap / c.requiredSkills.length) * 100);
        return { ...c, match: Math.max(match, 35) };
      })
      .sort((a, b) => b.match - a.match);
  }, [query, industry, hiring]);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Company Explorer" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Company Explorer</h1>
        <p className="text-sm text-muted-foreground">Discover companies matched to your skill profile.</p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies..." className="pl-9" />
        </div>
        <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          {industries.map((i) => <option key={i}>{i}</option>)}
        </Select>
        <Select value={hiring} onChange={(e) => setHiring(e.target.value)}>
          <option>All</option>
          <option>Actively Hiring</option>
          <option>Selective</option>
          <option>Paused</option>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link key={c.id} href={`/institution/student/companies/${c.id}`}>
            <Card className="h-full p-5 transition-shadow hover:shadow-[var(--shadow-md)] hover:border-blue/30">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: c.logoColor }}>
                  {c.name[0]}
                </div>
                <Badge variant={c.hiringStatus === "Actively Hiring" ? "emerald" : c.hiringStatus === "Selective" ? "amber" : "outline"}>{c.hiringStatus}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.industry} · <MapPin className="inline h-3 w-3" /> {c.location}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Briefcase className="h-3.5 w-3.5" /> {c.openRoles} open roles</span>
                <MatchBadge score={c.match} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.requiredSkills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
