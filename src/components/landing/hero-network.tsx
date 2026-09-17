"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type NodeKind = "person" | "skill" | "role" | "project" | "course" | "opportunity";

interface Node {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
}

// Hand-placed, not randomly scattered — a deliberate small hierarchy
// (skill -> role/project/course -> opportunity -> person) reads as designed
// rather than a generic "AI neural net" blob of scattered dots.
const nodes: Node[] = [
  { id: "skill", label: "SKILL", kind: "skill", x: 400, y: 90 },
  { id: "role", label: "ROLE", kind: "role", x: 210, y: 210 },
  { id: "project", label: "PROJECT", kind: "project", x: 400, y: 250 },
  { id: "course", label: "COURSE", kind: "course", x: 590, y: 210 },
  { id: "opportunity", label: "OPPORTUNITY", kind: "opportunity", x: 400, y: 390 },
  { id: "person", label: "PERSON", kind: "person", x: 400, y: 480 },
];

const links: [string, string][] = [
  ["skill", "role"],
  ["skill", "project"],
  ["skill", "course"],
  ["role", "opportunity"],
  ["project", "opportunity"],
  ["course", "opportunity"],
  ["opportunity", "person"],
];

const neighbors = new Map<string, Set<string>>();
for (const n of nodes) neighbors.set(n.id, new Set([n.id]));
for (const [a, b] of links) {
  neighbors.get(a)?.add(b);
  neighbors.get(b)?.add(a);
}

// Purely atmospheric background particles — no labels, no interaction, just depth.
function makeParticles(seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: 26 }, (_, i) => ({
    id: `p${i}`,
    x: rand() * 800,
    y: rand() * 520,
    r: 1 + rand() * 1.6,
    dur: 6 + rand() * 8,
    delay: rand() * 4,
  }));
}
const particles = makeParticles(42);

function curve(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const cx = mx - dy * 0.15, cy = my + dx * 0.15;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

const nodeSize: Record<NodeKind, number> = {
  skill: 8, person: 8, role: 5, project: 5, course: 5, opportunity: 6,
};

export function HeroNetwork() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const reduced = useReducedMotion();
  const active = hovered ? neighbors.get(hovered) : null;

  return (
    <svg viewBox="0 0 800 520" className="h-full w-full" aria-hidden="true">
      {/* ambient particles */}
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill="#ffffff"
          initial={{ opacity: 0.12 }}
          animate={reduced ? undefined : { cy: [p.y, p.y - 14, p.y], opacity: [0.08, 0.22, 0.08] }}
          transition={reduced ? undefined : { duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* connections */}
      {links.map(([a, b], i) => {
        const na = nodes.find((n) => n.id === a)!;
        const nb = nodes.find((n) => n.id === b)!;
        const dim = active && !(active.has(a) && active.has(b));
        return (
          <path
            key={i}
            d={curve(na, nb)}
            fill="none"
            stroke="#ffffff"
            strokeWidth={dim ? 0.6 : 1}
            opacity={dim ? 0.08 : 0.28}
            style={{ transition: "opacity 0.3s, stroke-width 0.3s" }}
          />
        );
      })}

      {/* hierarchy nodes */}
      {nodes.map((n) => {
        const dim = active && !active.has(n.id);
        const isHovered = hovered === n.id;
        const r = nodeSize[n.kind] * (isHovered ? 1.3 : 1);
        return (
          <g
            key={n.id}
            className="cursor-default"
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ opacity: dim ? 0.3 : 1, transition: "opacity 0.3s" }}
          >
            {isHovered && <circle cx={n.x} cy={n.y} r={r + 14} fill="none" stroke="#6ea8ff" strokeOpacity={0.3} strokeWidth={1} />}
            <circle cx={n.x} cy={n.y} r={r} fill={isHovered ? "#6ea8ff" : "#e8e8ea"} style={{ transition: "r 0.2s, fill 0.2s" }} />
            <text
              x={n.x}
              y={n.y - r - 12}
              textAnchor="middle"
              fontSize={10}
              letterSpacing="0.12em"
              fill={isHovered ? "#6ea8ff" : "#9a9aa0"}
              fontWeight={600}
              style={{ transition: "fill 0.2s" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
