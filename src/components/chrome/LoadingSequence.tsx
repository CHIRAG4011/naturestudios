'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';

const HOLD_MS = 950;

/**
 * High-tech cinematic intro loading sequence.
 * Lifts to reveal the studio landing page and coordinates with
 * LoadingContext so all hero & navbar elements perform their staggered
 * entrance cascade animations directly after it clears.
 */
export function LoadingSequence() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const { setIsLoaded } = useLoading();

  useEffect(() => {
    if (reduced) {
      setVisible(false);
      setIsLoaded(true);
      return;
    }

    // Trigger element entrance slightly before curtain fully clears for buttery fluidity
    const triggerEntrance = setTimeout(() => {
      setIsLoaded(true);
    }, HOLD_MS - 150);

    const timer = setTimeout(() => {
      setVisible(false);
    }, HOLD_MS);

    return () => {
      clearTimeout(triggerEntrance);
      clearTimeout(timer);
    };
  }, [reduced, setIsLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9800] flex items-center justify-center bg-[#030712]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-[#2563EB]/25 via-[#0B132B]/50 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Brand Logo & Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="NatureStudios Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                  priority
                />
              </div>
              <p className="font-mono text-sm uppercase tracking-[0.35em] text-[#F8FAFC] font-black">
                NatureStudios
              </p>
            </motion.div>

            {/* Glowing High-Tech Progress Bar */}
            <div className="h-[2px] w-56 overflow-hidden rounded-full bg-[#172554] border border-[#1E3A8A]/50">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000, ease: 'easeInOut' }}
                className="h-full w-full origin-left bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#60A5FA] shadow-[0_0_16px_rgba(56,189,248,0.9)]"
              />
            </div>

            {/* Telemetry Tag */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#38BDF8]/90 font-bold"
            >
              [ INITIALIZING PIPELINE // V2.6 ]
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
