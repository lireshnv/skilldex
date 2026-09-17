"use client";
import * as React from "react";

interface GNode { id: string; label: string; x: number; y: number; big?: boolean }

const gNodes: GNode[] = [
  { id: "python", label: "Python", x: 70, y: 190, big: true },
  { id: "ml", label: "Machine Learning", x: 260, y: 110, big: true },
  { id: "nlp", label: "NLP", x: 430, y: 50 },
  { id: "cv", label: "Computer Vision", x: 430, y: 150 },
  { id: "da", label: "Data Analysis", x: 260, y: 270, big: true },
  { id: "ds", label: "Data Scientist", x: 430, y: 270 },
];
const gLinks: [string, string][] = [
  ["python", "ml"], ["python", "da"], ["ml", "nlp"], ["ml", "cv"], ["da", "ds"],
];
const neighbors = new Map<string, Set<string>>();
for (const n of gNodes) neighbors.set(n.id, new Set([n.id]));
for (const [a, b] of gLinks) { neighbors.get(a)?.add(b); neighbors.get(b)?.add(a); }

function curve(a: GNode, b: GNode) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  return `M ${a.x} ${a.y} Q ${mx - dy * 0.1} ${my + dx * 0.1} ${b.x} ${b.y}`;
}

export function SkillGraphMini() {
  const [hovered, setHovered] = React.useState<string | null>("ml");
  const active = hovered ? neighbors.get(hovered) : null;

  return (
    <svg viewBox="0 0 600 320" className="h-full w-full">
      {gLinks.map(([a, b], i) => {
        const na = gNodes.find((n) => n.id === a)!;
        const nb = gNodes.find((n) => n.id === b)!;
        const dim = active && !(active.has(a) && active.has(b));
        return (
          <path key={i} d={curve(na, nb)} fill="none" stroke="#ffffff" strokeWidth={dim ? 0.6 : 1.2} opacity={dim ? 0.08 : 0.3} style={{ transition: "opacity 0.3s" }} />
        );
      })}
      {gNodes.map((n) => {
        const dim = active && !active.has(n.id);
        const isHovered = hovered === n.id;
        const r = (n.big ? 6 : 4) * (isHovered ? 1.25 : 1);
        return (
          <g
            key={n.id}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ opacity: dim ? 0.3 : 1, transition: "opacity 0.3s" }}
          >
            <circle cx={n.x} cy={n.y} r={r} fill={isHovered ? "#6ea8ff" : "#d8d8db"} style={{ transition: "r 0.2s, fill 0.2s" }} />
            <text x={n.x + r + 10} y={n.y + 4} fontSize={12} fill={isHovered ? "#6ea8ff" : "#a8a8ad"} fontWeight={n.big ? 600 : 500} style={{ transition: "fill 0.2s" }}>
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
