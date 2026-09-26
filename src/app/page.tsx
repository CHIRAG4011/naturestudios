'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { CinemaLandingPage } from '@/components/cinema/CinemaLandingPage';
import { Hero } from '@/components/Hero';
import { IntroStatement } from '@/components/IntroStatement';
import { TrustedClients } from '@/components/TrustedClients';
import { ScrollStory } from '@/components/ScrollStory';
import { Services } from '@/components/Services';
import { Work } from '@/components/Work';
import { Studio } from '@/components/Studio';
import { Process } from '@/components/Process';
import { Stats } from '@/components/Stats';
import { Testimonial } from '@/components/Testimonial';
import { Ticker } from '@/components/Ticker';
import { FAQ } from '@/components/FAQ';
import { CallToAction } from '@/components/CallToAction';
import { Footer } from '@/components/Footer';
import { Film, Sparkles, Layers, Tv } from 'lucide-react';

export default function HomePage() {
  const [activeExperience, setActiveExperience] = useState<'CINEMA' | 'STUDIO'>('CINEMA');

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC]">
      {/* ─── FLOATING TOP MODE SWITCHER BAR ───────────────────────────── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#070D1E]/90 border border-[#1E3A8A] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
          <button
            onClick={() => setActiveExperience('CINEMA')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeExperience === 'CINEMA'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-[#F8FAFC] shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Cinema Premiere</span>
          </button>

          <button
            onClick={() => setActiveExperience('STUDIO')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeExperience === 'STUDIO'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-[#F8FAFC] shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Studio Network</span>
          </button>
        </div>
      </div>

      {/* ─── CONDITIONAL EXPERIENCE RENDERER ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeExperience === 'CINEMA' ? (
          <motion.div
            key="cinema-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            {/* The Complete Interactive Cinema Landing Page (Dribbble Replica) */}
            <CinemaLandingPage onToggleStudioView={() => setActiveExperience('STUDIO')} />

            {/* Seamless Flow into Studio Works & Ecosystem */}
            <div className="relative border-t border-[#172554] bg-[#030712]">
              <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center space-y-3">
                <span className="font-mono text-xs text-[#38BDF8] uppercase tracking-widest">
                  EXPLORE THE PRODUCTION NETWORK
                </span>
                <h3 className="font-black font-syne text-3xl sm:text-4xl uppercase text-[#F8FAFC]">
                  NATURE STUDIOS ECOSYSTEM
                </h3>
              </div>
              <Work />
              <Services />
              <TrustedClients />
              <FAQ />
              <CallToAction />
            </div>
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="studio-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col"
          >
            <Navbar />
            <main id="main" className="flex-1">
              <Hero />
              <Ticker />
              <IntroStatement />
              <TrustedClients />
              <ScrollStory />
              <Services />
              <Work />
              <Studio />
              <Process />
              <Stats />
              <Testimonial />
              <FAQ />
              <CallToAction />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
