'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'ns_intro_played';
const HOLD_MS = 900;

/**
 * First-visit intro plate. Client-only, so crawlers and no-JS visitors never see
 * it, and it plays once per browser session — returning to the site mid-session
 * goes straight to content.
 *
 * It sits above the page rather than replacing it: the real markup is already
 * mounted and painted underneath while the plate lifts.
 */
export function LoadingSequence() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;

    let alreadyPlayed = false;
    try {
      alreadyPlayed = window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // Private-mode or blocked storage — treat it as "already played" so we
      // never trap a user behind an intro that cannot record itself.
      alreadyPlayed = true;
    }
    if (alreadyPlayed) return;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* non-fatal */
    }

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9800] flex items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="grain absolute inset-0" />
          <div className="orb-burgundy absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 opacity-60" />

          <div className="relative flex flex-col items-center gap-5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-[#F8FAFC] font-black"
            >
              NatureStudios
            </motion.p>

            <div className="h-[2px] w-48 overflow-hidden rounded-full bg-[#172554]">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000, ease: 'linear' }}
                className="h-full w-full origin-left bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#1D4ED8] shadow-[0_0_12px_rgba(56,189,248,0.7)]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#38BDF8]/80 font-bold"
            >
              Creative Technology & Broadcast
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
