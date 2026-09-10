"use client";
import { useMemo, useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentStudent, skillName, jobs, companyById, projectsByStudent } from "@/lib/data";

interface Node {
  id: string;
  label: string;
  kind: "skill" | "role" | "company" | "project";
  x: number;
  y: number;
}

export default function SkillGraphPage() {
  const [selected, setSelected] = useState<Node | null>(null);

  const { nodes, links } = useMemo(() => {
    const topSkills = [...currentStudent.skills].sort((a, b) => b.confidence - a.confidence).slice(0, 6);
    const centerX = 400, centerY = 260, radius = 190;
    const skillNodes: Node[] = topSkills.map((s, i) => {
      const angle = (i / topSkills.length) * Math.PI * 2;
      return { id: s.skillId, label: skillName(s.skillId), kind: "skill", x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
    });

    const matchingJobs = jobs
      .filter((j) => j.requiredSkills.some((s) => topSkills.some((ts) => ts.skillId === s)))
      .slice(0, 5);
    const outerRadius = 330;
    const jobNodes: Node[] = matchingJobs.map((j, i) => {
      const angle = (i / matchingJobs.length) * Math.PI * 2 + 0.4;
      const company = companyById(j.companyId);
      return { id: j.id, label: `${j.title} · ${company?.name}`, kind: "role", x: centerX + Math.cos(angle) * outerRadius, y: centerY + Math.sin(angle) * outerRadius };
    });

    const projNodes: Node[] = projectsByStudent(currentStudent.id).slice(0, 3).map((p, i) => ({
      id: p.id, label: p.title, kind: "project", x: centerX - 250 + i * 40, y: 60,
    }));

    const allNodes = [{ id: "me", label: currentStudent.name, kind: "skill" as const, x: centerX, y: centerY }, ...skillNodes, ...jobNodes, ...projNodes];

    const linkList: [string, string][] = [];
    skillNodes.forEach((s) => linkList.push(["me", s.id]));
    matchingJobs.forEach((j) => {
      j.requiredSkills.forEach((s) => {
        if (skillNodes.some((sn) => sn.id === s)) linkList.push([s, j.id]);
      });
    });
    projNodes.forEach((p) => linkList.push(["me", p.id]));

    return { nodes: allNodes, links: linkList };
  }, []);

  const colorFor = (kind: Node["kind"]) =>
    kind === "skill" ? "var(--brand-blue)" : kind === "role" ? "var(--accent-emerald)" : kind === "company" ? "var(--accent-violet)" : "var(--accent-amber)";

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Skill Graph" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Skill Graph</h1>
        <p className="text-sm text-muted-foreground">An interactive map of how your skills connect to roles, projects and opportunities.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <svg viewBox="0 0 800 520" className="h-[480px] w-full">
              {links.map(([a, b], i) => {
                const na = nodes.find((n) => n.id === a);
                const nb = nodes.find((n) => n.id === b);
                if (!na || !nb) return null;
                return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="var(--border-strong)" strokeWidth={1.5} />;
              })}
              {nodes.map((n) => (
                <g key={n.id} className="cursor-pointer" onClick={() => setSelected(n)}>
                  <circle
                    cx={n.x} cy={n.y}
                    r={n.id === "me" ? 30 : selected?.id === n.id ? 14 : 10}
                    fill={n.id === "me" ? "var(--brand-navy)" : colorFor(n.kind)}
                    opacity={selected && selected.id !== n.id ? 0.5 : 1}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                  <text x={n.x} y={n.id === "me" ? n.y + 46 : n.y + 22} textAnchor="middle" fontSize={n.id === "me" ? 12 : 10} fill="var(--foreground)" fontWeight={n.id === "me" ? 700 : 500}>
                    {n.label.length > 24 ? n.label.slice(0, 22) + "…" : n.label}
                  </text>
                </g>
              ))}
            </svg>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground">Legend</p>
            <div className="mt-2 space-y-1.5 text-xs">
              <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand-blue)" }} /> Skill</p>
              <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent-emerald)" }} /> Matched Role</p>
              <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent-amber)" }} /> Project</p>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              {selected ? (
                <div>
                  <Badge variant={selected.kind === "skill" ? "blue" : selected.kind === "role" ? "emerald" : "amber"}>{selected.kind}</Badge>
                  <p className="mt-2 text-sm font-semibold text-foreground">{selected.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click any node to see how it connects across your skill ecosystem — skills lead to matched roles and evidence.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Click on any node in the graph to see its details and connections.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
