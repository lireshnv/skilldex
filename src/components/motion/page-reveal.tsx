"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

/**
 * Wraps page content in a single fade + slide-up. Mounted once per
 * PortalShell render, so it replays on every route change (each portal page
 * is a leaf that unmounts/remounts on navigation) without needing
 * AnimatePresence or an exit animation.
 */
export function PageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}
