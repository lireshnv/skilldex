// Shared Framer Motion vocabulary — one duration/easing/variant set every
// component reaches for, instead of each hand-picking its own numbers.
// EASE_GLOW matches the cubic-bezier already established by .glow-card in
// globals.css, so hover and entrance motion feel like the same system.
import type { Variants } from "framer-motion";

export const EASE_GLOW = [0.16, 1, 0.3, 1] as const;

export const DURATION = { fast: 0.18, base: 0.3, slow: 0.5 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_GLOW } },
};

export function staggerContainer(stagger = 0.06): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: 0.02 } },
  };
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_GLOW } },
};
