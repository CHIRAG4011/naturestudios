'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface AuthShellProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  accent?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

/**
 * Shared cinematic frame for every /login /register /verify /forgot-password /reset-password route.
 * Rebuilt in Burgundy (#59171B), Dark Wine (#240709), and Warm Beige (#FED7B8).
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  backHref = '/',
  backLabel = 'Return to NatureStudios',
  children,
}: AuthShellProps) {
  return (
    <main id="main" className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#150304] text-[#FFF5ED] overflow-hidden selection:bg-[#59171B] selection:text-[#FED7B8]">
      {/* Ambient Burgundy Atmosphere */}
      <div className="absolute top-1/4 -left-40 w-[30rem] h-[30rem] rounded-full bg-radial from-[#59171B]/50 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[28rem] h-[28rem] rounded-full bg-radial from-[#FED7B8]/15 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 hud-grid opacity-35 pointer-events-none" />

      {/* Back to site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B89B8D] hover:text-[#FED7B8] transition-colors py-2 px-3.5 rounded-lg border border-[#52141A] bg-[#240709]/80 backdrop-blur-md"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#FED7B8]" />
          <span>{backLabel}</span>
        </Link>
      </div>

      {/* Elevated Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-7 sm:p-9 rounded-2xl border border-[#52141A] bg-[#240709]/95 backdrop-blur-xl shadow-2xl"
      >
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-6 space-y-2.5">
            {eyebrow && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-[10px] font-mono tracking-widest uppercase text-[#FED7B8]">
                {eyebrow}
              </span>
            )}
            {title && (
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#FFF5ED] tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-[#E8C5A5] leading-relaxed font-light">{subtitle}</p>
            )}
          </div>
        )}

        {children}
      </motion.div>

      {/* Footer Tagline */}
      <p className="relative z-10 mt-8 text-[11px] font-mono uppercase tracking-[0.25em] text-[#FED7B8]/60">
        NATURESTUDIOS • ESPORTS • CREATIVE • DIGITAL
      </p>
    </main>
  );
}
