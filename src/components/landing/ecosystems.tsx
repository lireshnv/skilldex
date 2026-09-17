"use client";
import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Ecosystems() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  const studentX = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const industryX = useTransform(scrollYProgress, [0, 0.55], [0, -1]);
  const wordsOpacity = useTransform(scrollYProgress, [0.5, 0.65], [1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const revealScale = useTransform(scrollYProgress, [0.55, 0.8], [0.9, 1]);

  return (
    <div ref={trackRef} style={{ height: "220vh" }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative flex w-full max-w-4xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <motion.span
            style={{ x: useTransform(studentX, (v) => v * 40), opacity: wordsOpacity }}
            className="text-3xl font-semibold tracking-tight text-[var(--sd-text)] sm:text-5xl"
          >
            STUDENT
          </motion.span>
          <motion.span style={{ opacity: wordsOpacity }} className="text-3xl font-semibold tracking-tight text-[var(--sd-text-faint)] sm:text-5xl">
            INSTITUTION
          </motion.span>
          <motion.span
            style={{ x: useTransform(industryX, (v) => v * 40), opacity: wordsOpacity }}
            className="text-3xl font-semibold tracking-tight text-[var(--sd-text)] sm:text-5xl"
          >
            INDUSTRY
          </motion.span>
        </div>

        <motion.div style={{ opacity: revealOpacity, scale: revealScale }} className="absolute flex flex-col items-center text-center">
          <p className="text-5xl font-bold tracking-tight text-[var(--sd-text)] sm:text-7xl">SKILLDEX</p>
          <p className="mt-4 max-w-md text-sm text-[var(--sd-text-muted)] sm:text-base">One intelligence layer connecting them.</p>
        </motion.div>
      </div>
    </div>
  );
}
