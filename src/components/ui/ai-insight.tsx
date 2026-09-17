"use client";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AIInsight({
  title = "SkillDex Insight",
  children,
  actionLabel,
  onAction,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-blue/25 bg-gradient-to-br from-blue-light/80 via-surface to-violet-light/50 p-5 shadow-xs",
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
          <Sparkles className="h-4 w-4 text-sky" />
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-2">{title}</p>
          <div className="text-sm leading-relaxed text-foreground">{children}</div>
          {actionLabel && (
            <button
              onClick={onAction}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-2 hover:text-blue hover:underline cursor-pointer group"
            >
              {actionLabel} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
