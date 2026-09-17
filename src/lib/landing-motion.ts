// Motion vocabulary for the landing page only — calmer, slower easing than
// the app-wide src/lib/motion.ts, since a marketing page and a dashboard
// should not feel like they're moving at the same speed.
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

export const revealUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_CINEMATIC } },
};

export const revealStagger = (stagger = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_CINEMATIC } },
};
