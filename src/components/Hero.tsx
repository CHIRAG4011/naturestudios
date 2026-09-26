'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, ChevronDown, Trophy, Activity, Zap, Flame, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Crency-Grade Cinematic Hero for NatureStudios
 * Featuring interactive floating kinetic badges, multi-layer depth,
 * 3D perspective transformation, and ZERO scroll dead-zones.
 */
export function Hero() {
  const { user, openSqueeze } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth transforms — continuous without dropping to zero opacity
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Headline scales and moves gracefully upward
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

  // Floating stickers / badges parallax reaction
  const badgeY1 = useTransform(scrollYProgress, [0, 1], ['0px', '-90px']);
  const badgeRotate1 = useTransform(scrollYProgress, [0, 1], [-4, 6]);

  const badgeY2 = useTransform(scrollYProgress, [0, 1], ['0px', '-120px']);
  const badgeRotate2 = useTransform(scrollYProgress, [0, 1], [3, -5]);

  const badgeY3 = useTransform(scrollYProgress, [0, 1], ['0px', '-70px']);
  const badgeRotate3 = useTransform(scrollYProgress, [0, 1], [-2, 8]);

  const badgeY4 = useTransform(scrollYProgress, [0, 1], ['0px', '-100px']);
  const badgeRotate4 = useTransform(scrollYProgress, [0, 1], [4, -4]);

  // Light beam and fog
  const lightOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.65, 0.4]);
  const lightScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#030712] text-[#F8FAFC] flex flex-col justify-between"
      aria-label="Cinematic Hero"
    >
      {/* Background Ambient Atmosphere */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#050B17] via-[#0B132B] to-[#030712]"
        style={{ scale: bgScale, y: bgY }}
      >
        {/* Deep Burgundy Ambient Core */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-radial from-[#2563EB]/60 via-[#1E40AF]/30 to-transparent blur-[120px] pointer-events-none" />

        {/* Warm Beige Atmospheric Sweep */}
        <motion.div
          className="absolute -top-32 right-12 w-[700px] h-[700px] rounded-full bg-radial from-[#38BDF8]/20 via-[#60A5FA]/10 to-transparent blur-[130px] pointer-events-none"
          style={{ opacity: lightOpacity, scale: lightScale }}
        />

        {/* Subtle Green and Orange DNA Highlights */}
        <div className="absolute bottom-16 left-12 w-[450px] h-[450px] rounded-full bg-radial from-[#18A957]/10 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-radial from-[#FF6B1A]/10 to-transparent blur-[100px] pointer-events-none" />

        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 hud-grid opacity-35 pointer-events-none" />
      </motion.div>

      {/* Top HUD Status Bar */}
      <div className="relative z-10 pt-28 px-6 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-[#94A3B8] pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="badge-live">LIVE TRANSMISSION</span>
          <span className="text-[#38BDF8] tracking-widest hidden sm:inline">ARENA PROTOCOL // 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#38BDF8] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#18A957]" /> ENGINE: ACTIVE
          </span>
          <span className="hidden md:inline text-[#94A3B8]">DOM: NATURESTUDIO.IN</span>
        </div>
      </div>

      {/* Main Hero Stage */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-center flex flex-col items-center flex-1 justify-center">
        {/* Floating Kinetic Badges (Crency-style interactive stickers) */}
        {/* Badge 1: Top Left */}
        <motion.div
          style={{ y: badgeY1, rotate: badgeRotate1 }}
          className="hidden lg:flex absolute left-4 top-36 z-20 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0E1A33]/90 border border-[#2563EB] shadow-glow-burgundy backdrop-blur-md cursor-default pointer-events-auto hover:scale-105 transition-transform"
        >
          <span className="h-2 w-2 rounded-full bg-[#18A957] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#38BDF8]">200+ BROADCASTS</span>
          <span className="text-[10px] text-[#94A3B8] font-mono">GLOBAL ARENA</span>
        </motion.div>

        {/* Badge 2: Top Right */}
        <motion.div
          style={{ y: badgeY2, rotate: badgeRotate2 }}
          className="hidden lg:flex absolute right-6 top-32 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0F1D38]/90 border border-[#38BDF8]/30 shadow-glow-beige backdrop-blur-md cursor-default pointer-events-auto hover:scale-105 transition-transform"
        >
          <Zap className="w-4 h-4 text-[#FF6B1A]" />
          <span className="text-xs font-mono font-bold text-[#F8FAFC]">4K 60FPS</span>
          <span className="text-[10px] text-[#38BDF8] font-mono bg-[#2563EB] px-1.5 py-0.5 rounded">RT-HUD</span>
        </motion.div>

        {/* Badge 3: Mid Left */}
        <motion.div
          style={{ y: badgeY3, rotate: badgeRotate3 }}
          className="hidden xl:flex absolute -left-12 bottom-36 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0B132B]/90 border border-[#1E3A8A] shadow-card backdrop-blur-md cursor-default pointer-events-auto hover:scale-105 transition-transform"
        >
          <Trophy className="w-4 h-4 text-[#38BDF8]" />
          <div className="text-left">
            <div className="text-xs font-mono font-bold text-[#F8FAFC]">40+ TOURNAMENT STAGES</div>
            <div className="text-[10px] text-[#94A3B8] font-mono">WORLDWIDE EXPEDITIONS</div>
          </div>
        </motion.div>

        {/* Badge 4: Mid Right */}
        <motion.div
          style={{ y: badgeY4, rotate: badgeRotate4 }}
          className="hidden xl:flex absolute -right-10 bottom-40 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0B132B]/90 border border-[#1E3A8A] shadow-card backdrop-blur-md cursor-default pointer-events-auto hover:scale-105 transition-transform"
        >
          <Shield className="w-4 h-4 text-[#18A957]" />
          <div className="text-left">
            <div className="text-xs font-mono font-bold text-[#38BDF8]">99.99% UPTIME</div>
            <div className="text-[10px] text-[#94A3B8] font-mono">STADIUM REDUNDANCY</div>
          </div>
        </motion.div>

        {/* Central Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F1D38]/80 border border-[#1E3A8A] shadow-glow-burgundy backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#38BDF8] uppercase font-bold">
            ESPORTS • CREATIVE • DIGITAL
          </span>
        </motion.div>

        {/* Large Typography (No dead-zone fading) */}
        <motion.div
          style={{ scale: headlineScale, y: headlineY }}
          className="w-full flex flex-col items-center"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-[-0.04em] leading-[0.88] mb-8 text-[#F8FAFC]">
            <span className="sr-only">Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology. </span>
            THE DIGITAL <br />
            <span className="text-gradient-warm">WILD.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-xl text-[#7DD3FC] leading-relaxed font-light mb-10">
            Nature moves. We create. An elite studio engineering arena stages, cinematic tournament broadcasts, and bespoke digital portfolio realms.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/portfolio" className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy">
              <span>Explore Studio Portfolio</span>
              <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>

            <Link href="/portfolio/edit" className="btn-beige text-xs py-3 px-6 shadow-glow-beige">
              <span>Create Your Portfolio</span>
              <Sparkles className="w-4 h-4 text-[#1E40AF]" />
            </Link>

            {user ? (
              <Link href="/dashboard" className="btn-secondary text-xs py-3 px-6">
                <Shield className="w-4 h-4 text-[#38BDF8]" />
                <span>Command Center</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openSqueeze('register')}
                className="btn-secondary text-xs py-3 px-6"
              >
                <span>Client Access</span>
              </button>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-8 pt-8 mt-10 border-t border-[#172554] w-full max-w-xl font-mono">
            <div>
              <div className="text-2xl sm:text-4xl font-black text-[#38BDF8] tabular-nums">200+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">Live Broadcasts</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-[#38BDF8] tabular-nums">40+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">Global Arenas</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-[#38BDF8] tabular-nums">8yr</div>
              <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">Studio Craft</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 pb-6 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#94A3B8]">Scroll Into The Story</span>
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
