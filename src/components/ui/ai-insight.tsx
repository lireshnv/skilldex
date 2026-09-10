"use client";
import { Sparkles, ArrowRight } from "lucide-react";
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
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-blue/15 bg-gradient-to-br from-blue-light via-surface to-violet-light p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-2">{title}</p>
          <div className="text-sm leading-relaxed text-foreground">{children}</div>
          {actionLabel && (
            <button
              onClick={onAction}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-2 hover:underline cursor-pointer"
            >
              {actionLabel} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
