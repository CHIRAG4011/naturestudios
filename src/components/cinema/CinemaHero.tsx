'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, User, Menu, ArrowUpRight, Sparkles, Film, ChevronRight } from 'lucide-react';

interface CinemaHeroProps {
  onBookNow: () => void;
  onOpenTrailer: () => void;
}

export function CinemaHero({ onBookNow, onOpenTrailer }: CinemaHeroProps) {
  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const charRotateY = useTransform(smoothX, [-300, 300], [-8, 8]);
  const charRotateX = useTransform(smoothY, [-300, 300], [6, -6]);
  const charTranslateX = useTransform(smoothX, [-300, 300], [-15, 15]);
  const bgRadarRotate = useTransform(smoothX, [-300, 300], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[95vh] lg:min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col justify-between overflow-hidden border-b border-[#172554] select-none"
    >
      {/* ─── CINEMA TOP HEADER ────────────────────────────────────────── */}
      <header className="relative z-30 flex items-center justify-between px-6 sm:px-12 pt-6 pb-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black font-syne text-xl sm:text-2xl tracking-tighter uppercase text-[#F8FAFC]">
            <span>CINE</span>
            <span className="text-[#38BDF8] text-2xl font-normal">✦</span>
            <span>DAILY</span>
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-widest text-[#38BDF8] bg-[#0B132B] border border-[#172554]">
            STUDIO 2026
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
          <a href="#casts" className="hover:text-[#38BDF8] transition-colors">
            TOP CASTS
          </a>
          <span className="text-[#172554]">•</span>
          <a href="#production" className="hover:text-[#38BDF8] transition-colors">
            PRODUCTION
          </a>
          <span className="text-[#172554]">•</span>
          <a href="#radar" className="hover:text-[#38BDF8] transition-colors">
            BOX OFFICE
          </a>
          <span className="text-[#172554]">•</span>
          <a href="#booking" className="hover:text-[#38BDF8] transition-colors text-[#38BDF8]">
            IMAX 6
          </a>
        </nav>

        {/* Right Utility Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTrailer}
            className="w-10 h-10 rounded-full border border-[#172554] bg-[#070D1E] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#38BDF8] flex items-center justify-center transition-all cursor-pointer"
            title="Search / Preview"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={onBookNow}
            className="w-10 h-10 rounded-full border border-[#172554] bg-[#070D1E] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#38BDF8] flex items-center justify-center transition-all cursor-pointer"
            title="User Profile / Tickets"
          >
            <User className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full border border-[#1E3A8A] bg-[#0B132B] text-[#F8FAFC] flex items-center justify-center cursor-pointer hover:border-[#38BDF8] transition-all">
            <Menu className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* ─── METADATA BAR (GENRE PILLS & RELEASE DATE) ───────────────── */}
      <div className="relative z-20 flex items-center justify-between px-6 sm:px-12 pt-2 text-xs font-mono">
        {/* Genre Tags */}
        <div className="flex items-center gap-2">
          {['ACTION', 'COMEDY', 'SCI-FI'].map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border border-[#172554] bg-[#070D1E]/80 text-[#94A3B8] hover:text-[#38BDF8] hover:border-[#2563EB] transition-colors"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Release Date */}
        <div className="hidden sm:flex items-center gap-2 text-[#94A3B8] tracking-widest uppercase">
          <span>RELEASE</span>
          <span className="text-[#38BDF8] font-bold">[MAY 3, 2026]</span>
        </div>
      </div>

      {/* ─── CAST CREDITS ROW (ABOVE TITLE) ─────────────────────────── */}
      <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 sm:px-12 pt-6 text-center font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#94A3B8]">
        <div className="hover:text-[#38BDF8] transition-colors">RYAN REYNOLDS</div>
        <div className="hover:text-[#38BDF8] transition-colors">KARAN SONI</div>
        <div className="hover:text-[#38BDF8] transition-colors">EMMA CORRIN</div>
        <div className="hover:text-[#38BDF8] transition-colors">HUGH JACKMAN</div>
      </div>

      {/* ─── CENTER HERO STAGE: MASSIVE TITLE + RADAR + 3D CHARACTER ─ */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto min-h-[440px] sm:min-h-[540px] lg:min-h-[600px]">
        {/* Roman Numeral III on Top */}
        <div className="absolute top-2 sm:top-6 left-1/2 -translate-x-1/2 z-20 font-black font-syne text-4xl sm:text-6xl text-[#38BDF8] tracking-widest drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
          III
        </div>

        {/* Massive Background Kinetic Title "DEADPOOL [2024]" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="flex items-center justify-center w-full">
            <h1 className="font-black tracking-tighter text-[19vw] sm:text-[17vw] leading-none uppercase text-[#F8FAFC] text-center opacity-95 scale-y-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              DEADPOOL
            </h1>
            <div className="hidden lg:flex flex-col items-center justify-center font-mono text-sm tracking-widest text-[#94A3B8] ml-2 self-center rotate-90">
              <span className="border-t border-b border-[#2563EB] py-1 text-[#38BDF8] font-bold">
                [2026]
              </span>
            </div>
          </div>
        </div>

        {/* Concentric Circular Radar Target Dial (Electric Blue & Cyan Theme) */}
        <motion.div
          style={{ rotate: bgRadarRotate }}
          className="absolute z-10 w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] lg:w-[640px] lg:h-[640px] rounded-full border border-[#2563EB]/40 flex items-center justify-center pointer-events-none"
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-[#38BDF8]/20 animate-spin-slow" />
          
          {/* Inner Glowing Ring */}
          <div className="w-[75%] h-[75%] rounded-full border border-dashed border-[#2563EB]/40 flex items-center justify-center">
            {/* Core Radar Disc */}
            <div className="w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#1E40AF]/40 via-[#2563EB]/20 to-transparent border border-[#38BDF8]/50 shadow-[0_0_80px_rgba(37,99,235,0.4)]" />
          </div>

          {/* Crosshairs & Compass Ticks */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#38BDF8]/40 to-transparent" />
          
          {/* Degree Markers */}
          <span className="absolute top-3 font-mono text-[9px] text-[#38BDF8]/60">000°</span>
          <span className="absolute right-3 font-mono text-[9px] text-[#38BDF8]/60">090°</span>
          <span className="absolute bottom-3 font-mono text-[9px] text-[#38BDF8]/60">180°</span>
          <span className="absolute left-3 font-mono text-[9px] text-[#38BDF8]/60">270°</span>
        </motion.div>

        {/* 3D Centered Character Cutout (Deadpool with Arms Crossed) */}
        <motion.div
          style={{
            rotateY: charRotateY,
            rotateX: charRotateX,
            x: charTranslateX,
            perspective: 1200,
          }}
          className="relative z-20 w-[320px] h-[440px] sm:w-[480px] sm:h-[600px] lg:w-[560px] lg:h-[680px] flex items-end justify-center pointer-events-auto cursor-pointer"
          onClick={onOpenTrailer}
          title="Click to play IMAX trailer"
        >
          <div className="relative w-full h-full flex items-end justify-center">
            {/* High-res character cutout */}
            <Image
              src="/media/cinema/deadpool-73.png"
              alt="Deadpool 3D Hero Cutout"
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </motion.div>
      </div>

      {/* ─── CINEMA REPEATER ICON BAND (ACROSS LOWER DIVIDER) ─────────── */}
      <div className="relative z-10 w-full py-2 bg-[#070D1E]/60 border-y border-[#172554]/50 overflow-hidden flex items-center">
        <div className="flex items-center gap-8 whitespace-nowrap animate-ticker font-mono text-xs text-[#38BDF8]/70 tracking-widest uppercase">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <span>✦</span>
              <span>DEADPOOL & WOLVERINE</span>
              <span className="text-[#94A3B8]">IMAX 3D</span>
              <span>CINEMATIC UNIVERSE</span>
              <span className="text-[#2563EB]">NATURE STUDIOS</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BOTTOM STAGE CONTROLS & STORY BOX ───────────────────────── */}
      <div className="relative z-20 px-6 sm:px-12 py-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        {/* Left: Deadpool III Story Box */}
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] font-bold">
              DEADPOOL III STORY
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
            <span className="text-[#F8FAFC] font-bold">PART A . </span>
            Wolverine joins the &quot;merc with a mouth&quot; in the third installment of the blockbuster Deadpool franchise, facing existential threats across the timeline.
          </p>
          <button
            onClick={onOpenTrailer}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] hover:text-[#F8FAFC] transition-colors cursor-pointer pt-1"
          >
            <span>Watch IMAX Teaser (1:47&quot;)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Book Now CTA & Rotating Stamp Badge */}
        <div className="flex items-center gap-4 self-end">
          <button
            onClick={onBookNow}
            className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#F8FAFC] text-[#030712] font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:bg-[#38BDF8] hover:text-[#030712] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>BOOK NOW</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Rotating Cinema Stamp Badge */}
          <div
            onClick={onBookNow}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#2563EB] bg-[#070D1E] flex items-center justify-center p-1 text-center cursor-pointer hover:border-[#38BDF8] transition-colors shadow-lg"
            title="Official Cinema Seal"
          >
            <div className="w-full h-full rounded-full bg-[#0B132B] flex flex-col items-center justify-center font-mono leading-tight">
              <span className="text-[10px] text-[#38BDF8] font-black">03</span>
              <span className="text-[8px] text-[#94A3B8] tracking-tighter uppercase font-bold">DEAG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
