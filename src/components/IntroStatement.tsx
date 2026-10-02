'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, Zap } from 'lucide-react';

export function IntroStatement() {
  return (
    <section className="py-28 px-6 lg:px-12 bg-gradient-to-b from-[#150304] via-[#1C0507] to-[#150304] border-b border-[#3D0D13] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-radial from-[#59171B]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-radial from-[#FED7B8]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Floating Kinetic Badges (Crency Style) */}
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:inline-flex absolute -left-6 top-0 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono text-[#FED7B8] shadow-card"
        >
          <Compass className="w-3.5 h-3.5 text-[#18A957]" />
          <span>BIOLOGICAL INSTINCT</span>
        </motion.div>

        <motion.div
          animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:inline-flex absolute -right-6 top-8 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono text-[#FFF5ED] shadow-card"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240709] border border-[#52141A] text-[10px] font-mono tracking-[0.25em] uppercase text-[#FED7B8] mb-6">
            <Sparkles className="w-3 h-3 text-[#FED7B8]" />
            <span>MANIFESTO // THE NEW CREATIVE ORDER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#FFF5ED] leading-[1.05]">
            We bridge the raw power of biological instinct with the ruthless precision of world-class esports broadcasts.
          </h2>

          <p className="text-sm sm:text-lg text-[#E8C5A5] max-w-2xl mx-auto mt-6 font-light leading-relaxed">
            NatureStudios is an interdisciplinary creative laboratory engineering stadium visual systems, cinematic tournament broadcasts, and bespoke digital platforms for competitive champions.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-[#B89B8D]">
            <span className="flex items-center gap-1.5 text-[#FED7B8]">
              <ShieldCheck className="w-4 h-4 text-[#18A957]" /> 0% TEMPLATES
            </span>
            <span>•</span>
            <span>100% BESPOKE ARCHITECTURE</span>
            <span>•</span>
            <span className="text-[#FFF5ED]">UNREAL ENGINE NATIVE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
