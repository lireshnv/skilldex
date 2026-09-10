"use client";
import { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colleges } from "@/lib/data";
import { Users, Briefcase, Trophy, School, FlaskConical, HandCoins, RotateCcw, Sparkles } from "lucide-react";

const goals = [
  { id: "hire", label: "Hire Talent", icon: Users },
  { id: "internship", label: "Launch Internship", icon: Briefcase },
  { id: "hackathon", label: "Run Hackathon", icon: Trophy },
  { id: "college", label: "Find College", icon: School },
  { id: "faculty", label: "Find Faculty", icon: Users },
  { id: "project", label: "Launch Project", icon: FlaskConical },
  { id: "research", label: "Research Collaboration", icon: HandCoins },
];

const recommendations: Record<string, { colleges: string[]; skills: string[]; role: string; timeline: string; model: string }> = {
  hire: { colleges: [colleges[4].name, colleges[8].name, colleges[2].name], skills: ["DSA", "System Design", "Python"], role: "Software Engineer / SDE Intern", timeline: "6-8 weeks", model: "Campus hiring drive with skill-based shortlisting" },
  internship: { colleges: [colleges[0].name, colleges[9].name], skills: ["React", "Node.js"], role: "Software Engineering Intern", timeline: "8-12 weeks", model: "Structured internship with mentor assignment" },
  hackathon: { colleges: [colleges[8].name, colleges[4].name, colleges[7].name], skills: ["Problem Solving", "Rapid Prototyping"], role: "N/A", timeline: "48 hours", model: "On-campus hackathon with industry judges" },
  college: { colleges: [colleges[4].name, colleges[8].name], skills: ["AI/ML", "Cloud Computing"], role: "N/A", timeline: "Ongoing", model: "Long-term academic partnership" },
  faculty: { colleges: [colleges[2].name, colleges[0].name], skills: ["Machine Learning", "Cloud Computing"], role: "N/A", timeline: "1 semester", model: "Consultancy or joint research engagement" },
  project: { colleges: [colleges[9].name, colleges[1].name], skills: ["Full Stack Development"], role: "Live Project Contributors", timeline: "10 weeks", model: "Faculty-guided live industry project" },
  research: { colleges: [colleges[2].name, colleges[8].name], skills: ["Deep Learning", "Research Methods"], role: "N/A", timeline: "2 semesters", model: "Joint research grant with publication goals" },
};

export default function StartupAssistantPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const rec = goal ? recommendations[goal] : null;

  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Startup Assistant" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Startup Collaboration Assistant</h1>
        <p className="text-sm text-muted-foreground">A guided assistant to help early-stage teams engage with the right academic ecosystem.</p>
      </div>

      {!rec ? (
        <Card className="mx-auto max-w-xl p-8 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-blue-2" />
          <h2 className="mt-3 text-lg font-bold text-foreground">What are you trying to build?</h2>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {goals.map((g) => (
              <button key={g.id} onClick={() => setGoal(g.id)} className="cursor-pointer">
                <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-border-strong p-3 text-left hover:border-blue hover:bg-blue-light/40">
                  <g.icon className="h-4.5 w-4.5 text-blue-2" />
                  <span className="text-sm font-medium text-foreground">{g.label}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="mx-auto max-w-2xl p-6">
          <div className="flex items-center justify-between">
            <Badge variant="blue">{goals.find((g) => g.id === goal)?.label}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setGoal(null)}><RotateCcw className="h-3.5 w-3.5" /> Start Over</Button>
          </div>
          <CardContent className="mt-2 space-y-4 p-0">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Recommended Colleges</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">{rec.colleges.map((c) => <Badge key={c} variant="emerald">{c}</Badge>)}</div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Required Skills</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">{rec.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
            </div>
            {rec.role !== "N/A" && (
              <div><p className="text-xs font-semibold text-muted-foreground">Role Description</p><p className="mt-1 text-sm text-foreground">{rec.role}</p></div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3"><p className="text-xs font-semibold text-muted-foreground">Timeline</p><p className="text-sm font-medium text-foreground">{rec.timeline}</p></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3"><p className="text-xs font-semibold text-muted-foreground">Engagement Model</p><p className="text-sm font-medium text-foreground">{rec.model}</p></div>
            </div>
            <Button variant="primary" className="w-full">Proceed with this Plan</Button>
          </CardContent>
        </Card>
      )}
    </PortalShell>
  );
}
