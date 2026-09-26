'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, Zap } from 'lucide-react';

export function IntroStatement() {
  return (
    <section className="py-28 px-6 lg:px-12 bg-gradient-to-b from-[#030712] via-[#050B17] to-[#030712] border-b border-[#172554] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-radial from-[#2563EB]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-radial from-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Floating Kinetic Badges (Crency Style) */}
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:inline-flex absolute -left-6 top-0 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono text-[#38BDF8] shadow-card"
        >
          <Compass className="w-3.5 h-3.5 text-[#18A957]" />
          <span>BIOLOGICAL INSTINCT</span>
        </motion.div>

        <motion.div
          animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:inline-flex absolute -right-6 top-8 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono text-[#F8FAFC] shadow-card"
        >
          <Zap className="w-3.5 h-3.5 text-[#FF6B1A]" />
          <span>STADIUM PRECISION</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B132B] border border-[#1E3A8A] text-[10px] font-mono tracking-[0.25em] uppercase text-[#38BDF8] mb-6">
            <Sparkles className="w-3 h-3 text-[#38BDF8]" />
            <span>MANIFESTO // THE NEW CREATIVE ORDER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F8FAFC] leading-[1.05]">
            We bridge the raw power of biological instinct with the ruthless precision of world-class esports broadcasts.
          </h2>

          <p className="text-sm sm:text-lg text-[#7DD3FC] max-w-2xl mx-auto mt-6 font-light leading-relaxed">
            NatureStudios is an interdisciplinary creative laboratory engineering stadium visual systems, cinematic tournament broadcasts, and bespoke digital platforms for competitive champions.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5 text-[#38BDF8]">
              <ShieldCheck className="w-4 h-4 text-[#18A957]" /> 0% TEMPLATES
            </span>
            <span>•</span>
            <span>100% BESPOKE ARCHITECTURE</span>
            <span>•</span>
            <span className="text-[#F8FAFC]">UNREAL ENGINE NATIVE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
