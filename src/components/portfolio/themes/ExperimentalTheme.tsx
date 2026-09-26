'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { Terminal, CornerDownRight, Zap } from 'lucide-react';
import Image from 'next/image';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

/**
 * 08 — Experimental Portfolio Theme
 * Brutalist layout, oversized typography, diagonal cut details,
 * and high-contrast technical annotations.
 */
export function ExperimentalTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, experience } = portfolio;

  return (
    <div className="min-h-screen bg-[#0D0102] text-[#F8FAFC] font-mono selection:bg-[#E63946] selection:text-white">
      {/* Brutalist Masthead */}
      <header className="border-b-2 border-[#2563EB] p-6 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#E63946]" />
          <span className="text-sm font-bold tracking-widest uppercase text-[#38BDF8]">
            SYS.EXP {'//'} {personalInfo.fullName || 'CREATOR'}
          </span>
        </div>
        <div className="text-xs text-[#94A3B8] uppercase">
          LOC: {personalInfo.location || 'LAT 51.5074 N'} {'//'} AVAIL: {personalInfo.availability || 'ACTIVE'}
        </div>
      </header>

      {/* Giant Typography Hero */}
      <section className="p-6 lg:p-10 border-b-2 border-[#2563EB] space-y-6">
        <div className="text-[10px] text-[#E63946] tracking-[0.3em] uppercase">
          [INITIATING MANIFESTO ENGINE]
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-[#F8FAFC] break-words">
          {personalInfo.fullName?.split(' ')[0] || 'DATA'}
          <br />
          <span className="text-[#E63946]">{personalInfo.fullName?.split(' ')[1] || 'STREAM'}</span>
        </h1>

        <div className="max-w-2xl text-xs sm:text-sm text-[#BAE6FD] leading-relaxed border-l-2 border-[#E63946] pl-4">
          {personalInfo.tagline || 'Deconstructing digital structures into raw kinetic impact.'}
          {personalInfo.aboutMe && <p className="mt-2 text-[#94A3B8]">{personalInfo.aboutMe}</p>}
        </div>
      </section>

      {/* Experimental Projects List with Monospaced Coordinates */}
      {projects && projects.length > 0 && (
        <section className="p-6 lg:p-10 border-b-2 border-[#2563EB] space-y-8">
          <div className="text-xs text-[#38BDF8] tracking-widest uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#E63946]" />
            <span>EXECUTION ARRAYS ({projects.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="border-2 border-[#1E3A8A] p-6 space-y-4 hover:border-[#E63946] transition-colors bg-[#1A0305]"
              >
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <span>NODE-{idx + 1}</span>
                  <span className="text-[#38BDF8]">{proj.category}</span>
                </div>

                <h3 className="text-2xl font-bold uppercase text-[#F8FAFC]">
                  {proj.title}
                </h3>

                {proj.thumbnail && (
                  <div className="relative h-48 w-full border border-[#172554]">
                    <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                  </div>
                )}

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {proj.description}
                </p>

                {proj.technologies && (
                  <div className="text-[10px] text-[#38BDF8] flex flex-wrap gap-2 pt-2">
                    {proj.technologies.map((tech, tidx) => (
                      <span key={tidx} className="border border-[#1E3A8A] px-2 py-0.5">
                        +{tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Matrix */}
      {skills && skills.length > 0 && (
        <section className="p-6 lg:p-10 border-b-2 border-[#2563EB]">
          <div className="text-xs text-[#38BDF8] tracking-widest uppercase mb-4">
            [SYS_SKILL_MATRIX]
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {skills.map((s, idx) => (
              <div key={idx} className="border border-[#172554] p-2.5 flex justify-between">
                <span className="text-[#F8FAFC]">{s.name}</span>
                <span className="text-[#E63946]">{s.proficiency || 95}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="p-6 lg:p-10 flex justify-between items-center text-xs text-[#6E4249]">
        <span>{personalInfo.fullName} • EXPERIMENTAL ENGINE</span>
        <span>VER 2.0.0</span>
      </footer>
    </div>
  );
}
