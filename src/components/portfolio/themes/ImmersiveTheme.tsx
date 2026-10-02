'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { Sparkles, ArrowDown, MapPin, Globe } from 'lucide-react';
import Image from 'next/image';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

/**
 * 06 — Immersive Portfolio Theme
 * Expansive full-bleed visual stages, atmospheric glow layers,
 * and cinematic vertical storytelling.
 */
export function ImmersiveTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, experience } = portfolio;

  return (
    <div className="min-h-screen bg-[#150304] text-[#FFF5ED] font-sans selection:bg-[#59171B] selection:text-[#FED7B8]">
      {/* Full-Bleed Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-radial from-[#59171B]/50 via-[#3A0E11]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />

        {/* Top Navbar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <span className="text-[#FED7B8] tracking-widest uppercase font-bold">
            {personalInfo.fullName || 'CREATOR'} {'//'} IMMERSIVE
          </span>
          <span className="text-[#B89B8D] uppercase">
            {professionalIdentity.jobTitle || 'PORTFOLIO EXPERIENCE'}
          </span>
        </div>

        {/* Center Headline */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E090D] border border-[#52141A] text-[11px] font-mono uppercase text-[#FED7B8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IMMERSIVE FOLIO 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-[#FFF5ED] leading-[0.95]">
            {personalInfo.tagline || 'Engineering Digital Realities.'}
          </h1>

          {personalInfo.aboutMe && (
            <p className="text-base sm:text-lg text-[#D4B39B] max-w-xl mx-auto font-light leading-relaxed">
              {personalInfo.aboutMe}
            </p>
          )}
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#B89B8D]">
          <span>{personalInfo.location || 'GLOBAL REACH'}</span>
          <span className="flex items-center gap-1 text-[#FED7B8]">
            SCROLL TO EXPLORE <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </span>
        </div>
      </section>

      {/* Featured Projects Vertical Stages */}
      {projects && projects.length > 0 && (
        <div className="space-y-16 px-6 lg:px-16 py-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B89B8D] border-b border-[#3D0D13] pb-4">
            FEATURED PRODUCTIONS ({projects.length})
          </div>

          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="rounded-3xl border border-[#52141A] bg-[#22070A] p-8 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-mono text-[#FED7B8] uppercase">
                  PROJECT 0{idx + 1} {'//'} {proj.category}
                </span>
                <h3 className="text-3xl lg:text-4xl font-bold uppercase text-[#FFF5ED]">
                  {proj.title}
                </h3>
                <p className="text-sm text-[#D4B39B] leading-relaxed font-light">
                  {proj.description}
                </p>
                {proj.tools && proj.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {proj.tools.map((t, tidx) => (
                      <span key={tidx} className="px-2.5 py-1 rounded bg-[#2E090D] text-[11px] font-mono text-[#FED7B8]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-6 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#52141A]">
                {proj.thumbnail ? (
                  <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#150304] flex items-center justify-center text-[#FED7B8] font-mono text-xs">
                    [PROJECT IMAGE]
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="p-8 border-t border-[#3D0D13] text-center text-xs font-mono text-[#B89B8D]">
        {personalInfo.fullName} • IMMERSIVE THEME • NATURESTUDIOS
      </footer>
    </div>
  );
}
