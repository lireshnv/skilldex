"use client";
import { motion, useReducedMotion } from "framer-motion";

// A quiet background for compact, centered forms (auth screens) — the
// HeroNetwork diagram's node labels (SKILL/ROLE/COURSE/...) read fine
// spread across a wide hero, but collide with card content at this size.
// No text, just drifting soft glow + the shared grid/grain texture.
export function AuthBackground() {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="sd-grid absolute inset-0 opacity-40" />
      <motion.div
        className="absolute -left-32 top-[-10%] h-[520px] w-[520px] rounded-full opacity-25 blur-[110px]"
        style={{ background: "radial-gradient(circle, #6ea8ff 0%, transparent 70%)" }}
        animate={reduced ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={reduced ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 bottom-[-15%] h-[560px] w-[560px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }}
        animate={reduced ? undefined : { x: [0, -25, 0], y: [0, -15, 0] }}
        transition={reduced ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(ellipse 60% 45% at 50% 40%, transparent 0%, var(--sd-bg) 100%)" }}
      />
    </div>
  );
}
