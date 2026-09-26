'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
 * Rebuilt in Burgundy (#2563EB), Dark Wine (#0B132B), and Warm Beige (#38BDF8).
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
    <main id="main" className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#030712] text-[#F8FAFC] overflow-hidden selection:bg-[#2563EB] selection:text-[#38BDF8]">
      {/* Ambient Burgundy Atmosphere */}
      <div className="absolute top-1/4 -left-40 w-[30rem] h-[30rem] rounded-full bg-radial from-[#2563EB]/50 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[28rem] h-[28rem] rounded-full bg-radial from-[#38BDF8]/15 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 hud-grid opacity-35 pointer-events-none" />

      {/* Back to site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#94A3B8] hover:text-[#38BDF8] transition-colors py-2 px-3.5 rounded-lg border border-[#1E3A8A] bg-[#0B132B]/80 backdrop-blur-md"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span>{backLabel}</span>
        </Link>
      </div>

      {/* Elevated Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-7 sm:p-9 rounded-2xl border border-[#1E3A8A] bg-[#0B132B]/95 backdrop-blur-xl shadow-2xl"
      >
        {/* Branded Studio Mark */}
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F1D38] border border-[#1E3A8A] p-2.5 shadow-glow-burgundy transition-all duration-300 hover:scale-105 hover:border-[#38BDF8]/50"
            aria-label="Return to NatureStudios homepage"
          >
            <Image
              src="/logo.png"
              alt="NatureStudios Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]"
              priority
            />
          </Link>
        </div>

        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-6 space-y-2.5">
            {eyebrow && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-[10px] font-mono tracking-widest uppercase text-[#38BDF8]">
                {eyebrow}
              </span>
            )}
            {title && (
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#F8FAFC] tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-[#7DD3FC] leading-relaxed font-light">{subtitle}</p>
            )}
          </div>
        )}

        {children}
      </motion.div>

      {/* Footer Tagline */}
      <p className="relative z-10 mt-8 text-[11px] font-mono uppercase tracking-[0.25em] text-[#38BDF8]/60">
        NATURESTUDIOS • ESPORTS • CREATIVE • DIGITAL
      </p>
    </main>
  );
}
