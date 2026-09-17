"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

/**
 * Scroll-triggered fade-up for content that's likely below the fold (e.g.
 * secondary sections on a dense detail page). Fires once, mirrors the
 * whileInView pattern already used for the landing page's loop steps.
 */
export function RevealOnView({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}
