"use client";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./card";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";

// Deliberately not color-coded by "accent" anymore — every KPI icon used to
// sit in a different rainbow-colored box (blue/violet/amber/rose/emerald)
// with no semantic meaning behind the choice, which read as decorative
// noise rather than information. Icons are now a single neutral tone; the
// only color that survives is the trend itself (green up / red down) and
// its sparkline, so color now always means something.
export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  suffix,
  spark,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  /** @deprecated icon accent color is no longer used — kept for call-site compatibility */
  accent?: "blue" | "emerald" | "amber" | "rose" | "violet" | "navy";
  suffix?: string;
  /** explicit trend series; falls back to a deterministic synthesized curve from the label */
  spark?: number[];
}) {
  const positive = (trend ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35 }}
    >
      <Card hover className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
              {value}
              {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
            </p>
          </div>
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-surface-interactive text-muted-foreground">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          {trend !== undefined ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className={cn("flex items-center gap-0.5 font-semibold", positive ? "text-emerald" : "text-rose")}>
                {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(trend)}%
              </span>
              <span className="text-muted-foreground">{trendLabel ?? "vs last month"}</span>
            </div>
          ) : trendLabel ? (
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
          ) : (
            <span />
          )}
          <Sparkline seed={label} trend={trend ?? 0} data={spark} />
        </div>
      </Card>
    </motion.div>
  );
}
