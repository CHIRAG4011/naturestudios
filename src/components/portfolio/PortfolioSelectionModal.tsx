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
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#240709] via-[#1D0608] to-[#150304] border border-[#59171B] rounded-3xl p-6 sm:p-10 shadow-glow-burgundy overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-[#59171B]/50 to-transparent blur-2xl pointer-events-none" />

        {/* Optional Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#150304]/80 border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] hover:border-[#FED7B8]/40 transition-colors z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center relative z-10 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#59171B]/50 border border-[#FED7B8]/20 text-[11px] font-mono uppercase tracking-widest text-[#FED7B8] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FED7B8]" />
            <span>{isStudio ? 'NatureStudios Official Showcases' : 'Community Creator Directory'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#FFF5ED] mb-3 font-syne">
            {modalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#B89B8D] max-w-md mx-auto leading-relaxed">
            {modalSubtitle}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
          {/* OPTION 1 — GFX */}
          <button
            onClick={() => onSelect('GFX')}
            className="group relative p-6 sm:p-7 rounded-2xl bg-[#1A0507] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-burgundy flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#59171B]/60 border border-[#FED7B8]/30 flex items-center justify-center text-[#FED7B8] mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8]">Option 01</span>
                <span className="w-1 h-1 rounded-full bg-[#FED7B8]/50" />
                <span className="text-[10px] font-mono text-[#B89B8D]">Images Only</span>
              </div>

              <h3 className="text-2xl font-black uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors mb-2 font-syne">
                GFX Design
              </h3>

              <p className="text-xs text-[#B89B8D] leading-relaxed mb-4">
                Tournament stage graphics, team rosters, high-CTR thumbnails, and branding logos/banners.
              </p>

              {/* Subcategories direct selection */}
              <div className="pt-2 border-t border-[#3D0D13] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">
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
                      className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8] hover:bg-[#59171B] hover:border-[#FED7B8] cursor-pointer transition-all hover:scale-105"
                    >
                      {sub} →
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#FED7B8] pt-5 mt-4 border-t border-[#3D0D13]/60 group-hover:border-[#FED7B8]/40">
              <span className="tracking-wider">Explore GFX</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* OPTION 2 — VFX */}
          <button
            onClick={() => onSelect('VFX')}
            className="group relative p-6 sm:p-7 rounded-2xl bg-[#1A0507] hover:bg-[#20051B] border border-[#3D0D13] hover:border-purple-400 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">Option 02</span>
                <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                <span className="text-[10px] font-mono text-[#B89B8D]">Video Reels</span>
              </div>

              <h3 className="text-2xl font-black uppercase text-[#FFF5ED] group-hover:text-purple-300 transition-colors mb-2 font-syne">
                VFX & Motion
              </h3>

              <p className="text-xs text-[#B89B8D] leading-relaxed mb-4">
                Cinematic showreels, motion design, stream clipping suites, 3D broadcast openers, and video effects.
              </p>

              {/* Subcategories tags selection */}
              <div className="pt-2 border-t border-[#3D0D13] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">
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

            <div className="flex items-center justify-between text-xs font-mono uppercase text-purple-300 pt-5 mt-4 border-t border-[#3D0D13]/60 group-hover:border-purple-400/40">
              <span className="tracking-wider">Watch VFX Reels</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] font-mono text-[#B89B8D]/70">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#120204] border border-[#3D0D13] text-[#FED7B8]">1</kbd> for GFX or <kbd className="px-1.5 py-0.5 rounded bg-[#120204] border border-[#3D0D13] text-purple-300">2</kbd> for VFX
        </div>
      </div>
    </div>
  );
}
