"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, GraduationCap, ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { RadialProgress } from "@/components/ui/progress";
import { students, colleges, readinessLabel } from "@/lib/data";

function TalentDiscoveryInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [college, setCollege] = useState("All Colleges");
  const [readiness, setReadiness] = useState("All");

  const filtered = useMemo(() => {
    return students
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.targetRole.toLowerCase().includes(query.toLowerCase()) || s.skills.some((sk) => sk.skillId.includes(query.toLowerCase())))
      .filter((s) => college === "All Colleges" || s.college === college)
      .filter((s) => readiness === "All" || readinessLabel(s.readiness) === readiness)
      .sort((a, b) => b.readiness - a.readiness);
  }, [query, college, readiness]);

  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition" breadcrumbs={[{ label: "Recruiter", href: "/industry/recruiter" }, { label: "Talent Discovery" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Talent Discovery</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} verified candidates match your current filters.</p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skill, role, name..." className="pl-9" />
        </div>
        <Select value={college} onChange={(e) => setCollege(e.target.value)}>
          <option>All Colleges</option>
          {colleges.map((c) => <option key={c.id}>{c.name}</option>)}
        </Select>
        <Select value={readiness} onChange={(e) => setReadiness(e.target.value)}>
          <option>All</option>
          <option>Ready</option>
          <option>Near Ready</option>
          <option>Needs Development</option>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Link key={s.id} href={`/industry/recruiter/candidates/${s.id}`}>
            <Card className="h-full p-4 transition-shadow hover:shadow-[var(--shadow-md)] hover:border-blue/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} color={s.avatarColor} size={44} />
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-foreground">{s.name} <ShieldCheck className="h-3.5 w-3.5 text-emerald" /></p>
                    <p className="text-xs text-muted-foreground">{s.targetRole}</p>
                  </div>
                </div>
                <RadialProgress value={s.readiness} size={44} strokeWidth={4} />
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" /> {s.college}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {s.location}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant={readinessLabel(s.readiness) === "Ready" ? "emerald" : readinessLabel(s.readiness) === "Near Ready" ? "amber" : "outline"}>{readinessLabel(s.readiness)}</Badge>
                <Badge variant="outline">{s.projects} projects</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}

export default function TalentDiscoveryPage() {
  return (
    <Suspense>
      <TalentDiscoveryInner />
    </Suspense>
  );
}
