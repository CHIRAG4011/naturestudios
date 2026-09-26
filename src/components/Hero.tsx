'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, ChevronDown, Trophy, Activity, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AmbientField } from '@/components/motion/AmbientField';
import { Magnetic } from '@/components/motion/Magnetic';
import { KaultChromeVisual } from '@/components/motion/KaultChromeVisual';
import { StudioWorkflowCard } from '@/components/motion/StudioWorkflowCard';

/**
 * KaultAI-Grade Autonomous Motion Hero for NatureStudios
 * Featuring 3D Chrome Sculpture, Interactive Studio Terminal,
 * HUD Brackets, and Lenis Inertial Scroll reactivity.
 */
export function Hero() {
  const { user, openSqueeze } = useAuth();
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

  // Floating stickers / badges parallax reaction
  const badgeY1 = useTransform(scrollYProgress, [0, 1], ['0px', '-70px']);
  const badgeY2 = useTransform(scrollYProgress, [0, 1], ['0px', '-90px']);

  return (
    <section
      ref={containerRef}
      id="home"
      onMouseMove={handleHeroMouseMove}
      className="relative min-h-[92vh] lg:min-h-screen overflow-hidden bg-[#030712] text-[#F8FAFC] flex flex-col justify-between"
      aria-label="Studio Hero"
    >
      {/* Background Ambient Atmosphere */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#050B17] via-[#0B132B] to-[#030712]"
        style={{ scale: bgScale, y: bgY }}
      >
        {/* Electric Blue Core Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-radial from-[#2563EB]/40 via-[#1E40AF]/20 to-transparent blur-[140px] pointer-events-none" />

        {/* Cyan Ambient Sweep */}
        <div className="absolute -top-24 right-10 w-[600px] h-[600px] rounded-full bg-radial from-[#38BDF8]/25 via-[#60A5FA]/10 to-transparent blur-[130px] pointer-events-none" />

        {/* Dynamic Canvas Cyber Light Field */}
        <AmbientField particleCount={34} className="opacity-75 z-[1]" />

        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none z-[2]" />
      </motion.div>

      {/* Top HUD Status Bar */}
      <div className="relative z-10 pt-28 px-6 lg:px-12 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-[#94A3B8] pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="badge-live">LIVE TRANSMISSION</span>
          <span className="text-[#38BDF8] tracking-widest hidden sm:inline">[ PROTOCOL // V2.6 ]</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#38BDF8] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#18A957]" /> ENGINE: ACTIVE
          </span>
          <span className="hidden md:inline text-[#94A3B8]">DOM: NATURESTUDIO.IN</span>
        </div>
      </div>

      {/* Main Hero Stage - KaultAI Split Presentation */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12 flex-1 flex flex-col justify-center w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Bold Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
            {/* KaultAI HUD Brackets Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38]/90 border border-[#1E3A8A] shadow-[0_0_15px_rgba(37,99,235,0.3)] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                  [ VELOCITY_X ]
                </span>
              </div>
              <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-[#2563EB] to-transparent" />
              <span className="hidden sm:inline text-[11px] font-mono text-[#94A3B8] tracking-widest uppercase">
                AUTONOMOUS STUDIO PIPELINE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.92] mb-6 text-[#F8FAFC]"
            >
              <span className="sr-only">Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology.</span>
              ENGINEERING <br />
              <span className="text-gradient-warm inline-block hover:scale-[1.01] transition-transform duration-300">
                THE DIGITAL WILD.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-base sm:text-lg text-[#94A3B8] leading-relaxed font-light mb-8"
            >
              Nature moves. We create. An elite creative studio engineering stadium visual systems, cinematic tournament broadcasts, and bespoke digital portfolio realms.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Magnetic>
                <Link
                  href="/portfolio"
                  className="btn-primary text-xs py-3.5 px-6 shadow-glow-burgundy group flex items-center gap-2"
                >
                  <span>Explore Studio Portfolio</span>
                  <ArrowRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  href="/portfolio/edit"
                  className="btn-secondary text-xs py-3.5 px-6 group flex items-center gap-2 border border-[#1E3A8A]"
                >
                  <span>Create Your Portfolio</span>
                  <Sparkles className="w-4 h-4 text-[#38BDF8] group-hover:rotate-12 transition-transform duration-200" />
                </Link>
              </Magnetic>

              {user ? (
                <Magnetic>
                  <Link
                    href="/dashboard"
                    className="btn-secondary text-xs py-3.5 px-5 group flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-[#38BDF8]" />
                    <span>Command Center</span>
                  </Link>
                </Magnetic>
              ) : (
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => openSqueeze('register')}
                    className="btn-secondary text-xs py-3.5 px-5 group cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    <span>Client Access</span>
                  </button>
                </Magnetic>
              )}
            </motion.div>

            {/* Telemetry Metric Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#172554] w-full max-w-lg font-mono"
            >
              <div className="group cursor-default">
                <div className="text-xl sm:text-3xl font-black text-[#38BDF8] tabular-nums group-hover:text-[#F8FAFC] transition-colors">
                  200+
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">
                  [ BROADCASTS ]
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-xl sm:text-3xl font-black text-[#38BDF8] tabular-nums group-hover:text-[#F8FAFC] transition-colors">
                  40+
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">
                  [ ARENA STAGES ]
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-xl sm:text-3xl font-black text-[#38BDF8] tabular-nums group-hover:text-[#F8FAFC] transition-colors">
                  8yr
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">
                  [ CRAFT V2.6 ]
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Chrome Sculpture & Interactive Studio Terminal */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* 3D Chrome Metallic Sculpture Layer - KaultAI central sweep */}
            <div className="absolute -left-12 sm:-left-28 -top-16 w-[480px] sm:w-[560px] lg:w-[620px] aspect-square pointer-events-none z-0">
              <KaultChromeVisual />
            </div>

            {/* Foreground Floating Interactive Studio Card */}
            <div className="relative z-10 w-full max-w-md pt-6 sm:pt-0">
              <StudioWorkflowCard />
            </div>

            {/* Floating Kinetic Badges (Around the card) */}
            <motion.div
              style={{ y: badgeY1 }}
              className="hidden xl:flex absolute -left-10 bottom-8 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070D1E]/95 border border-[#1E3A8A] shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-default pointer-events-auto hover:scale-105 transition-transform"
            >
              <Trophy className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[10px] font-mono font-bold text-[#F8FAFC]">40+ TOURNAMENT STAGES</span>
            </motion.div>

            <motion.div
              style={{ y: badgeY2 }}
              className="hidden xl:flex absolute -right-6 top-16 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070D1E]/95 border border-[#1E3A8A] shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-default pointer-events-auto hover:scale-105 transition-transform"
            >
              <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[10px] font-mono font-bold text-[#F8FAFC]">4K 60FPS RT-HUD</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 pb-6 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#94A3B8]">
          [ SCROLL INTO THE STORY ]
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#38BDF8]" />
        </motion.div>
      </div>
    </section>
  );
}
