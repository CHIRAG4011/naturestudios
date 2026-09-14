'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { ExternalLink, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

/**
 * 04 — Minimal Portfolio Theme
 * Characterized by Swiss modernist typography, monospaced metadata,
 * quiet confidence, high whitespace, and razor-sharp line work.
 */
export function MinimalTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, experience, services, socialLinks } = portfolio;
  const accent = portfolio.designConfig?.accentColor || '#FED7B8';

  return (
    <div className="min-h-screen bg-[#110203] text-[#FFF5ED] font-sans selection:bg-[#59171B] selection:text-[#FED7B8]">
      {/* Top Masthead */}
      <header className="border-b border-[#2D0A0E] py-8 px-6 lg:px-16 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B89B8D] block mb-1">
            CREATOR FOLIO // MINIMAL
          </span>
          <h1 className="text-xl font-bold uppercase tracking-tight text-[#FFF5ED]">
            {personalInfo.fullName || 'Creator'}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#B89B8D]">
          {personalInfo.availability && (
            <span className="flex items-center gap-1.5 text-[#18A957]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18A957] animate-pulse" />
              {personalInfo.availability}
            </span>
          )}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 lg:px-16 py-20 lg:py-28 max-w-5xl border-b border-[#2D0A0E]">
        <div className="text-xs font-mono uppercase tracking-widest text-[#B89B8D] mb-6">
          {professionalIdentity.jobTitle || personalInfo.professionalTitle || 'Designer & Technologist'}
        </div>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#FFF5ED] leading-[1.05] mb-8">
          {personalInfo.tagline || 'Essential design crafted with surgical precision.'}
        </h2>
        {personalInfo.aboutMe && (
          <p className="text-base sm:text-lg text-[#B89B8D] max-w-2xl font-light leading-relaxed">
            {personalInfo.aboutMe}
          </p>
        )}
      </section>

      {/* Selected Projects List */}
      {projects && projects.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#2D0A0E]">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B89B8D] mb-8">
            01 / SELECTED WORK
          </div>
          <div className="divide-y divide-[#2D0A0E]">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="py-8 group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#1A0507] transition-colors px-4 -mx-4 rounded-xl">
                <div className="space-y-2 max-w-xl">
                  <div className="text-[10px] font-mono text-[#B89B8D] uppercase tracking-widest">
                    {proj.category} • {proj.client || 'STUDIO'}
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors flex items-center gap-2">
                    <span>{proj.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#FED7B8]" />
                  </h3>
                  <p className="text-xs text-[#B89B8D] font-light leading-relaxed">
                    {proj.description}
                  </p>
                </div>
                {proj.thumbnail && (
                  <div className="relative w-full md:w-56 h-36 rounded-lg overflow-hidden border border-[#2D0A0E] shrink-0">
                    <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Strip */}
      {skills && skills.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#2D0A0E]">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B89B8D] mb-6">
            02 / COMPETENCIES
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((s, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-md border border-[#2D0A0E] text-xs font-mono text-[#FED7B8]">
                {s.name} <span className="text-[#6E4249]">[{s.category}]</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#2D0A0E]">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B89B8D] mb-8">
            03 / EXPERIENCE
          </div>
          <div className="space-y-6 max-w-3xl">
            {experience.map((exp, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#1E0507] pb-6">
                <div>
                  <h4 className="text-base font-bold text-[#FFF5ED]">{exp.role}</h4>
                  <div className="text-xs font-mono text-[#FED7B8]">{exp.company}</div>
                </div>
                <div className="text-xs font-mono text-[#B89B8D]">
                  {exp.startDate} — {exp.currentPosition ? 'Present' : exp.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6E4249]">
        <div>{personalInfo.fullName} • NATURESTUDIOS PLATFORM</div>
        {personalInfo.publicEmail && (
          <a href={`mailto:${personalInfo.publicEmail}`} className="text-[#FED7B8] hover:underline">
            {personalInfo.publicEmail}
          </a>
        )}
      </footer>
    </div>
  );
}
