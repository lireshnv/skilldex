"use client";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Opt-in staggered reveal for a grid/list of peer items — wrap the existing
 * grid container in StaggerGrid (className passes straight through, so
 * existing Tailwind grid classes are untouched) and each mapped child in
 * StaggerItem. Framer Motion propagates variants from parent to child
 * automatically, so children don't need their own initial/animate props.
 */
export function StaggerGrid({
  children,
  className,
  stagger,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div initial="hidden" animate="show" variants={staggerContainer(stagger)} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
