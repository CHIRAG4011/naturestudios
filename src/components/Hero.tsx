'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, ChevronDown, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLoading } from '@/context/LoadingContext';
import { AmbientField } from '@/components/motion/AmbientField';
import { Magnetic } from '@/components/motion/Magnetic';
import { StudioLogoVisual } from '@/components/motion/KaultChromeVisual';

/**
 * Clean & Cinematic NatureStudios Studio Hero
 * Fluid motion choreography with post-loading entrance cascade:
 * - Elements glide and bloom with cinematic depth
 * - 3D chrome metallic sculpture blooms from void
 * - Zero tech clutter, zero velocity/protocol/pipeline badges
 */
export function Hero() {
  const { user, openSqueeze } = useAuth();
  const { isLoaded } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Parallax Springs
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;

    mouseX.set(normX * 14);
    mouseY.set(normY * 14);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '-30px']);

  return (
    <section
      ref={containerRef}
      id="home"
      onMouseMove={handleHeroMouseMove}
      className="relative min-h-[92vh] lg:min-h-screen overflow-hidden bg-[#150304] text-[#FFF5ED] flex flex-col justify-between"
      aria-label="Studio Hero"
    >
      {/* Background Ambient Atmosphere */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#150304] via-[#240709] to-[#150304]"
        style={{ scale: bgScale, y: bgY }}
      >
        {/* Burgundy Core Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-radial from-[#59171B]/55 via-[#3A0E11]/30 to-transparent blur-[140px] pointer-events-none" />

        {/* Radiant Warm Beige Ambient Sweep */}
        <div className="absolute -top-24 right-10 w-[600px] h-[600px] rounded-full bg-radial from-[#FED7B8]/25 via-[#F7C49E]/10 to-transparent blur-[130px] pointer-events-none" />

        {/* Dynamic Canvas Cyber Light Field */}
        <AmbientField particleCount={34} className="opacity-75 z-[1]" />

        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none z-[2]" />
      </motion.div>

      {/* Top Status Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={isLoaded ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pt-28 px-6 lg:px-12 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-[#B89B8D] pointer-events-none"
      >
        <div className="flex items-center gap-3">
          <span className="badge-live">LIVE TRANSMISSION</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#FFF5ED] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#18A957]" /> ENGINE: ACTIVE
          </span>
          <span className="hidden md:inline text-[#B89B8D]">DOM: NATURESTUDIO.IN</span>
        </div>
      </motion.div>

      {/* Main Hero Stage */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12 flex-1 flex flex-col justify-center w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bold Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
            {/* Studio Eyebrow */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={isLoaded ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D0A0E]/80 border border-[#52141A] shadow-glow-burgundy backdrop-blur-md mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FED7B8]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#FED7B8] uppercase font-bold">
                ESPORTS • CREATIVE • DIGITAL
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ y: 45, opacity: 0, scale: 0.98 }}
              animate={isLoaded ? { y: 0, opacity: 1, scale: 1 } : { y: 45, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.92] mb-6 text-[#FFF5ED]"
            >
              <span className="sr-only">Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology.</span>
              ENGINEERING <br />
              <span className="text-gradient-warm inline-block hover:scale-[1.01] transition-transform duration-300">
                THE DIGITAL WILD.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 25, opacity: 0 }}
              animate={isLoaded ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-base sm:text-lg text-[#B89B8D] leading-relaxed font-light mb-8"
            >
              Nature moves. We create. An elite creative studio engineering stadium visual systems, cinematic tournament broadcasts, and bespoke digital portfolio realms.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={isLoaded ? { y: 0, opacity: 1, scale: 1 } : { y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Magnetic>
                <Link
                  href="/portfolio"
                  className="btn-primary text-xs py-3.5 px-6 shadow-glow-burgundy group flex items-center gap-2"
                >
                  <span>Explore Studio Portfolio</span>
                  <ArrowRight className="w-4 h-4 text-[#FFF5ED] group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  href="/portfolio/edit"
                  className="btn-secondary text-xs py-3.5 px-6 group flex items-center gap-2 border border-[#52141A]"
                >
                  <span>Create Your Portfolio</span>
                  <Sparkles className="w-4 h-4 text-[#FED7B8] group-hover:rotate-12 transition-transform duration-200" />
                </Link>
              </Magnetic>

              {user ? (
                <Magnetic>
                  <Link
                    href="/dashboard"
                    className="btn-secondary text-xs py-3.5 px-5 group flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-[#FFF5ED]" />
                    <span>Command Center</span>
                  </Link>
                </Magnetic>
              ) : (
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => openSqueeze('register')}
                    className="btn-secondary text-xs py-3.5 px-5 group cursor-pointer text-[#B89B8D] hover:text-[#FFF5ED]"
                  >
                    <span>Client Access</span>
                  </button>
                </Magnetic>
              )}
            </motion.div>

            {/* Metric Strip */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={isLoaded ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#3D0D13] w-full max-w-lg font-mono"
            >
              <div className="group cursor-default">
                <div className="text-xl sm:text-3xl font-black text-[#FED7B8] tabular-nums group-hover:text-[#FFF5ED] transition-colors">
                  200+
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#B89B8D] mt-1">
                  [ LIVE BROADCASTS ]
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-xl sm:text-3xl font-black text-[#FFF5ED] tabular-nums group-hover:text-[#FED7B8] transition-colors">
                  40+
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#B89B8D] mt-1">
                  [ ARENA STAGES ]
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-xl sm:text-3xl font-black text-[#FED7B8] tabular-nums group-hover:text-[#FFF5ED] transition-colors">
                  8yr
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#B89B8D] mt-1">
                  [ STUDIO CRAFT ]
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Chrome Sculpture */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] lg:min-h-[560px]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
              animate={isLoaded ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : { scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg aspect-square flex items-center justify-center"
            >
              <StudioLogoVisual />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-6 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B89B8D]">
          Scroll Into The Story
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#FED7B8]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
