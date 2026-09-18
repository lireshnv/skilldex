"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PortalHeroProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  children?: React.ReactNode;
}

// A per-portal identity banner so every dashboard doesn't open with the same
// bare "h1 + p" — the accent color and icon vary per portal (see each
// page's call site), giving each workspace a distinct visual signature
// while reusing one component instead of five bespoke headers.
export function PortalHero({ icon: Icon, eyebrow, title, subtitle, accent, children }: PortalHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-6 overflow-hidden rounded-[var(--radius-lg)] border border-border p-6"
      style={{ background: `linear-gradient(135deg, ${accent}14 0%, var(--surface) 55%)` }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: accent }}
      />
      <Icon
        className="pointer-events-none absolute -bottom-6 right-4 h-28 w-28 opacity-[0.06]"
        style={{ color: accent }}
        strokeWidth={1}
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)]" style={{ background: `${accent}22`, color: accent }}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </motion.div>
  );
}
