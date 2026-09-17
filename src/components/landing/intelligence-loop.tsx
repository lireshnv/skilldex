"use client";
import * as React from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

const stages = [
  { label: "Assess", desc: "Understand what a person actually knows." },
  { label: "Identify", desc: "Find missing and transferable capabilities." },
  { label: "Develop", desc: "Create a personalized growth path." },
  { label: "Evidence", desc: "Validate skills through projects, assessments and outcomes." },
  { label: "Match", desc: "Connect capability with opportunities." },
  { label: "Outcome", desc: "Feed real-world results back into the intelligence layer." },
];

export function IntelligenceLoop() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const indexMotion = useTransform(scrollYProgress, [0, 1], [0, stages.length - 1]);

  useMotionValueEvent(indexMotion, "change", (v) => setActive(Math.round(Math.max(0, Math.min(stages.length - 1, v)))));

  const ringRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div ref={trackRef} style={{ height: `${stages.length * 60}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--sd-text-faint)]">
          02 — The Intelligence Loop
        </p>

        <div className="relative flex h-[420px] w-[420px] items-center justify-center sm:h-[520px] sm:w-[520px]">
          {/* orbital ring */}
          <motion.svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ rotate: ringRotation }}>
            <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </motion.svg>

          {/* center label */}
          <div className="relative z-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sd-text-faint)]">Skill</p>
            <p className="text-xl font-semibold text-[var(--sd-text)]">Intelligence</p>
          </div>

          {/* stage nodes around the ring */}
          {stages.map((s, i) => {
            const angle = (i / stages.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 180;
            const x = 200 + Math.cos(angle) * radius;
            const y = 200 + Math.sin(angle) * radius;
            const isActive = active === i;
            return (
              <div
                key={s.label}
                className="absolute flex flex-col items-center gap-1.5"
                style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%`, transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.4 : 1, backgroundColor: isActive ? "#6ea8ff" : "rgba(255,255,255,0.25)" }}
                  transition={{ duration: 0.4 }}
                  className="h-2.5 w-2.5 rounded-full"
                />
                <span className={cn("text-[11px] font-medium transition-colors duration-300", isActive ? "text-[var(--sd-text)]" : "text-[var(--sd-text-faint)]")}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 h-16 max-w-md px-6 text-center">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm leading-relaxed text-[var(--sd-text-muted)] sm:text-base"
          >
            {stages[active].desc}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
