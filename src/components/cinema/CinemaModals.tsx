'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX, Maximize, Film, Sparkles, CheckCircle2 } from 'lucide-react';

interface CinemaTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export function CinemaTrailerModal({
  isOpen,
  onClose,
  videoUrl = '/media/infinix/vfx/infinix-teaser-trailer.mp4',
  title = 'DEADPOOL III — Official IMAX Teaser Trailer',
}: CinemaTrailerModalProps) {
  const [muted, setMuted] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl rounded-3xl bg-[#070D1E] border border-[#2563EB]/40 shadow-[0_0_80px_rgba(37,99,235,0.35)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#172554] bg-[#030712]/70">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#38BDF8]">
                  IMAX 4K THEATRICAL PREVIEW
                </span>
                <span className="hidden sm:inline text-xs text-[#94A3B8]">|</span>
                <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider text-[#F8FAFC]">
                  {title}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C35] transition-colors"
                aria-label="Close trailer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <video
                src={videoUrl}
                autoPlay
                controls
                playsInline
                muted={muted}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Footer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-[#030712] border-t border-[#172554] text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-[#38BDF8]">FORMAT: 2.39:1 CINEMASCOPE</span>
                <span className="hidden sm:inline">AUDIO: DOLBY ATMOS 7.1</span>
              </div>
              <div className="flex items-center gap-3 text-[#38BDF8]">
                <Film className="w-4 h-4 text-[#2563EB]" />
                <span>NATURE STUDIOS CINEMA LABS</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CinemaTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  cinemaName?: string;
  showtime?: string;
  movieTitle?: string;
}

export function CinemaTicketModal({
  isOpen,
  onClose,
  cinemaName = 'EL CAPITAN THEATRE',
  showtime = 'MAY 29, 2026 • 9:30 PM',
  movieTitle = 'DEADPOOL III [IMAX 3D]',
}: CinemaTicketModalProps) {
  const [selectedSeat, setSelectedSeat] = React.useState('H-14');
  const [isBooked, setIsBooked] = React.useState(false);

  const handleBook = () => {
    setIsBooked(true);
  };

  const reset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
          onClick={reset}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-[0_0_80px_rgba(37,99,235,0.4)] overflow-hidden p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close */}
            <button
              onClick={reset}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isBooked ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-widest">
                  <Film className="w-4 h-4 text-[#2563EB]" />
                  <span>PREMIERE TICKET RESERVATION</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black uppercase text-[#F8FAFC] tracking-tight">
                    {movieTitle}
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-mono mt-1">
                    {cinemaName} • HOLLYWOOD, CA
                  </p>
                </div>

                <div className="rounded-2xl bg-[#030712] border border-[#172554] p-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between pb-2 border-b border-[#172554]/60">
                    <span className="text-[#94A3B8]">DATE & TIME</span>
                    <span className="text-[#F8FAFC] font-bold">{showtime}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-[#172554]/60">
                    <span className="text-[#94A3B8]">AUDITORIUM</span>
                    <span className="text-[#38BDF8]">IMAX LASER 1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#94A3B8]">PREFERRED SEAT</span>
                    <div className="flex gap-1.5">
                      {['H-12', 'H-14', 'H-16'].map((seat) => (
                        <button
                          key={seat}
                          onClick={() => setSelectedSeat(seat)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                            selectedSeat === seat
                              ? 'bg-[#2563EB] text-[#F8FAFC] shadow-sm'
                              : 'bg-[#111C35] text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleBook}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#38BDF8] text-[#F8FAFC] font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    Confirm Premiere Pass →
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-5">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#18A957]/20 border border-[#18A957] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#18A957]" />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase text-[#F8FAFC]">
                    TICKET CONFIRMED!
                  </h4>
                  <p className="text-xs text-[#94A3B8] font-mono mt-1">
                    Your seat {selectedSeat} at {cinemaName} is booked.
                  </p>
                </div>

                {/* Digital Ticket Stub */}
                <div className="rounded-2xl bg-[#030712] border-2 border-dashed border-[#2563EB]/60 p-4 font-mono text-xs text-left space-y-2">
                  <div className="flex justify-between text-[#38BDF8] font-bold">
                    <span>PASS: #NS-DEADPOOL-2026</span>
                    <span>SEAT: {selectedSeat}</span>
                  </div>
                  <div className="text-[#94A3B8] text-[11px]">
                    SHOWTIME: {showtime}
                  </div>
                  <div className="h-6 w-full bg-gradient-to-r from-[#2563EB]/20 via-[#38BDF8]/40 to-[#2563EB]/20 rounded flex items-center justify-center text-[10px] text-[#38BDF8] tracking-widest">
                    |||||||| ||||| |||||||||||| |||||
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="px-6 py-2.5 rounded-xl bg-[#111C35] hover:bg-[#1E3A8A] text-[#F8FAFC] text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Close & Return
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
