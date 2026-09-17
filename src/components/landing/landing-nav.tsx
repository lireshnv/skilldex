"use client";
import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Intelligence", href: "#loop" },
  { label: "For Students", href: "#student" },
  { label: "Institutions", href: "#institution" },
  { label: "Industry", href: "#industry" },
];

export function LandingNav({ onExplore }: { onExplore: () => void }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <div
          className={cn(
            "flex w-full max-w-3xl items-center justify-between gap-6 rounded-full px-5 py-2.5 transition-all duration-300",
            scrolled ? "sd-glass-strong shadow-[0_8px_30px_rgba(0,0,0,0.4)]" : "border border-transparent bg-transparent"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">SD</div>
            <span className="text-sm font-semibold text-[var(--sd-text)]">SkillDex</span>
          </div>

          <nav className="hidden items-center gap-6 text-[13px] font-medium text-[var(--sd-text-muted)] md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--sd-text)]">
                {l.label}
              </a>
            ))}
          </nav>

          <button
            onClick={onExplore}
            className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 md:inline-flex"
          >
            Explore SkillDex →
          </button>

          <button className="text-[var(--sd-text)] md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--sd-bg)] md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-semibold text-[var(--sd-text)]"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); onExplore(); }}
            className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black"
          >
            Explore SkillDex →
          </button>
        </motion.div>
      )}
    </>
  );
}
