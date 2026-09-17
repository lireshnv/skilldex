"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIInsight } from "@/components/ui/ai-insight";
import { colleges, skills } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const steps = ["Role", "Skills", "Eligibility", "Assessment", "Interview", "Institutions", "Publish"];

const suggestedSkills: Record<string, string[]> = {
  "Software Engineer": ["sk-dsa", "sk-system-design", "sk-java", "sk-git"],
  "Data Analyst": ["sk-sql", "sk-data-analytics", "sk-excel", "sk-powerbi"],
  "Frontend Developer": ["sk-react", "sk-js", "sk-ts", "sk-git"],
  "ML Engineer": ["sk-python", "sk-ml", "sk-dl", "sk-dsa"],
};

export default function NewJobPage() {
  const router = useRouter();
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("Software Engineer");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(suggestedSkills["Software Engineer"]);
  const [minCgpa, setMinCgpa] = useState("6.5");
  const [maxBacklogs, setMaxBacklogs] = useState("0");
  const [assessmentType, setAssessmentType] = useState("Technical + Aptitude");
  const [interviewRounds, setInterviewRounds] = useState<string[]>(["Technical", "HR"]);
  const [targetColleges, setTargetColleges] = useState<string[]>([colleges[0].id, colleges[4].id]);
  const [published, setPublished] = useState(false);

  function toggleSkill(id: string) {
    setSelectedSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function toggleCollege(id: string) {
    setTargetColleges((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }
  function toggleRound(r: string) {
    setInterviewRounds((rs) => (rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]));
  }

  return (
    <PortalShell portal="recruiter" userName="Meera Kapoor" userColor="#0b1e3f" userRole="Senior Talent Acquisition" breadcrumbs={[{ label: "Recruiter", href: "/industry/recruiter" }, { label: "Jobs", href: "/industry/recruiter/jobs" }, { label: "New Job" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
        <p className="text-sm text-muted-foreground">Build a role in 7 guided steps — SkillDex will suggest smart defaults.</p>
      </div>

      <div className="mb-6 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold cursor-pointer",
                i < step ? "bg-emerald text-white" : i === step ? "bg-blue text-white" : "bg-surface-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </button>
            <span className={cn("mx-1.5 whitespace-nowrap text-xs", i === step ? "font-semibold text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className="mx-1 h-px w-6 bg-border-strong" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <Select value={role} onChange={(e) => { setRole(e.target.value); setSelectedSkills(suggestedSkills[e.target.value] ?? []); }}>
                {Object.keys(suggestedSkills).map((r) => <option key={r}>{r}</option>)}
              </Select>
              <Input placeholder="Job title" defaultValue={role} />
              <Textarea placeholder="Role description" defaultValue={`We're looking for a talented ${role} to join our engineering team and work on impactful, production-scale systems.`} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Location" defaultValue="Bengaluru" />
                <Input placeholder="Compensation" defaultValue="12 LPA" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <AIInsight title="Suggested Skills">Based on the role of <strong>{role}</strong>, here are the recommended core skills.</AIInsight>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 24).map((s) => (
                  <button key={s.id} onClick={() => toggleSkill(s.id)} className="cursor-pointer">
                    <Badge variant={selectedSkills.includes(s.id) ? "blue" : "outline"}>{s.name}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Minimum CGPA</label>
                <Input value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Maximum Backlogs</label>
                <Input value={maxBacklogs} onChange={(e) => setMaxBacklogs(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Eligible Departments</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {["CSE", "IT", "ECE", "AI & DS"].map((d) => <Badge key={d} variant="blue">{d}</Badge>)}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="text-xs font-medium text-muted-foreground">Assessment Type</label>
              <Select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)}>
                <option>Technical + Aptitude</option>
                <option>Technical Only</option>
                <option>Aptitude + Communication</option>
                <option>Custom Assessment</option>
              </Select>
              <p className="text-xs text-muted-foreground">Estimated duration: 45 minutes · Auto-graded with SkillDex proctoring.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground">Interview Rounds</label>
              <div className="flex flex-wrap gap-2">
                {["Technical", "System Design", "Behavioral", "HR", "Culture Fit"].map((r) => (
                  <button key={r} onClick={() => toggleRound(r)} className="cursor-pointer">
                    <Badge variant={interviewRounds.includes(r) ? "blue" : "outline"}>{r}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground">Target Institutions</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {colleges.map((c) => (
                  <button key={c.id} onClick={() => toggleCollege(c.id)} className="cursor-pointer text-left">
                    <div className={cn("flex items-center justify-between rounded-[var(--radius-md)] border p-3 text-sm", targetColleges.includes(c.id) ? "border-blue bg-blue-light/40" : "border-border")}>
                      <span className="text-foreground">{c.name}</span>
                      {targetColleges.includes(c.id) && <Check className="h-4 w-4 text-blue-2" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-center">
              {!published ? (
                <>
                  <Sparkles className="mx-auto h-8 w-8 text-blue-2" />
                  <p className="text-sm text-muted-foreground">Review complete. Publishing to {targetColleges.length} institutions for {role}.</p>
                  <Button variant="primary" className="w-full" onClick={() => { setPublished(true); pushToast({ title: "Job published", description: `${role} is now live across ${targetColleges.length} institutions`, variant: "success" }); }}>
                    Publish Job
                  </Button>
                </>
              ) : (
                <>
                  <Check className="mx-auto h-10 w-10 rounded-full bg-emerald-light p-2 text-emerald" />
                  <p className="text-sm font-semibold text-foreground">Job published successfully!</p>
                  <Button variant="outline" onClick={() => router.push("/industry/recruiter/jobs")}>View Job Postings</Button>
                </>
              )}
            </div>
          )}

          {!published && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ChevronLeft className="h-4 w-4" /> Back</Button>
              {step < steps.length - 1 && <Button variant="primary" size="sm" onClick={() => setStep((s) => s + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>}
            </div>
          )}
        </CardContent>
      </Card>
    </PortalShell>
  );
}
