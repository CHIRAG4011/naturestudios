'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/** Total sweep length in ms — inside the 300–700ms window the brief calls for. */
const SWEEP_MS = 520;

/**
 * Route-change curtain. On navigation a void-coloured plate is already opaque
 * over the new page and lifts away, which hides the paint-in of the incoming
 * route and gives every transition the same cinematic beat.
 *
 * The overlay is `pointer-events: none` in CSS, so it can never swallow a click
 * even if an animation is interrupted mid-flight.
 */
export function PageTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isFirstRender = useRef(true);
  const [sweepKey, setSweepKey] = useState<string | null>(null);

  useEffect(() => {
    // The initial page load is handled by the loading sequence, not here.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (reduced) return;

    setSweepKey(pathname);
    const timer = setTimeout(() => setSweepKey(null), SWEEP_MS + 60);
    return () => clearTimeout(timer);
  }, [pathname, reduced]);

  return (
    <AnimatePresence>
      {sweepKey && (
        <motion.div
          key={sweepKey}
          className="page-transition-overlay"
          initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          animate={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: SWEEP_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="grain absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-forest to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
