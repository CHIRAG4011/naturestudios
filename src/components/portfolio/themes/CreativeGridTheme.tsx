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
    <div className="min-h-screen bg-[#180406] text-[#FFF5ED] font-sans selection:bg-[#FF6B1A] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-[#3D0D13] p-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#FF6B1A] animate-pulse" />
          <h1 className="text-lg font-black uppercase tracking-tight text-[#FFF5ED]">
            {personalInfo.fullName || 'Creator'} {'//'} STUDIO GRID
          </h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
          {professionalIdentity.primaryRole || 'Visual Director'}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="p-6 lg:p-12 border-b border-[#3D0D13] bg-gradient-to-r from-[#2A070B] to-[#180406]">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D0D13] text-xs font-mono text-[#FF6B1A] mb-4">
            <Sparkles className="w-3.5 h-3.5" /> <span>SELECTED PORTFOLIO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#FFF5ED] mb-4">
            {personalInfo.tagline || 'Visual Systems & Immersive Worlds.'}
          </h2>
          {personalInfo.aboutMe && (
            <p className="text-sm sm:text-base text-[#D4B39B] max-w-2xl font-light">
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
                  className={`group relative rounded-2xl overflow-hidden border border-[#52141A] bg-[#240709] shadow-xl transition-all duration-300 hover:border-[#FF6B1A] ${
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
                      <div className="w-full h-full bg-gradient-to-br from-[#3A0E11] to-[#150304] flex items-center justify-center text-[#FED7B8] font-mono text-xs">
                        [NO IMAGE]
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180406] via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B1A] text-black text-[10px] font-mono font-bold uppercase">
                        {proj.category}
                      </span>
                      {proj.client && (
                        <span className="text-[10px] font-mono text-[#FED7B8] uppercase">
                          {proj.client}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#B89B8D] line-clamp-2 font-light">
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
        <section className="p-6 lg:p-12 border-t border-[#3D0D13]">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#B89B8D] mb-6">
            STACK & DISCIPLINES
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#2D0A0E] border border-[#52141A] text-xs font-mono text-[#FFF5ED]">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="p-6 lg:p-12 border-t border-[#3D0D13] flex items-center justify-between text-xs font-mono text-[#B89B8D]">
        <span>{personalInfo.fullName} • CREATIVE GRID</span>
        <span className="text-[#FED7B8]">NATURESTUDIOS PLATFORM</span>
      </footer>
    </div>
  );
}
