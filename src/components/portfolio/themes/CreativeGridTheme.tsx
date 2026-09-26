'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { ExternalLink, Sparkles, Layers, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

/**
 * 05 — Creative Grid Theme
 * Visual-first dynamic masonry tiles, asymmetric cards,
 * bold colorful tags, and expressive hover states.
 */
export function CreativeGridTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, services, socialLinks } = portfolio;

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] font-sans selection:bg-[#FF6B1A] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-[#172554] p-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#FF6B1A] animate-pulse" />
          <h1 className="text-lg font-black uppercase tracking-tight text-[#F8FAFC]">
            {personalInfo.fullName || 'Creator'} {'//'} STUDIO GRID
          </h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
          {professionalIdentity.primaryRole || 'Visual Director'}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="p-6 lg:p-12 border-b border-[#172554] bg-gradient-to-r from-[#2A070B] to-[#030712]">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172554] text-xs font-mono text-[#FF6B1A] mb-4">
            <Sparkles className="w-3.5 h-3.5" /> <span>SELECTED PORTFOLIO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F8FAFC] mb-4">
            {personalInfo.tagline || 'Visual Systems & Immersive Worlds.'}
          </h2>
          {personalInfo.aboutMe && (
            <p className="text-sm sm:text-base text-[#BAE6FD] max-w-2xl font-light">
              {personalInfo.aboutMe}
            </p>
          )}
        </div>
      </section>

      {/* Dynamic Masonry Project Grid */}
      {projects && projects.length > 0 && (
        <section className="p-6 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => {
              const isWide = idx % 3 === 0;
              return (
                <div
                  key={proj.id || idx}
                  className={`group relative rounded-2xl overflow-hidden border border-[#1E3A8A] bg-[#0B132B] shadow-xl transition-all duration-300 hover:border-[#FF6B1A] ${
                    isWide ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                    {proj.thumbnail ? (
                      <Image
                        src={proj.thumbnail}
                        alt={proj.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1E40AF] to-[#030712] flex items-center justify-center text-[#38BDF8] font-mono text-xs">
                        [NO IMAGE]
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B1A] text-black text-[10px] font-mono font-bold uppercase">
                        {proj.category}
                      </span>
                      {proj.client && (
                        <span className="text-[10px] font-mono text-[#38BDF8] uppercase">
                          {proj.client}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold uppercase text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 font-light">
                      {proj.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills Grid */}
      {skills && skills.length > 0 && (
        <section className="p-6 lg:p-12 border-t border-[#172554]">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-6">
            STACK & DISCIPLINES
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono text-[#F8FAFC]">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="p-6 lg:p-12 border-t border-[#172554] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
        <span>{personalInfo.fullName} • CREATIVE GRID</span>
        <span className="text-[#38BDF8]">NATURESTUDIOS PLATFORM</span>
      </footer>
    </div>
  );
}
