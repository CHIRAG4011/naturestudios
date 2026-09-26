'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, ArrowLeft, Ticket, Film, Sparkles, Check } from 'lucide-react';

interface CinemaStoryBookingProps {
  onBookNow: () => void;
  onOpenTrailer: () => void;
}

export function CinemaStoryBooking({ onBookNow, onOpenTrailer }: CinemaStoryBookingProps) {
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { num: '01', label: 'PREMIERE' },
    { num: '02', label: 'CASTING' },
    { num: '03', label: 'TIMELINE' },
    { num: '04', label: 'TICKETING' },
  ];

  return (
    <section
      id="booking"
      className="relative w-full min-h-screen bg-[#030712] text-[#F8FAFC] py-24 px-6 sm:px-12 flex flex-col justify-between overflow-hidden border-b border-[#172554] select-none"
    >
      {/* ─── TOP HEADER WITH GALLERY & TAB STEPS ─────────────────────── */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[#94A3B8] pb-6 border-b border-[#172554]/60">
        <div className="flex items-center gap-3">
          <Film className="w-4 h-4 text-[#38BDF8]" />
          <span className="uppercase tracking-widest text-[#38BDF8]">
            GALLERY ARCHIVE 07 / 32
          </span>
        </div>

        {/* Milestone Steps (01, 02, 03, 04) */}
        <div className="flex items-center gap-8">
          {TABS.map((tab, idx) => (
            <button
              key={tab.num}
              onClick={() => setActiveTab(idx)}
              className={`flex flex-col items-center group cursor-pointer transition-colors ${
                activeTab === idx ? 'text-[#38BDF8]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <span className="font-bold text-sm">{tab.num}</span>
              <span className={`h-0.5 w-6 mt-1 rounded-full transition-all ${
                activeTab === idx ? 'bg-[#38BDF8]' : 'bg-transparent group-hover:bg-[#1E3A8A]'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN HEADLINE & NARRATIVE CONTROLS ───────────────────────── */}
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-4 pt-10">
        <h2 className="font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] font-syne leading-tight">
          DEADPOOL III: RELEASE DATE, CAST, AND EVERYTHING ABOUT THE FILM!
        </h2>

        {/* Interactive Timeline Arrow Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : TABS.length - 1))}
            className="w-10 h-10 rounded-full border border-[#172554] bg-[#070D1E] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-[#38BDF8] uppercase tracking-widest">
            {TABS[activeTab].label}
          </span>
          <button
            onClick={() => setActiveTab((prev) => (prev < TABS.length - 1 ? prev + 1 : 0))}
            className="w-10 h-10 rounded-full border border-[#172554] bg-[#070D1E] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next step"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── THREE-COLUMN CINEMA GRID WITH 3D CHARACTER OVERLAY ───────── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
        {/* Left Column: PART C . X-MEN */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>X-MEN PROTOCOL</span>
          </div>

          <p className="text-xs font-mono text-[#94A3B8] leading-relaxed">
            <span className="text-[#F8FAFC] font-bold">PART C . </span>
            Deadpool, AKA Wade Wilson, the &quot;Merc with a Mouth&quot;, first made his cinematic debut in the much-maligned X-Men Origins: Wolverine, now rewritten in glorious timeline-hopping IMAX spectacle.
          </p>

          {/* Artwork Card */}
          <div
            onClick={onOpenTrailer}
            className="relative h-44 rounded-2xl bg-[#070D1E] border border-[#172554] overflow-hidden group cursor-pointer shadow-lg"
          >
            <Image
              src="/media/work-valorant-championship.jpg"
              alt="Deadpool Cinematic Origins"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-[#38BDF8]">
              <span>TIMELINE CASE 03</span>
              <span>PLAY ↗</span>
            </div>
          </div>
        </div>

        {/* Center Column: The Central Booking Card with 3D Heart Character */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[460px]">
          {/* Circular Orbit Dial behind card */}
          <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-[#2563EB]/40 animate-spin-slow pointer-events-none" />

          {/* Interactive Cinema Ticket Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative z-10 w-full max-w-sm rounded-3xl bg-[#070D1E]/95 border-2 border-[#1E3A8A] shadow-[0_0_60px_rgba(37,99,235,0.35)] p-6 space-y-4 backdrop-blur-md"
          >
            {/* Top Film Label */}
            <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#94A3B8]">
              <span className="text-[#38BDF8] font-bold">FILM FEATURE</span>
              <span className="px-2 py-0.5 rounded bg-[#111C35] text-[#F8FAFC]">IMAX 3D</span>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black font-syne text-2xl uppercase tracking-tight text-[#F8FAFC]">
                DEADPOOL III
              </h3>
              <p className="text-[11px] font-mono text-[#38BDF8]">
                ORIGINAL THEATRICAL ROADSHOW
              </p>
            </div>

            {/* Map Preview Thumbnail */}
            <div className="relative h-28 rounded-2xl bg-[#030712] border border-[#172554] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 hud-grid opacity-40" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-1">
                <MapPin className="w-5 h-5 text-[#38BDF8] animate-bounce" />
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  EL CAPITAN THEATRE
                </span>
                <span className="font-mono text-[10px] text-[#94A3B8]">
                  HOLLYWOOD BOULEVARD, CA
                </span>
              </div>
            </div>

            {/* Showtime Info */}
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[#030712] border border-[#172554]">
                <div className="text-[10px] text-[#94A3B8] uppercase">DATE</div>
                <div className="font-black text-[#F8FAFC]">MAY 29</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#030712] border border-[#172554]">
                <div className="text-[10px] text-[#94A3B8] uppercase">TIME</div>
                <div className="font-black text-[#38BDF8]">9:30 PM</div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={onBookNow}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-[#F8FAFC] font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_35px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Book Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* 3D Deadpool Heart Gesture Cutout (Positioned Right in Front of Booking Card) */}
          <div className="absolute -bottom-8 right-0 sm:right-6 z-20 w-44 h-44 sm:w-56 sm:h-56 pointer-events-none">
            <Image
              src="/media/cinema/deadpool-70.png"
              alt="Deadpool Heart Gesture"
              fill
              className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* Right Column: PART D . PREMIERING */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span>GLOBAL PREMIERING</span>
          </div>

          <p className="text-xs font-mono text-[#94A3B8] leading-relaxed">
            <span className="text-[#F8FAFC] font-bold">PART D . </span>
            The film represents the definitive crossover of the century, merging Hugh Jackman&apos;s iconic Wolverine into the Marvel Cinematic Universe with unmatched energy.
          </p>

          {/* Artwork Card */}
          <div
            onClick={onOpenTrailer}
            className="relative h-44 rounded-2xl bg-[#070D1E] border border-[#172554] overflow-hidden group cursor-pointer shadow-lg"
          >
            <Image
              src="/media/work-nexus-arena.jpg"
              alt="Deadpool Premiering Arena"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-[#38BDF8]">
              <span>ARENA ROADMAP</span>
              <span>PLAY ↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM TICKETING FOOTER BAR ─────────────────────────────── */}
      <div className="relative z-20 pt-6 border-t border-[#172554]/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#94A3B8] gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[#F8FAFC] font-bold">NATURE STUDIOS CINEMA LABS</span>
          <span>•</span>
          <span className="text-[#38BDF8]">EXCLUSIVE DIGITAL PASS DISTRIBUTION</span>
        </div>
        <button
          onClick={onBookNow}
          className="text-[#38BDF8] hover:text-[#F8FAFC] flex items-center gap-1 font-bold transition-colors cursor-pointer"
        >
          <span>RESERVE SEATS ONLINE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
