'use client';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Compass,
  Flame,
  Shield,
  Activity,
  Eye,
  Zap,
  Radio,
  Trophy,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Tilt3DCard } from '@/components/motion/Tilt3DCard';
import { Magnetic } from '@/components/motion/Magnetic';

const CHAPTERS = [
  {
    num: '01',
    label: 'NATURE',
    headline: 'WE CREATE THE NEXT LEVEL OF ESPORTS.',
    desc: 'The untamed instinct of competition meets the precision of architectural design. Organic motion meets stadium engineering.',
    image: '/media/hero-lightfield.jpg',
    tag: 'BIOLOGICAL INSTINCT',
    badgeA: 'ORGANIC MOTION // 2026',
    badgeB: 'NATURE DNA',
    icon: Compass,
    accent: '#38BDF8',
    glow: '#2563EB',
  },
  {
    num: '02',
    label: 'INSTINCT',
    headline: 'IDEAS START WITH INSTINCT.',
    desc: 'Every arena stage, every match broadcast begins with an unyielding impulse to disrupt. Zero latency between feeling and form.',
    image: '/media/studio-plate.jpg',
    tag: 'UNFILTERED PULSE',
    badgeA: 'ZERO-LATENCY INSTINCT',
    badgeB: 'DIRECTOR CUT',
    icon: Eye,
    accent: '#F8FAFC',
    glow: '#1E40AF',
  },
  {
    num: '03',
    label: 'ENERGY',
    headline: 'CREATIVE ENERGY MOVES EVERYTHING.',
    desc: 'Light, sound, and realtime motion sync together to pulse through thousands of screaming fans in sold-out stadium arenas.',
    image: '/media/work-nexus-arena.jpg',
    tag: '50,000+ FANS',
    badgeA: 'STADIUM SOUNDSYNC',
    badgeB: 'REALTIME EMBERS',
    icon: Flame,
    accent: '#FF6B1A',
    glow: '#2563EB',
  },
  {
    num: '04',
    label: 'COMPETITION',
    headline: 'BUILT FOR THE MOMENT.',
    desc: 'Under the glare of stadium spotlights, every pixel must perform without hesitation. Championship stakes require flawless delivery.',
    image: '/media/work-valorant-championship.jpg',
    tag: 'VALORANT MASTERS',
    badgeA: '4K 60FPS BROADCAST',
    badgeB: 'LIVE HUD ENGINE',
    icon: Shield,
    accent: '#E63946',
    glow: '#2563EB',
  },
  {
    num: '05',
    label: 'CREATION',
    headline: 'DESIGNED TO MOVE.',
    desc: 'Dynamic broadcast packages, virtual sets, and physical stadium rigs crafted to elevate global esports tournaments into legend.',
    image: '/media/work-level-up.jpg',
    tag: 'UNREAL ENGINE 5',
    badgeA: 'DYNAMIC CAMERA RIGS',
    badgeB: 'SPATIAL ASSETS',
    icon: Activity,
    accent: '#38BDF8',
    glow: '#1E40AF',
  },
  {
    num: '06',
    label: 'CULTURE',
    headline: 'WE BUILD CULTURE, NOT JUST CONTENT.',
    desc: 'Communities rally around stories that matter. We engineer experiences that become permanent folklore in gaming history.',
    image: '/media/work-after-dark.jpg',
    tag: 'COMMUNITY LEGACY',
    badgeA: 'ESPORTS FOLKLORE',
    badgeB: 'GLOBAL FANDOM',
    icon: Sparkles,
    accent: '#F8FAFC',
    glow: '#2563EB',
  },
  {
    num: '07',
    label: 'IMPACT',
    headline: 'MAKE SOMETHING PEOPLE REMEMBER.',
    desc: 'Lasting legacies are forged in the arena. We design the visuals, stages, and identity systems that define champions forever.',
    image: '/media/cta-field.jpg',
    tag: 'HALL OF FAME',
    badgeA: 'CHAMPIONSHIP IMPACT',
    badgeB: 'STADIUM IMMORTALITY',
    icon: Zap,
    accent: '#38BDF8',
    glow: '#FF6B1A',
  },
  {
    num: '08',
    label: 'TRANSMISSION',
    headline: 'READY TO PLAY BIGGER?',
    desc: 'Partner with NatureStudios on your next stadium broadcast or publish your creator portfolio directly to our worldwide network.',
    image: '/media/hero-lightfield-portrait.jpg',
    tag: 'CLIENT & CREATOR PORTAL',
    badgeA: 'START A PROJECT',
    badgeB: 'CREATOR SUBDOMAINS',
    icon: Radio,
    accent: '#38BDF8',
    glow: '#2563EB',
    isCta: true,
  },
];

/**
 * Crency-Style Pinned Scroll Storytelling Scene
 * Features rich visual media cards, floating kinetic badges,
 * horizontal kinetic background typography, and continuous zero-dead-zone crossfades.
 */
export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track active chapter continuously (0 to 7) without dead zones
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(Math.floor(v * CHAPTERS.length), CHAPTERS.length - 1);
      setActiveIndex(Math.max(0, idx));
    });
  }, [scrollYProgress]);

  // Horizontal kinetic typography drift across the background
  const bgTextX = useTransform(scrollYProgress, [0, 1], ['5%', '-45%']);

  const currentChapter = CHAPTERS[activeIndex];

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative h-[360vh] bg-[#030712] text-[#F8FAFC]"
      aria-label="Storytelling Journey"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-12 select-none">
        {/* Deep Onyx & Electric Blue Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B132B] to-[#030712] pointer-events-none" />

        {/* Ambient Pulsing Back-Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-60"
          style={{ background: currentChapter.glow }}
        />

        {/* HUD Grid */}
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />

        {/* Giant Kinetic Background Typography */}
        <motion.div
          style={{ x: bgTextX }}
          className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap text-[18vw] font-black uppercase text-[#0E1A33]/40 pointer-events-none tracking-tighter leading-none z-0"
        >
          NATURE • INSTINCT • ENERGY • COMPETITION • CREATION • CULTURE • IMPACT • ARENA
        </motion.div>

        {/* Top Header Information */}
        <div className="absolute top-24 left-6 right-6 lg:left-12 lg:right-12 z-20 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[#38BDF8] font-bold tracking-widest uppercase">
              CHAPTER {currentChapter.num} {'//'} {currentChapter.label}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#94A3B8]">
            <span>NATURESTUDIOS MANIFESTO</span>
            <span>•</span>
            <span className="text-[#38BDF8]">ACT {activeIndex + 1} OF 8</span>
          </div>
        </div>

        {/* Left Side: Chapter Navigation Bar (Desktop) */}
        <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
          {CHAPTERS.map((ch, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={ch.num}
                type="button"
                onClick={() => {
                  if (containerRef.current) {
                    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
                    const targetScroll = containerRef.current.offsetTop + (idx / CHAPTERS.length) * totalHeight;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-3 text-left transition-all duration-300 font-mono text-xs cursor-pointer ${
                  isActive
                    ? 'text-[#38BDF8] translate-x-2'
                    : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                <span
                  className={`w-6 text-center font-bold ${
                    isActive ? 'text-[#38BDF8]' : 'text-[#475569]'
                  }`}
                >
                  {ch.num}
                </span>
                <span className={`tracking-widest uppercase text-[11px] ${isActive ? 'font-bold' : ''}`}>
                  {ch.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Center: Main 3D Showcase Card Stage */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.num}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full"
            >
              <Tilt3DCard maxTilt={3.5} glareOpacity={0.12} className="w-full rounded-3xl">
                <div className="relative w-full rounded-3xl border border-[#1E3A8A] bg-[#070D1E]/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 lg:p-10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Card Ambient Glow Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-transparent" />

                  {/* Floating Kinetic Badges (Crency Style on Card) */}
                  <motion.div
                    animate={{ y: [-3, 3, -3], rotate: [-1, 1, -1] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="hidden sm:inline-flex absolute top-4 right-6 z-20 items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#2563EB] text-[11px] font-mono text-[#38BDF8] shadow-card"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18A957]" />
                    <span>{currentChapter.badgeA}</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [3, -3, 3], rotate: [1, -1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="hidden sm:inline-flex absolute bottom-4 left-6 z-20 items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#2563EB] text-[11px] font-mono text-[#F8FAFC] shadow-card"
                  >
                    <Sparkles className="w-3 h-3 text-[#FF6B1A]" />
                    <span>{currentChapter.badgeB}</span>
                  </motion.div>

                  {/* Left Column: Rich Typography & Storytelling */}
                  <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] w-fit">
                      {React.createElement(currentChapter.icon, { className: 'w-3.5 h-3.5 text-[#38BDF8]' })}
                      <span>{currentChapter.tag}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#F8FAFC] leading-[1.05]">
                      {currentChapter.headline}
                    </h3>

                    <p className="text-sm sm:text-base text-[#BAE6FD] leading-relaxed font-light max-w-lg">
                      {currentChapter.desc}
                    </p>

                    {currentChapter.isCta ? (
                      <div className="pt-3 flex flex-wrap items-center gap-3">
                        <Magnetic>
                          <Link href="/work" className="btn-primary text-xs py-2.5 px-5 group flex items-center gap-1.5">
                            <span>Explore Works</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Magnetic>
                        <Magnetic>
                          <Link href="/portfolio" className="btn-beige text-xs py-2.5 px-5 group flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-[#1E40AF] group-hover:rotate-12 transition-transform" />
                            <span>Build Portfolio</span>
                          </Link>
                        </Magnetic>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#38BDF8]">
                        <span className="flex items-center gap-1.5">
                          <ChevronRight className="w-4 h-4 text-[#38BDF8]" /> SCROLL FOR NEXT CHAPTER
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: High-Resolution Visual Artwork Frame */}
                  <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-80 w-full rounded-2xl overflow-hidden border border-[#2563EB] shadow-2xl group">
                    <Image
                      src={currentChapter.image}
                      alt={currentChapter.headline}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={activeIndex < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-[#38BDF8] px-3 py-1.5 rounded-lg bg-[#0B132B]/90 backdrop-blur-md border border-[#1E3A8A]">
                      <span className="uppercase">ASSET: NS-{currentChapter.num}</span>
                      <span className="text-[#F8FAFC]">ENGINE: 4K 60P</span>
                    </div>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Status & Progress Bar */}
        <div className="absolute bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span className="text-[#38BDF8] font-bold">0{activeIndex + 1} / 08</span>
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-[#172554] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#E63946] to-[#38BDF8]"
                style={{ width: `${((activeIndex + 1) / CHAPTERS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-[#94A3B8] tracking-widest uppercase hidden md:inline">
            SCROLL TO ADVANCE NARRATIVE {'//'} NATURESTUDIOS
          </div>
        </div>
      </div>
    </section>
  );
}
