"use client";
import { useState } from "react";
import {
  Code2, BarChart3, Boxes, Palette, ShieldAlert, Briefcase, PenTool,
  Rocket, FlaskConical, Settings2, ArrowRight,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillBar } from "@/components/skill-bar";
import { currentStudent, skillName } from "@/lib/data";
import { cn } from "@/lib/utils";

const paths = [
  { id: "sde", title: "Software Engineering", icon: Code2, fit: 82, required: ["sk-dsa", "sk-system-design", "sk-java"], transferable: ["Problem Solving", "Logical Thinking"], learning: ["Advanced DSA", "System Design Bootcamp"] },
  { id: "data", title: "Data Analytics", icon: BarChart3, fit: 74, required: ["sk-sql", "sk-data-analytics", "sk-excel"], transferable: ["Attention to Detail", "Storytelling"], learning: ["Power BI Certification", "Statistics for Analytics"] },
  { id: "pm", title: "Product Management", icon: Boxes, fit: 61, required: ["sk-productmgmt", "sk-communication", "sk-leadership"], transferable: ["Communication", "Prioritization"], learning: ["Product Thinking Workshop", "Case Study Practice"] },
  { id: "design", title: "UI/UX Design", icon: Palette, fit: 55, required: ["sk-uiux", "sk-figma"], transferable: ["Empathy", "Visual Thinking"], learning: ["Figma Fundamentals", "Design Systems Course"] },
  { id: "cyber", title: "Cybersecurity", icon: ShieldAlert, fit: 48, required: ["sk-cyber", "sk-cn"], transferable: ["Analytical Thinking"], learning: ["Network Security Basics", "Ethical Hacking 101"] },
  { id: "consulting", title: "Consulting", icon: Briefcase, fit: 58, required: ["sk-consulting", "sk-communication"], transferable: ["Presentation", "Structured Thinking"], learning: ["Case Interview Prep", "Business Fundamentals"] },
  { id: "writing", title: "Technical Writing", icon: PenTool, fit: 52, required: ["sk-communication", "sk-critical-thinking"], transferable: ["Clarity", "Research"], learning: ["Technical Writing Certification"] },
  { id: "entrepreneurship", title: "Entrepreneurship", icon: Rocket, fit: 45, required: ["sk-leadership", "sk-productmgmt"], transferable: ["Risk-taking", "Resourcefulness"], learning: ["Startup Bootcamp", "Fundraising Basics"] },
  { id: "research", title: "Research", icon: FlaskConical, fit: 50, required: ["sk-ml", "sk-critical-thinking"], transferable: ["Curiosity", "Rigor"], learning: ["Research Methods", "Academic Writing"] },
  { id: "ops", title: "Operations", icon: Settings2, fit: 47, required: ["sk-supplychain", "sk-excel"], transferable: ["Organization", "Process Thinking"], learning: ["Operations Management Basics"] },
];

export default function CareerPathsPage() {
  const [active, setActive] = useState(paths[0]);
  const skillMap = new Map(currentStudent.skills.map((s) => [s.skillId, s.confidence]));

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Career Paths" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Career Paths</h1>
        <p className="text-sm text-muted-foreground">Explore roles beyond the obvious — matched to your current and transferable skills.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-3">
          {paths.map((p) => (
            <button key={p.id} onClick={() => setActive(p)} className="text-left cursor-pointer">
              <Card className={cn("h-full p-4 transition-all", active.id === p.id ? "border-blue shadow-[var(--shadow-md)] bg-blue-light/30" : "hover:border-blue/30")}>
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
                <active.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{active.title}</p>
                <p className="text-xs text-muted-foreground">Current fit: {active.fit}%</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Required Skills</p>
              {active.required.map((s) => (
                <SkillBar key={s} label={skillName(s)} value={skillMap.get(s) ?? 25} />
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground">Transferable Skills You Have</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {active.transferable.map((t) => <Badge key={t} variant="emerald">{t}</Badge>)}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground">Recommended Learning</p>
              <ul className="mt-2 space-y-1.5">
                {active.learning.map((l) => (
                  <li key={l} className="flex items-center gap-1.5 text-sm text-foreground">
                    <ArrowRight className="h-3.5 w-3.5 text-blue-2" /> {l}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
