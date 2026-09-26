'use client';

import React, { useEffect } from 'react';
import { Sparkles, Film, Image as ImageIcon, ArrowRight, X, Layers, Flame, Video } from 'lucide-react';

interface PortfolioSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelect: (track: 'GFX' | 'VFX', subsection?: string) => void;
  mode: 'studio' | 'global';
  title?: string;
  subtitle?: string;
}

export function PortfolioSelectionModal({
  isOpen,
  onClose,
  onSelect,
  mode,
  title,
  subtitle,
}: PortfolioSelectionModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === '1' || e.key.toLowerCase() === 'g') {
        onSelect('GFX');
      } else if (e.key === '2' || e.key.toLowerCase() === 'v') {
        onSelect('VFX');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelect]);

  if (!isOpen) return null;

  const isStudio = mode === 'studio';
  const modalTitle = title || (isStudio ? 'Studio Portfolio' : 'Global Portfolio');
  const modalSubtitle =
    subtitle ||
    (isStudio
      ? 'Explore our studio work crafted for top-tier esports tournaments & brands.'
      : 'Explore community creator work published by designers & VFX artists worldwide.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#030712] border border-[#2563EB] rounded-3xl p-6 sm:p-10 shadow-glow-burgundy overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-[#2563EB]/50 to-transparent blur-2xl pointer-events-none" />

        {/* Optional Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#030712]/80 border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#38BDF8]/40 transition-colors z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center relative z-10 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/50 border border-[#38BDF8]/20 text-[11px] font-mono uppercase tracking-widest text-[#38BDF8] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{isStudio ? 'NatureStudios Official Showcases' : 'Community Creator Directory'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#F8FAFC] mb-3 font-syne">
            {modalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            {modalSubtitle}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
          {/* OPTION 1 — GFX */}
          <button
            onClick={() => onSelect('GFX')}
            className="group relative p-6 sm:p-7 rounded-2xl bg-[#050B17] hover:bg-[#0E1A33] border border-[#172554] hover:border-[#38BDF8] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-burgundy flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/60 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8]">Option 01</span>
                <span className="w-1 h-1 rounded-full bg-[#38BDF8]/50" />
                <span className="text-[10px] font-mono text-[#94A3B8]">Images Only</span>
              </div>

              <h3 className="text-2xl font-black uppercase text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors mb-2 font-syne">
                GFX Design
              </h3>

              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Tournament stage graphics, team rosters, high-CTR thumbnails, and branding logos/banners.
              </p>

              {/* Subcategories direct selection */}
              <div className="pt-2 border-t border-[#172554] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                  Select Subsection Directly:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Tournament', 'Roster', 'Thumbnail', 'Logo/Banner', 'Jersey'].map((sub) => (
                    <span
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect('GFX', sub);
                      }}
                      className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-[#0F1D38] border border-[#1E3A8A] text-[#38BDF8] hover:bg-[#2563EB] hover:border-[#38BDF8] cursor-pointer transition-all hover:scale-105"
                    >
                      {sub} →
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#38BDF8] pt-5 mt-4 border-t border-[#172554]/60 group-hover:border-[#38BDF8]/40">
              <span className="tracking-wider">Explore GFX</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* OPTION 2 — VFX */}
          <button
            onClick={() => onSelect('VFX')}
            className="group relative p-6 sm:p-7 rounded-2xl bg-[#050B17] hover:bg-[#20051B] border border-[#172554] hover:border-purple-400 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">Option 02</span>
                <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                <span className="text-[10px] font-mono text-[#94A3B8]">Video Reels</span>
              </div>

              <h3 className="text-2xl font-black uppercase text-[#F8FAFC] group-hover:text-purple-300 transition-colors mb-2 font-syne">
                VFX & Motion
              </h3>

              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Cinematic showreels, motion design, stream clipping suites, 3D broadcast openers, and video effects.
              </p>

              {/* Subcategories tags selection */}
              <div className="pt-2 border-t border-[#172554] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                  Select Subsection Directly:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Clipping', 'Cinematics', 'Showreel', 'Broadcast'].map((sub) => (
                    <span
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect('VFX', sub);
                      }}
                      className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-[#25092B] border border-purple-500/30 text-purple-200 hover:bg-purple-900 hover:border-purple-400 cursor-pointer transition-all hover:scale-105"
                    >
                      {sub} →
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono uppercase text-purple-300 pt-5 mt-4 border-t border-[#172554]/60 group-hover:border-purple-400/40">
              <span className="tracking-wider">Watch VFX Reels</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] font-mono text-[#94A3B8]/70">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#120204] border border-[#172554] text-[#38BDF8]">1</kbd> for GFX or <kbd className="px-1.5 py-0.5 rounded bg-[#120204] border border-[#172554] text-purple-300">2</kbd> for VFX
        </div>
      </div>
    </div>
  );
}
