"use client";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const gridStroke = "#e4e7ee";
const tickStyle = { fontSize: 11, fill: "#5b6478" };

interface TooltipPayloadItem {
  color?: string;
  name?: string | number;
  value?: string | number;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 shadow-[var(--shadow-md)]">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span style={{ color: p.color }}>●</span> {p.name}: <span className="font-medium text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function TrendAreaChart({ data, dataKey, xKey = "label", color = "#1d4ed8", height = 220 }: { data: Record<string, string | number>[]; dataKey: string; xKey?: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLineChart({ data, lines, xKey = "label", height = 240 }: { data: Record<string, string | number>[]; lines: { key: string; color: string; name?: string }[]; xKey?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {lines.map((l) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.name ?? l.key} stroke={l.color} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ComparisonBarChart({ data, bars, xKey = "label", height = 240, layout = "horizontal" }: { data: Record<string, string | number>[]; bars: { key: string; color: string; name?: string }[]; xKey?: string; height?: number; layout?: "horizontal" | "vertical" }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ top: 8, right: 8, left: layout === "vertical" ? 40 : -20, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} horizontal={layout === "horizontal"} vertical={layout === "vertical"} />
        {layout === "horizontal" ? (
          <>
            <XAxis dataKey={xKey} tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey={xKey} tick={tickStyle} axisLine={false} tickLine={false} width={120} />
          </>
        )}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(29,78,216,0.05)" }} />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.name ?? b.key} fill={b.color} radius={[4, 4, 4, 4]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, height = 220 }: { data: { name: string; value: number; color: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={2}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
