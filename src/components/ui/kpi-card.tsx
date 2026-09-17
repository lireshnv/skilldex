"use client";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accent = "blue",
  suffix,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  accent?: "blue" | "emerald" | "amber" | "rose" | "violet" | "navy";
  suffix?: string;
}) {
  const accentMap: Record<string, string> = {
    blue: "bg-blue-light text-blue-2",
    emerald: "bg-emerald-light text-emerald",
    amber: "bg-amber-light text-amber",
    rose: "bg-rose-light text-rose",
    violet: "bg-violet-light text-violet",
    navy: "bg-navy text-white",
  };
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
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] shadow-sm", accentMap[accent])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span className={cn("flex items-center gap-0.5 font-semibold", positive ? "text-emerald" : "text-rose")}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground">{trendLabel ?? "vs last month"}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
