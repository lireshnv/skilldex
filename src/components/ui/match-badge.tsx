"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { matchBreakdown, weakestFactors } from "@/lib/match-breakdown";
import { cn } from "@/lib/utils";

/**
 * A "68% match" badge that explains itself on click — per the redesign
 * brief's match-score-explainability spec: skill alignment / evidence /
 * assessment / experience / role fit, summing to the total, plus a
 * recommendation naming the weakest factors. Self-contained (own open
 * state) so it's safe to drop inside a clickable card/Link — clicking it
 * stops the click from also triggering the parent's navigation.
 */
export function MatchBadge({ score, className }: { score: number; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const breakdown = React.useMemo(() => matchBreakdown(score), [score]);
  const weak = React.useMemo(() => weakestFactors(breakdown), [breakdown]);

  return (
    <div className={cn("relative inline-block", className)} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="inline-flex items-center gap-1 rounded-full border border-emerald/20 bg-emerald-light/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald transition-colors cursor-pointer hover:border-emerald/40"
        aria-expanded={open}
      >
        {score}% match
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-2 w-56 rounded-[var(--radius-md)] border border-border bg-surface p-3 text-xs shadow-[var(--shadow-lg)]"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Why this match</p>
            <div className="space-y-1">
              {breakdown.map((f) => (
                <div key={f.label} className="flex items-center justify-between text-muted-foreground">
                  <span>{f.label}</span>
                  <span className="font-medium text-foreground">{f.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-between border-t border-border pt-1.5 text-sm font-bold text-foreground">
              <span>Total</span>
              <span>{score}%</span>
            </div>
            <p className="mt-2 rounded-[var(--radius-sm)] bg-blue-light px-2 py-1.5 text-[11px] text-blue-2">
              Improve {weak.join(" and ")} to strengthen this match.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
