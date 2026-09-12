'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin forest-to-ember hairline at the very top of the viewport that fills as
 * the document scrolls. Uses the shared `.scroll-progress-bar` token styling.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  // Spring smoothing removes the jitter of wheel/trackpad deltas. For
  // reduced-motion users the raw value is bound directly so the bar still
  // reports position but never eases.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress-bar w-full"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
      aria-hidden="true"
    />
  );
}
