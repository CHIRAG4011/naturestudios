'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinemaHero } from './CinemaHero';
import { CinemaRadarSection } from './CinemaRadarSection';
import { CinemaCastDeck } from './CinemaCastDeck';
import { CinemaStoryBooking } from './CinemaStoryBooking';
import { CinemaTrailerModal, CinemaTicketModal } from './CinemaModals';
import { Volume2, VolumeX, Sparkles, Film, ArrowRight, Layers } from 'lucide-react';

interface CinemaLandingPageProps {
  onToggleStudioView?: () => void;
  showStudioToggle?: boolean;
}

export function CinemaLandingPage({
  onToggleStudioView,
  showStudioToggle = true,
}: CinemaLandingPageProps) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#F8FAFC]">
      {/* ─── CINEMA HERO SECTION (Screen 1) ─────────────────────────── */}
      <CinemaHero
        onBookNow={() => setTicketOpen(true)}
        onOpenTrailer={() => setTrailerOpen(true)}
      />

      {/* ─── RADAR SPECIFICATIONS & PRODUCTION RADAR (Screen 2) ──────── */}
      <CinemaRadarSection
        onOpenTrailer={() => setTrailerOpen(true)}
        onBookNow={() => setTicketOpen(true)}
      />

      {/* ─── 3D CAST & CHARACTER SUIT DECK CAROUSEL (Screen 3) ──────── */}
      <CinemaCastDeck />

      {/* ─── FILM STORY ARCHIVE & BOOKING CARD (Screen 4) ────────────── */}
      <CinemaStoryBooking
        onBookNow={() => setTicketOpen(true)}
        onOpenTrailer={() => setTrailerOpen(true)}
      />

      {/* ─── FLOATING AUDIO / THEATER CONTROLS (BOTTOM-LEFT) ────────── */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        <button
          onClick={toggleAudio}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#070D1E]/90 border border-[#172554] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#38BDF8] backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-all cursor-pointer"
          title="Toggle Cinema Audio Ambience"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 text-[#38BDF8]" />
              {/* Animated Sound Equalizer Waves */}
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-[#38BDF8] animate-pulse" />
                <span className="w-0.5 h-2 bg-[#38BDF8] animate-pulse delay-75" />
                <span className="w-0.5 h-3 bg-[#38BDF8] animate-pulse delay-150" />
              </div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#38BDF8]">
                DOLBY ATMOS
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-wider uppercase">
                THEATER SOUND OFF
              </span>
            </>
          )}
        </button>
      </div>

      {/* ─── FLOATING QUICK TICKET BUTTON (BOTTOM-RIGHT) ─────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setTicketOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-[#F8FAFC] font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Film className="w-4 h-4" />
          <span>RESERVE PASS</span>
        </button>
      </div>

      {/* ─── CINEMA VIDEO TRAILER MODAL ──────────────────────────────── */}
      <CinemaTrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoUrl="/media/infinix/vfx/infinix-teaser-trailer.mp4"
        title="DEADPOOL III &bull; IMAX THEATRICAL TRAILER"
      />

      {/* ─── CINEMA TICKET RESERVATION MODAL ─────────────────────────── */}
      <CinemaTicketModal
        isOpen={ticketOpen}
        onClose={() => setTicketOpen(false)}
        cinemaName="EL CAPITAN THEATRE"
        showtime="MAY 29, 2026 • 9:30 PM"
        movieTitle="DEADPOOL III [IMAX 3D]"
      />
    </div>
  );
}
