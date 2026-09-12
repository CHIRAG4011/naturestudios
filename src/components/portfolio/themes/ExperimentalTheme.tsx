'use client';

import React from 'react';
import { PortfolioData } from '@/lib/portfolio-service';
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
    <div className="min-h-screen bg-[#0D0102] text-[#FFF5ED] font-mono selection:bg-[#E63946] selection:text-white">
      {/* Brutalist Masthead */}
      <header className="border-b-2 border-[#59171B] p-6 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#E63946]" />
          <span className="text-sm font-bold tracking-widest uppercase text-[#FED7B8]">
            SYS.EXP {'//'} {personalInfo.fullName || 'CREATOR'}
          </span>
        </div>
        <div className="text-xs text-[#B89B8D] uppercase">
          LOC: {personalInfo.location || 'LAT 51.5074 N'} {'//'} AVAIL: {personalInfo.availability || 'ACTIVE'}
        </div>
      </header>

      {/* Giant Typography Hero */}
      <section className="p-6 lg:p-10 border-b-2 border-[#59171B] space-y-6">
        <div className="text-[10px] text-[#E63946] tracking-[0.3em] uppercase">
          [INITIATING MANIFESTO ENGINE]
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-[#FFF5ED] break-words">
          {personalInfo.fullName?.split(' ')[0] || 'DATA'}
          <br />
          <span className="text-[#E63946]">{personalInfo.fullName?.split(' ')[1] || 'STREAM'}</span>
        </h1>

        <div className="max-w-2xl text-xs sm:text-sm text-[#D4B39B] leading-relaxed border-l-2 border-[#E63946] pl-4">
          {personalInfo.tagline || 'Deconstructing digital structures into raw kinetic impact.'}
          {personalInfo.aboutMe && <p className="mt-2 text-[#B89B8D]">{personalInfo.aboutMe}</p>}
        </div>
      </section>

      {/* Experimental Projects List with Monospaced Coordinates */}
      {projects && projects.length > 0 && (
        <section className="p-6 lg:p-10 border-b-2 border-[#59171B] space-y-8">
          <div className="text-xs text-[#FED7B8] tracking-widest uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#E63946]" />
            <span>EXECUTION ARRAYS ({projects.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="border-2 border-[#52141A] p-6 space-y-4 hover:border-[#E63946] transition-colors bg-[#1A0305]"
              >
                <div className="flex items-center justify-between text-[10px] text-[#B89B8D]">
                  <span>NODE-{idx + 1}</span>
                  <span className="text-[#FED7B8]">{proj.category}</span>
                </div>

                <h3 className="text-2xl font-bold uppercase text-[#FFF5ED]">
                  {proj.title}
                </h3>

                {proj.thumbnail && (
                  <div className="relative h-48 w-full border border-[#3D0D13]">
                    <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                  </div>
                )}

                <p className="text-xs text-[#B89B8D] leading-relaxed">
                  {proj.description}
                </p>

                {proj.technologies && (
                  <div className="text-[10px] text-[#FED7B8] flex flex-wrap gap-2 pt-2">
                    {proj.technologies.map((tech, tidx) => (
                      <span key={tidx} className="border border-[#52141A] px-2 py-0.5">
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
        <section className="p-6 lg:p-10 border-b-2 border-[#59171B]">
          <div className="text-xs text-[#FED7B8] tracking-widest uppercase mb-4">
            [SYS_SKILL_MATRIX]
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {skills.map((s, idx) => (
              <div key={idx} className="border border-[#3D0D13] p-2.5 flex justify-between">
                <span className="text-[#FFF5ED]">{s.name}</span>
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
