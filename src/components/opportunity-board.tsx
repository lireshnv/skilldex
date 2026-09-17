"use client";
import { useMemo, useState } from "react";
import { Search, MapPin, Clock, IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { jobs, companyById, skillName, currentStudent } from "@/lib/data";
import { Job } from "@/lib/types";
import { useSkillDexStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export function OpportunityBoard({
  types,
  title,
  subtitle,
  showHeader = true,
}: {
  types: Job["type"][];
  title: string;
  subtitle: string;
  showHeader?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const applications = useSkillDexStore((s) => s.applications);
  const applyToJob = useSkillDexStore((s) => s.applyToJob);
  const savedJobs = useSkillDexStore((s) => s.savedJobs);
  const toggleSavedJob = useSkillDexStore((s) => s.toggleSavedJob);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  const pool = jobs.filter((j) => types.includes(j.type));
  const locations = ["All Locations", ...Array.from(new Set(pool.map((j) => j.location)))];

  const filtered = useMemo(() => {
    return pool
      .filter((j) => j.title.toLowerCase().includes(query.toLowerCase()) || (companyById(j.companyId)?.name.toLowerCase().includes(query.toLowerCase())))
      .filter((j) => location === "All Locations" || j.location === location);
  }, [pool, query, location]);

  return (
    <div>
      {showHeader && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by role or company..." className="pl-9" />
        </div>
        <Select value={location} onChange={(e) => setLocation(e.target.value)} className="sm:w-48">
          {locations.map((l) => <option key={l}>{l}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No opportunities found" description="Try adjusting your filters or search terms." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => {
            const company = companyById(j.companyId);
            const applied = applications.some((a) => a.jobId === j.id && a.studentId === currentStudent.id);
            const saved = savedJobs.includes(j.id);
            return (
              <Card key={j.id} className="flex flex-col p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white font-bold" style={{ background: company?.logoColor }}>
                    {company?.name[0]}
                  </div>
                  <button onClick={() => toggleSavedJob(j.id)} className="text-xs font-medium text-muted-foreground hover:text-blue-2 cursor-pointer">
                    {saved ? "★ Saved" : "☆ Save"}
                  </button>
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{j.title}</p>
                <p className="text-xs text-muted-foreground">{company?.name}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {j.package}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(j.deadline)}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {j.requiredSkills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}
                </div>
                <Button
                  size="sm"
                  variant={applied ? "subtle" : "primary"}
                  disabled={applied}
                  className="mt-3"
                  onClick={() => { applyToJob(j.id, currentStudent.id); pushToast({ title: "Application submitted", description: `${j.title} at ${company?.name}`, variant: "success" }); }}
                >
                  {applied ? "Applied" : "Apply"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
