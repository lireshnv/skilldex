"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize2, Sparkles, TrendingUp, ShieldCheck, Briefcase } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeUp } from "@/lib/motion";
import { currentStudent, skillName, skillById, jobs, companyById, projectsByStudent } from "@/lib/data";
import { cn } from "@/lib/utils";

type Kind = "me" | "skill" | "role" | "project";

interface GraphNode {
  id: string;
  label: string;
  kind: Kind;
  x: number;
  y: number;
  skillId?: string;
}

const kindColor: Record<Kind, string> = {
  me: "var(--brand-navy)",
  skill: "var(--brand-blue)",
  role: "var(--accent-emerald)",
  project: "var(--accent-amber)",
};
const kindRadius: Record<Kind, number> = { me: 34, skill: 24, role: 17, project: 17 };

export default function SkillGraphPage() {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const topSkills = [...currentStudent.skills].sort((a, b) => b.confidence - a.confidence).slice(0, 6);
    const centerX = 420, centerY = 280, radius = 170;
    const skillNodes: GraphNode[] = topSkills.map((s, i) => {
      const angle = (i / topSkills.length) * Math.PI * 2 - Math.PI / 2;
      return { id: s.skillId, label: skillName(s.skillId), kind: "skill", x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius, skillId: s.skillId };
    });

    const matchingJobs = jobs
      .filter((j) => j.requiredSkills.some((s) => topSkills.some((ts) => ts.skillId === s)))
      .slice(0, 6);
    const outerRadius = 300;
    const jobNodes: GraphNode[] = matchingJobs.map((j, i) => {
      const angle = (i / matchingJobs.length) * Math.PI * 2 - Math.PI / 2 + 0.35;
      const company = companyById(j.companyId);
      return { id: j.id, label: `${j.title}`, kind: "role", x: centerX + Math.cos(angle) * outerRadius, y: centerY + Math.sin(angle) * outerRadius, skillId: company?.name };
    });

    const studentProjects = projectsByStudent(currentStudent.id).slice(0, 3);
    const projNodes: GraphNode[] = studentProjects.map((p, i) => ({
      id: p.id, label: p.title, kind: "project", x: 90 + i * 30, y: 70 + i * 60,
    }));

    const allNodes: GraphNode[] = [{ id: "me", label: currentStudent.name, kind: "me", x: centerX, y: centerY }, ...skillNodes, ...jobNodes, ...projNodes];

    const linkList: [string, string][] = [];
    skillNodes.forEach((s) => linkList.push(["me", s.id]));
    matchingJobs.forEach((j) => {
      j.requiredSkills.forEach((s) => {
        if (skillNodes.some((sn) => sn.id === s)) linkList.push([s, j.id]);
      });
    });
    studentProjects.forEach((p) => {
      linkList.push(["me", p.id]);
      p.skills.forEach((s) => { if (skillNodes.some((sn) => sn.id === s)) linkList.push([s, p.id]); });
    });

    return { nodes: allNodes, links: linkList };
  }, []);

  // Which node ids are directly connected to a given node (for hover-illuminate / fade).
  const neighborsOf = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const n of nodes) map.set(n.id, new Set([n.id]));
    for (const [a, b] of links) {
      map.get(a)?.add(b);
      map.get(b)?.add(a);
    }
    return map;
  }, [nodes, links]);

  const focusId = hovered ?? selected?.id ?? null;
  const activeSet = focusId ? neighborsOf.get(focusId) : null;

  function clampScale(s: number) {
    return Math.min(2.2, Math.max(0.5, s));
  }
  function zoomBy(delta: number) {
    setView((v) => ({ ...v, scale: clampScale(v.scale + delta) }));
  }
  function resetView() {
    setView({ scale: 1, x: 0, y: 0 });
  }
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    setView((v) => ({ ...v, scale: clampScale(v.scale - e.deltaY * 0.001) }));
  }

  // Drag-to-pan: listen on window (not the captured target) so the drag
  // keeps tracking the pointer no matter which node/background it started
  // or moves over — a more robust pattern than setPointerCapture here,
  // since the graph is full of small overlapping hit targets.
  const [isDragging, setIsDragging] = useState(false);
  function onPointerDown(e: React.PointerEvent) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: view.x, oy: view.y };
    setIsDragging(true);
  }
  useEffect(() => {
    if (!isDragging) return;
    function onMove(e: PointerEvent) {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setView((v) => ({ ...v, x: dragRef.current!.ox + dx, y: dragRef.current!.oy + dy }));
    }
    function onUp() {
      dragRef.current = null;
      setIsDragging(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging]);

  function curve(a: GraphNode, b: GraphNode) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const bow = 0.12;
    const cx = mx - dy * bow, cy = my + dx * bow;
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
  }

  const selectedSkillDef = selected?.skillId && selected.kind === "skill" ? skillById(selected.skillId) : null;
  const relatedRoleCount = selected && selected.kind === "skill"
    ? jobs.filter((j) => j.requiredSkills.includes(selected.id)).length
    : 0;
  const studentSkillRecord = selected?.kind === "skill" ? currentStudent.skills.find((s) => s.skillId === selected.id) : null;

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
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="lg:col-span-2">
          <Card className="relative overflow-hidden bg-dot-grid">
            <div className="absolute right-3 top-3 z-10 flex gap-1.5">
              <button onClick={() => zoomBy(0.2)} className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface/90 text-muted-foreground shadow-sm hover:text-foreground cursor-pointer backdrop-blur" aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={() => zoomBy(-0.2)} className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface/90 text-muted-foreground shadow-sm hover:text-foreground cursor-pointer backdrop-blur" aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button onClick={resetView} className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface/90 text-muted-foreground shadow-sm hover:text-foreground cursor-pointer backdrop-blur" aria-label="Reset view">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            <CardContent className="p-0">
              <svg
                ref={svgRef}
                viewBox="0 0 800 520"
                className={cn("h-[520px] w-full touch-none select-none", isDragging ? "cursor-grabbing" : "cursor-grab")}
                onWheel={onWheel}
                onPointerDown={onPointerDown}
              >
                <defs>
                  <radialGradient id="node-glow-me" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#3b5b8c" />
                    <stop offset="100%" stopColor="var(--brand-navy)" />
                  </radialGradient>
                  <radialGradient id="node-glow-skill" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#5b8cf0" />
                    <stop offset="100%" stopColor="var(--brand-blue)" />
                  </radialGradient>
                  <radialGradient id="node-glow-role" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="var(--accent-emerald)" />
                  </radialGradient>
                  <radialGradient id="node-glow-project" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf5e" />
                    <stop offset="100%" stopColor="var(--accent-amber)" />
                  </radialGradient>
                </defs>

                <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`} style={{ transition: dragRef.current ? "none" : "transform 0.15s ease-out" }}>
                  {links.map(([a, b], i) => {
                    const na = nodes.find((n) => n.id === a);
                    const nb = nodes.find((n) => n.id === b);
                    if (!na || !nb) return null;
                    const dim = activeSet && !(activeSet.has(a) && activeSet.has(b));
                    return (
                      <path
                        key={i}
                        d={curve(na, nb)}
                        fill="none"
                        stroke={dim ? "var(--border)" : "var(--border-strong)"}
                        strokeWidth={dim ? 1.25 : 2}
                        opacity={dim ? 0.35 : 0.9}
                        style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}
                      />
                    );
                  })}

                  {nodes.map((n) => {
                    const isSelected = selected?.id === n.id;
                    const isHovered = hovered === n.id;
                    const dim = activeSet && !activeSet.has(n.id);
                    const r = kindRadius[n.kind] * (isSelected || isHovered ? 1.12 : 1);
                    return (
                      <g
                        key={n.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(n)}
                        onMouseEnter={() => setHovered(n.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ opacity: dim ? 0.35 : 1, transition: "opacity 0.2s" }}
                      >
                        <circle cx={n.x} cy={n.y} r={r} fill={`url(#node-glow-${n.kind})`} stroke={isSelected ? "var(--brand-blue)" : "var(--surface)"} strokeWidth={isSelected ? 3 : 2.5} style={{ transition: "r 0.15s ease-out" }} />
                        {(isSelected || isHovered) && (
                          <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke={kindColor[n.kind]} strokeOpacity={0.35} strokeWidth={2} />
                        )}
                        <text x={n.x} y={n.y + r + 16} textAnchor="middle" fontSize={n.kind === "me" ? 12 : 10.5} fill="var(--foreground)" fontWeight={n.kind === "me" ? 700 : 600}>
                          {n.label.length > 22 ? n.label.slice(0, 20) + "…" : n.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={fadeUp}>
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
                  selected.kind === "skill" && selectedSkillDef ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-2">Skill</p>
                        <p className="text-base font-bold text-foreground">{selectedSkillDef.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[var(--radius-sm)] border border-border p-2.5">
                          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><ShieldCheck className="h-3 w-3" /> Current level</p>
                          <p className="mt-0.5 text-sm font-bold text-foreground">{studentSkillRecord?.level ?? "—"}</p>
                        </div>
                        <div className="rounded-[var(--radius-sm)] border border-border p-2.5">
                          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><TrendingUp className="h-3 w-3" /> Industry demand</p>
                          <p className="mt-0.5 text-sm font-bold text-foreground">{selectedSkillDef.demand >= 75 ? "High" : selectedSkillDef.demand >= 50 ? "Medium" : "Emerging"}</p>
                        </div>
                        <div className="rounded-[var(--radius-sm)] border border-border p-2.5">
                          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Evidence</p>
                          <p className="mt-0.5 text-sm font-bold text-foreground">{studentSkillRecord?.evidenceCount ?? 0} item{studentSkillRecord?.evidenceCount === 1 ? "" : "s"}</p>
                        </div>
                        <div className="rounded-[var(--radius-sm)] border border-border p-2.5">
                          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Briefcase className="h-3 w-3" /> Related roles</p>
                          <p className="mt-0.5 text-sm font-bold text-foreground">{relatedRoleCount}</p>
                        </div>
                      </div>
                      <div className="rounded-[var(--radius-md)] bg-blue-light px-3 py-2.5 text-xs text-blue-2">
                        Recommended action: {(studentSkillRecord?.confidence ?? 0) < 65 ? `Practice more ${selectedSkillDef.name} problems to raise your confidence.` : `Add a project using ${selectedSkillDef.name} as verified evidence.`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Badge variant={selected.kind === "role" ? "emerald" : "amber"}>{selected.kind === "role" ? "Matched Role" : "Project"}</Badge>
                      <p className="mt-2 text-sm font-semibold text-foreground">{selected.label}</p>
                      {selected.skillId && <p className="mt-1 text-xs text-muted-foreground">{selected.kind === "role" ? `at ${selected.skillId}` : ""}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {selected.kind === "role"
                          ? "This role's required skills overlap with what you already have — hover the graph to see which."
                          : "This project is verified evidence backing the skills it connects to."}
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Hover a node to see how it connects. Click any node for details. Scroll or use the controls to zoom, drag to pan.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalShell>
  );
}
