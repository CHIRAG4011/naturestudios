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
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-[#38BDF8]">
      {/* Full-Bleed Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-radial from-[#2563EB]/50 via-[#1E40AF]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />

        {/* Top Navbar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <span className="text-[#38BDF8] tracking-widest uppercase font-bold">
            {personalInfo.fullName || 'CREATOR'} {'//'} IMMERSIVE
          </span>
          <span className="text-[#94A3B8] uppercase">
            {professionalIdentity.jobTitle || 'PORTFOLIO EXPERIENCE'}
          </span>
        </div>

        {/* Center Headline */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E090D] border border-[#1E3A8A] text-[11px] font-mono uppercase text-[#38BDF8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IMMERSIVE FOLIO 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-[#F8FAFC] leading-[0.95]">
            {personalInfo.tagline || 'Engineering Digital Realities.'}
          </h1>

          {personalInfo.aboutMe && (
            <p className="text-base sm:text-lg text-[#BAE6FD] max-w-xl mx-auto font-light leading-relaxed">
              {personalInfo.aboutMe}
            </p>
          )}
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>{personalInfo.location || 'GLOBAL REACH'}</span>
          <span className="flex items-center gap-1 text-[#38BDF8]">
            SCROLL TO EXPLORE <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </span>
        </div>
      </section>

      {/* Featured Projects Vertical Stages */}
      {projects && projects.length > 0 && (
        <div className="space-y-16 px-6 lg:px-16 py-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] border-b border-[#172554] pb-4">
            FEATURED PRODUCTIONS ({projects.length})
          </div>

          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="rounded-3xl border border-[#1E3A8A] bg-[#22070A] p-8 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-mono text-[#38BDF8] uppercase">
                  PROJECT 0{idx + 1} {'//'} {proj.category}
                </span>
                <h3 className="text-3xl lg:text-4xl font-bold uppercase text-[#F8FAFC]">
                  {proj.title}
                </h3>
                <p className="text-sm text-[#BAE6FD] leading-relaxed font-light">
                  {proj.description}
                </p>
                {proj.tools && proj.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {proj.tools.map((t, tidx) => (
                      <span key={tidx} className="px-2.5 py-1 rounded bg-[#2E090D] text-[11px] font-mono text-[#38BDF8]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-6 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#1E3A8A]">
                {proj.thumbnail ? (
                  <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#030712] flex items-center justify-center text-[#38BDF8] font-mono text-xs">
                    [PROJECT IMAGE]
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="p-8 border-t border-[#172554] text-center text-xs font-mono text-[#94A3B8]">
        {personalInfo.fullName} • IMMERSIVE THEME • NATURESTUDIOS
      </footer>
    </div>
  );
}
