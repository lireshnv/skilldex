"use client";
import * as React from "react";

interface GNode { id: string; label: string; x: number; y: number; big?: boolean }

const gNodes: GNode[] = [
  { id: "python", label: "Python", x: 70, y: 180, big: true },
  { id: "ml", label: "Machine Learning", x: 380, y: 40 },
  { id: "da", label: "Data Analysis", x: 380, y: 105 },
  { id: "nlp", label: "NLP", x: 380, y: 170 },
  { id: "cv", label: "Computer Vision", x: 380, y: 235 },
  { id: "ds", label: "Data Science", x: 380, y: 300 },
  { id: "se", label: "Software Engineering", x: 380, y: 365 },
];
const gLinks: [string, string][] = [
  ["python", "ml"], ["python", "da"], ["python", "nlp"], ["python", "cv"], ["python", "ds"], ["python", "se"],
];
const neighbors = new Map<string, Set<string>>();
for (const n of gNodes) neighbors.set(n.id, new Set([n.id]));
for (const [a, b] of gLinks) { neighbors.get(a)?.add(b); neighbors.get(b)?.add(a); }

function curve(a: GNode, b: GNode) {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
}

export function SkillGraphMini() {
  const [hovered, setHovered] = React.useState<string | null>("python");
  const active = hovered ? neighbors.get(hovered) : null;

  return (
    <svg viewBox="0 0 620 400" className="h-full w-full">
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
        const r = (n.big ? 7 : 4) * (isHovered ? 1.25 : 1);
        return (
          <g
            key={n.id}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ opacity: dim ? 0.3 : 1, transition: "opacity 0.3s" }}
          >
            <circle cx={n.x} cy={n.y} r={r} fill={isHovered ? "#6ea8ff" : "#d8d8db"} style={{ transition: "r 0.2s, fill 0.2s" }} />
            <text
              x={n.big ? n.x - r - 10 : n.x + r + 10}
              y={n.y + 4}
              textAnchor={n.big ? "end" : "start"}
              fontSize={n.big ? 14 : 12}
              fill={isHovered ? "#6ea8ff" : "#a8a8ad"}
              fontWeight={n.big ? 600 : 500}
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
