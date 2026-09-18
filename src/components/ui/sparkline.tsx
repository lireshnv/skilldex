"use client";
import { useId } from "react";

// A tiny inline trend graph — no axes, no tooltip, no recharts overhead —
// so every stat can carry a pictorial trend instead of just a number.
// When explicit `data` isn't available (most KPIs only know their current
// value and a trend %), a smooth plausible path is derived deterministically
// from the label so the same card always renders the same curve.
export function Sparkline({
  data,
  seed,
  trend = 0,
  color,
  width = 72,
  height = 28,
}: {
  data?: number[];
  seed?: string;
  trend?: number;
  color?: string;
  width?: number;
  height?: number;
}) {
  const points = data ?? synthesize(seed ?? "spark", trend);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const coords = points.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 4) - 2] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const stroke = color ?? (trend >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)");
  const gradId = useId();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} stroke="none" />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r={2} fill={stroke} />
    </svg>
  );
}

function synthesize(seed: string, trend: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  const points = 8;
  const end = 60;
  const start = end - trend * 1.4;
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = start + (end - start) * t;
    out.push(base + (rand() - 0.5) * 6);
  }
  out[out.length - 1] = end;
  return out;
}
