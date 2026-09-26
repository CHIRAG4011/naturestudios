'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shield, Award, Sparkles, Instagram, Youtube, ExternalLink } from 'lucide-react';

interface CastCard {
  id: string;
  name: string;
  role: string;
  actor: string;
  badge: string;
  image: string;
  bio: string;
  color: string;
}

const CAST_CARDS: CastCard[] = [
  {
    id: 'deadpool',
    name: 'WADE WILSON',
    role: 'DEADPOOL / THE MERC WITH A MOUTH',
    actor: 'RYAN REYNOLDS',
    badge: 'LEAD ANTI-HERO',
    image: '/media/cinema/deadpool-70.png',
    bio: 'Armed with dual katanas, accelerated regenerative healing, and complete awareness of the fourth wall.',
    color: '#2563EB',
  },
  {
    id: 'wolverine',
    name: 'LOGAN',
    role: 'WOLVERINE / WEAPON X',
    actor: 'HUGH JACKMAN',
    badge: 'CLASSIC YELLOW & BLUE',
    image: '/media/cinema/wolverine-44.png',
    bio: 'Lethal adamantium claws, feral heightened instincts, and decades of mutant combat mastery.',
    color: '#38BDF8',
  },
  {
    id: 'cassandra',
    name: 'CASSANDRA NOVA',
    role: 'OMEGA-LEVEL VOID RULER',
    actor: 'EMMA CORRIN',
    badge: 'TELEPATHIC OVERLORD',
    image: '/media/cinema/deadpool-78.png',
    bio: 'A psychic entity wielding immense psionic telekinesis within the multidimensional wasteland.',
    color: '#60A5FA',
  },
  {
    id: 'dopinder',
    name: 'DOPINDER',
    role: 'TACTICAL GETAWAY SPECIALIST',
    actor: 'KARAN SONI',
    badge: 'CAB COMMANDER',
    image: '/media/cinema/deadpool-41.png',
    bio: 'Trusted confidant, urban navigation master, and the most determined contract driver in cinema history.',
    color: '#1D4ED8',
  },
];

export function CinemaCastDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAST_CARDS.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev === CAST_CARDS.length - 1 ? 0 : prev + 1));
  };

  const activeCard = CAST_CARDS[currentIndex];

  return (
    <section
      id="casts"
      className="relative w-full min-h-[95vh] bg-[#030712] text-[#F8FAFC] py-24 px-6 sm:px-12 flex flex-col justify-between overflow-hidden border-b border-[#172554] select-none"
    >
      {/* ─── GIANT BACKGROUND KINETIC BANNER: "DIRECTED BY SHAWN LEVY" ── */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-25">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap text-[18vw] font-black uppercase text-[#1E3A8A]/50 tracking-tighter leading-none"
        >
          <span>DIRECTED BY SHAWN LEVY &bull; PRODUCED BY NATURE STUDIOS &bull; </span>
          <span>DIRECTED BY SHAWN LEVY &bull; PRODUCED BY NATURE STUDIOS &bull; </span>
        </motion.div>
      </div>

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span>3D CAST &amp; CHARACTER SUIT DECK</span>
        </div>
        <div className="flex items-center gap-2 text-[#38BDF8]">
          <span>CARD {currentIndex + 1} / {CAST_CARDS.length}</span>
        </div>
      </div>

      {/* ─── 3D FANNED CARD DECK CAROUSEL ────────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-8">
        <div className="relative w-full max-w-lg h-[460px] sm:h-[520px] flex items-center justify-center">
          {CAST_CARDS.map((card, index) => {
            // Calculate distance from current index
            const offset = (index - currentIndex + CAST_CARDS.length) % CAST_CARDS.length;
            const isCenter = offset === 0;
            const isRight = offset === 1;
            const isLeft = offset === CAST_CARDS.length - 1;

            if (!isCenter && !isRight && !isLeft) return null;

            return (
              <motion.div
                key={card.id}
                animate={{
                  x: isCenter ? 0 : isRight ? 110 : -110,
                  scale: isCenter ? 1 : 0.88,
                  rotateZ: isCenter ? 0 : isRight ? 8 : -8,
                  opacity: isCenter ? 1 : 0.6,
                  zIndex: isCenter ? 30 : 10,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="absolute w-[290px] sm:w-[340px] h-[420px] sm:h-[480px] rounded-3xl bg-[#070D1E] border-2 border-[#1E3A8A] shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-6 flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={() => {
                  if (isRight) nextCard();
                  if (isLeft) prevCard();
                }}
              >
                {/* Ambient Card Backlight */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${card.color} 0%, transparent 70%)`,
                  }}
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  <span className="px-2 py-0.5 rounded-full bg-[#030712] border border-[#172554] text-[#38BDF8]">
                    {card.badge}
                  </span>
                  <span>IMAX 4K</span>
                </div>

                {/* Character Cutout Container */}
                <div className="relative flex-1 w-full my-2 flex items-center justify-center">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                  />
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-1.5 pt-2 border-t border-[#172554]/60 bg-[#070D1E]/80 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-black uppercase text-[#F8FAFC] tracking-tight font-syne">
                    {card.name}
                  </div>
                  <div className="text-xs font-mono text-[#38BDF8] font-bold">
                    {card.actor}
                  </div>
                  <p className="text-[11px] font-mono text-[#94A3B8] leading-tight line-clamp-2">
                    {card.bio}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── CAROUSEL NAVIGATION CONTROLS (◄ and ►) ─────────────────── */}
        <div className="flex items-center gap-6 mt-6 z-30">
          {/* Previous Arrow Button */}
          <button
            onClick={prevCard}
            className="w-14 h-14 rounded-full bg-[#0B132B] border-2 border-[#1E3A8A] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#38BDF8] flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous character"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Social Links Mini Bar */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#070D1E] border border-[#172554]">
            <a
              href="https://www.instagram.com/naturestudio.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors p-1"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors p-1"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={nextCard}
            className="w-14 h-14 rounded-full bg-[#F8FAFC] text-[#030712] flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all hover:bg-[#38BDF8] hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next character"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Director Highlight Bar */}
      <div className="relative z-20 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#94A3B8] gap-4">
        <div>
          <span className="text-[#38BDF8] font-bold">DIRECTOR: </span>
          <span>SHAWN LEVY (FREE GUY, STRANGER THINGS, THE ADAM PROJECT)</span>
        </div>
        <div className="flex items-center gap-2 text-[#38BDF8]">
          <Award className="w-4 h-4 text-[#2563EB]" />
          <span>OFFICIAL CINEMA RELEASE 2026</span>
        </div>
      </div>
    </section>
  );
}
