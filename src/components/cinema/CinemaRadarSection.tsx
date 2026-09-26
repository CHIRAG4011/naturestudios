'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Sparkles, Star, Film, ArrowUpRight, Shield, Award } from 'lucide-react';

interface CinemaRadarSectionProps {
  onOpenTrailer: () => void;
  onBookNow: () => void;
}

export function CinemaRadarSection({ onOpenTrailer, onBookNow }: CinemaRadarSectionProps) {
  return (
    <section
      id="radar"
      className="relative w-full min-h-[90vh] bg-[#030712] text-[#F8FAFC] py-20 px-6 sm:px-12 flex flex-col justify-between overflow-hidden border-b border-[#172554] select-none"
    >
      {/* Top Section Identifier */}
      <div className="relative z-20 flex items-center justify-between font-mono text-xs text-[#94A3B8] uppercase tracking-widest pb-8">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#38BDF8]" />
          <span>RADAR SPECIFICATIONS // BOX OFFICE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#38BDF8]">IMAX DUAL LASER</span>
          <span>•</span>
          <span>12-CHANNEL SOUND</span>
        </div>
      </div>

      {/* Main Central Stage */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 my-auto">
        {/* Left Info: Production & Rating */}
        <div className="w-full lg:w-1/4 space-y-8 text-left">
          {/* Production Badge */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
                PRODUCTION
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-1">
              <div className="font-black text-xl tracking-wider text-[#F8FAFC] uppercase font-syne">
                MARVEL STUDIOS
              </div>
              <div className="text-xs font-mono text-[#38BDF8]">
                CO-PRODUCED WITH NATURE STUDIOS
              </div>
            </div>
          </div>

          {/* Critical Rating 02 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-black text-[#F8FAFC]">02</span>
              <div className="flex items-center gap-1 text-[#38BDF8]">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#38BDF8]" />
                ))}
                <Star className="w-4 h-4 text-[#172554]" />
              </div>
            </div>
            <p className="text-xs font-mono text-[#94A3B8]">
              98% Theatrical Score • 100M+ Global Trailer Views in 24 Hours
            </p>
          </div>
        </div>

        {/* Center: The Massive Concentric Radar Dial with Orbiting Widgets */}
        <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[560px] lg:h-[560px] flex items-center justify-center my-6">
          {/* Outer Rotating Radar Disc */}
          <div className="absolute inset-0 rounded-full border border-[#2563EB]/40 flex items-center justify-center">
            {/* Dashed Tracking Circle */}
            <div className="absolute inset-6 rounded-full border-2 border-dashed border-[#172554] animate-spin-slow" />
            
            {/* Inner Ring */}
            <div className="w-[68%] h-[68%] rounded-full border border-[#38BDF8]/30 bg-radial from-[#1E40AF]/20 via-[#0B132B]/60 to-transparent backdrop-blur-sm" />
          </div>

          {/* Three Orbital Floating Buttons (Trailer, IMAX, May 3) */}
          <div className="relative z-20 flex items-center justify-center gap-3 sm:gap-5">
            {/* 1. TRAILER 1:47" Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTrailer}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#F8FAFC] text-[#030712] font-mono flex flex-col items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.5)] border-2 border-[#38BDF8] cursor-pointer group"
              title="Click to play trailer"
            >
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase group-hover:text-[#2563EB] transition-colors">
                TRAILER
              </span>
              <span className="text-sm sm:text-base font-black tracking-tighter">
                1:47&quot;
              </span>
              <Play className="w-3.5 h-3.5 mt-0.5 fill-current text-[#2563EB]" />
            </motion.button>

            {/* 2. IMAX 6 Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookNow}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-[#F8FAFC] font-mono flex flex-col items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] border-2 border-[#38BDF8]/60 cursor-pointer"
              title="Select auditorium"
            >
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase">
                IMAX
              </span>
              <span className="text-xl sm:text-2xl font-black">
                6
              </span>
            </motion.button>

            {/* 3. MAY 3 Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookNow}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#070D1E] text-[#F8FAFC] font-mono flex flex-col items-center justify-center border-2 border-[#1E3A8A] shadow-[0_0_30px_rgba(30,58,138,0.5)] hover:border-[#38BDF8] cursor-pointer"
              title="Reserve premiere tickets"
            >
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#94A3B8] uppercase">
                MAY
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#38BDF8]">
                3
              </span>
            </motion.button>
          </div>
        </div>

        {/* Right Info: Editorial Quote Card */}
        <div className="w-full lg:w-1/4 space-y-4 text-left">
          <div className="relative p-6 rounded-2xl bg-[#070D1E] border border-[#172554] shadow-xl group hover:border-[#38BDF8]/50 transition-colors">
            {/* Electric Blue Left Accent Bar */}
            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-[#2563EB] shadow-[0_0_15px_#2563EB]" />

            <div className="pl-3 space-y-3">
              <p className="text-xs sm:text-sm font-mono uppercase font-bold text-[#F8FAFC] leading-relaxed tracking-wider">
                &ldquo;HUGH JACKMAN SAID HE REALLY WAS DONE PLAYING THE CHARACTER OF LOGAN / WOLVERINE AFTER 2017&rsquo;S &lsquo;LOGAN&rsquo;.&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#172554]/50">
                <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-widest">
                  EXCLUSIVE INTERVIEW
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center Peek: Character Mask & Katana Peeking from Section Boundary */}
      <div className="relative z-10 flex items-center justify-center -mb-20 pointer-events-none">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56">
          <Image
            src="/media/cinema/deadpool-41.png"
            alt="Deadpool Transition Peek"
            fill
            className="object-contain object-top drop-shadow-[0_-20px_40px_rgba(37,99,235,0.3)]"
          />
        </div>
      </div>
    </section>
  );
}
