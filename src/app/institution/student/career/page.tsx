"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Code2, BarChart3, Boxes, Palette, ShieldAlert, Briefcase, PenTool,
  Rocket, FlaskConical, Settings2, ArrowRight, Search, MapPin,
  CheckCircle2, XCircle, BadgeCheck,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchBadge } from "@/components/ui/match-badge";
import { Input, Select } from "@/components/ui/input";
import { SkillBar } from "@/components/skill-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { currentStudent, skillName, companies, jobs, companyById } from "@/lib/data";
import { cn } from "@/lib/utils";

// "fit" is deliberately not a hardcoded literal — every path's fit is
// computed below from the viewing student's actual skill confidence
// against that path's required skills, so it means the same thing (and
// changes the same way) as every other match score in the product.
const paths = [
  { id: "sde", title: "Software Engineering", icon: Code2, required: ["sk-dsa", "sk-system-design", "sk-java"], transferable: ["Problem Solving", "Logical Thinking"], learning: ["Advanced DSA", "System Design Bootcamp"] },
  { id: "data", title: "Data Analytics", icon: BarChart3, required: ["sk-sql", "sk-data-analytics", "sk-excel"], transferable: ["Attention to Detail", "Storytelling"], learning: ["Power BI Certification", "Statistics for Analytics"] },
  { id: "pm", title: "Product Management", icon: Boxes, required: ["sk-productmgmt", "sk-communication", "sk-leadership"], transferable: ["Communication", "Prioritization"], learning: ["Product Thinking Workshop", "Case Study Practice"] },
  { id: "design", title: "UI/UX Design", icon: Palette, required: ["sk-uiux", "sk-figma"], transferable: ["Empathy", "Visual Thinking"], learning: ["Figma Fundamentals", "Design Systems Course"] },
  { id: "cyber", title: "Cybersecurity", icon: ShieldAlert, required: ["sk-cyber", "sk-cn"], transferable: ["Analytical Thinking"], learning: ["Network Security Basics", "Ethical Hacking 101"] },
  { id: "consulting", title: "Consulting", icon: Briefcase, required: ["sk-consulting", "sk-communication"], transferable: ["Presentation", "Structured Thinking"], learning: ["Case Interview Prep", "Business Fundamentals"] },
  { id: "writing", title: "Technical Writing", icon: PenTool, required: ["sk-communication", "sk-critical-thinking"], transferable: ["Clarity", "Research"], learning: ["Technical Writing Certification"] },
  { id: "entrepreneurship", title: "Entrepreneurship", icon: Rocket, required: ["sk-leadership", "sk-productmgmt"], transferable: ["Risk-taking", "Resourcefulness"], learning: ["Startup Bootcamp", "Fundraising Basics"] },
  { id: "research", title: "Research", icon: FlaskConical, required: ["sk-ml", "sk-critical-thinking"], transferable: ["Curiosity", "Rigor"], learning: ["Research Methods", "Academic Writing"] },
  { id: "ml", title: "Machine Learning Engineering", icon: FlaskConical, required: ["sk-ml", "sk-python", "sk-dl"], transferable: ["Analytical Thinking", "Problem Solving"], learning: ["Deep Learning Specialization", "MLOps Fundamentals"] },
  { id: "ops", title: "Operations", icon: Settings2, required: ["sk-supplychain", "sk-excel"], transferable: ["Organization", "Process Thinking"], learning: ["Operations Management Basics"] },
];

// Average confidence across a path's required skills — 0 for any skill the
// student hasn't demonstrated at all. Same "explainable score" spirit as
// the company/job match badges elsewhere, applied to career paths.
function computeFit(required: string[], skillMap: Map<string, number>): number {
  const total = required.reduce((sum, id) => sum + (skillMap.get(id) ?? 0), 0);
  return Math.round(total / required.length);
}

const rules = [
  { label: "Minimum CGPA", value: "6.0", met: currentStudent.cgpa >= 6.0 },
  { label: "Maximum active backlogs", value: "1", met: currentStudent.backlogs <= 1 },
  { label: "Previous offer restriction", value: currentStudent.offers > 0 ? "1 offer already accepted" : "No offers accepted yet", met: currentStudent.offers === 0 },
  { label: "Eligible department", value: currentStudent.department, met: true },
  { label: "Eligible graduation year", value: `Year ${currentStudent.year}`, met: currentStudent.year >= 3 },
];

const industries = ["All Industries", ...Array.from(new Set(companies.map((c) => c.industry)))];
const skillIds = new Set(currentStudent.skills.map((s) => s.skillId));

export default function StudentCareerPage() {
  const skillMap = useMemo(() => new Map(currentStudent.skills.map((s) => [s.skillId, s.confidence])), []);
  const pathsWithFit = useMemo(
    () => [...paths].map((p) => ({ ...p, fit: computeFit(p.required, skillMap) })).sort((a, b) => b.fit - a.fit),
    [skillMap]
  );
  const [activePathId, setActivePathId] = useState(pathsWithFit[0].id);
  const activePath = pathsWithFit.find((p) => p.id === activePathId)!;

  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .filter((c) => industry === "All Industries" || c.industry === industry)
      .map((c) => {
        const overlap = c.requiredSkills.filter((s) => skillIds.has(s)).length;
        const match = Math.round((overlap / c.requiredSkills.length) * 100);
        return { ...c, match: Math.max(match, 35) };
      })
      .sort((a, b) => b.match - a.match);
  }, [query, industry]);

  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const job = jobs.find((j) => j.id === selectedJobId)!;
  const jobCompany = companyById(job.companyId);
  const checks = [
    { label: `CGPA ≥ ${job.eligibility.minCgpa}`, met: currentStudent.cgpa >= job.eligibility.minCgpa, detail: `Your CGPA: ${currentStudent.cgpa}` },
    { label: `Backlogs ≤ ${job.eligibility.maxBacklogs}`, met: currentStudent.backlogs <= job.eligibility.maxBacklogs, detail: `Your backlogs: ${currentStudent.backlogs}` },
    { label: `Department in [${job.eligibility.departments.join(", ")}]`, met: job.eligibility.departments.includes(currentStudent.department), detail: `Your department: ${currentStudent.department}` },
    { label: `Year in [${job.eligibility.years.join(", ")}]`, met: job.eligibility.years.includes(currentStudent.year), detail: `Your year: ${currentStudent.year}` },
  ];
  const eligible = checks.every((c) => c.met);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Career" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Career</h1>
        <p className="text-sm text-muted-foreground">Target: <strong className="text-foreground">{currentStudent.targetRole}</strong> — roles beyond the obvious, matching companies and eligibility.</p>
      </div>

      <Tabs defaultValue="roadmap">
        <TabsList className="mb-6">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
        </TabsList>

        {/* ---------- ROADMAP ---------- */}
        <TabsContent value="roadmap">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-3">
              {pathsWithFit.map((p) => (
                <button key={p.id} onClick={() => setActivePathId(p.id)} className="text-left cursor-pointer">
                  <Card className={cn("h-full p-4 transition-all", activePath.id === p.id ? "border-blue shadow-[var(--shadow-md)] bg-blue-light/30" : "hover:border-blue/30")}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-navy text-white">
                      <p.icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="mt-2.5 text-sm font-semibold text-foreground">{p.title}</p>
                    <Badge variant={p.fit >= 70 ? "emerald" : p.fit >= 55 ? "amber" : "outline"} className="mt-1.5">{p.fit}% fit</Badge>
                  </Card>
                </button>
              ))}
            </div>

            <Card className="h-fit">
              <CardContent className="p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-navy text-white">
                    <activePath.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{activePath.title}</p>
                    <p className="text-xs text-muted-foreground">Current fit: {activePath.fit}%</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">Required Skills</p>
                  {activePath.required.map((s) => (
                    <SkillBar key={s} label={skillName(s)} value={skillMap.get(s) ?? 25} />
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground">Transferable Skills You Have</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activePath.transferable.map((t) => <Badge key={t} variant="emerald">{t}</Badge>)}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground">Recommended Learning</p>
                  <ul className="mt-2 space-y-1.5">
                    {activePath.learning.map((l) => (
                      <li key={l} className="flex items-center gap-1.5 text-sm text-foreground">
                        <ArrowRight className="h-3.5 w-3.5 text-blue-2" /> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------- COMPANIES ---------- */}
        <TabsContent value="companies">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies..." className="pl-9" />
            </div>
            <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {industries.map((i) => <option key={i}>{i}</option>)}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((c) => (
              <Link key={c.id} href={`/institution/student/companies/${c.id}`}>
                <Card hover className="h-full p-5">
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
        </TabsContent>

        {/* ---------- ELIGIBILITY ---------- */}
        <TabsContent value="eligibility">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle>Institution Placement Rules</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {rules.map((r) => (
                  <div key={r.label} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.label}</p>
                      <p className="text-xs text-muted-foreground">{r.value}</p>
                    </div>
                    {r.met ? <CheckCircle2 className="h-5 w-5 text-emerald" /> : <XCircle className="h-5 w-5 text-rose" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Can I apply?</CardTitle>
                <Select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} className="mt-2 w-full sm:w-80">
                  {jobs.slice(0, 20).map((j) => (
                    <option key={j.id} value={j.id}>{j.title} — {companyById(j.companyId)?.name}</option>
                  ))}
                </Select>
              </CardHeader>
              <CardContent>
                <div className={cn("flex items-center gap-3 rounded-[var(--radius-md)] p-4", eligible ? "bg-emerald-light" : "bg-rose-light")}>
                  {eligible ? <CheckCircle2 className="h-8 w-8 text-emerald" /> : <XCircle className="h-8 w-8 text-rose" />}
                  <div>
                    <p className={cn("text-lg font-bold", eligible ? "text-emerald" : "text-rose")}>{eligible ? "Eligible ✓" : "Not Eligible"}</p>
                    <p className="text-xs text-muted-foreground">{job.title} at {jobCompany?.name}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Why:</p>
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-border p-2.5 text-sm">
                      {c.met ? <BadgeCheck className="h-4 w-4 shrink-0 text-emerald" /> : <XCircle className="h-4 w-4 shrink-0 text-rose" />}
                      <div>
                        <p className="text-foreground">{c.label}</p>
                        <p className="text-xs text-muted-foreground">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
