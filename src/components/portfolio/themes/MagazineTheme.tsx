'use client';

import React from 'react';
import { PortfolioData } from '@/lib/portfolio-service';
import { BookOpen, MapPin } from 'lucide-react';
import Image from 'next/image';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

/**
 * 07 — Magazine Portfolio Theme
 * Multi-column editorial spread, volume/issue headers,
 * large pull quotes, and editorial styling.
 */
export function MagazineTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, experience } = portfolio;

  return (
    <div className="min-h-screen bg-[#1F070A] text-[#FFF5ED] font-serif selection:bg-[#59171B] selection:text-[#FED7B8]">
      {/* Magazine Issue Bar */}
      <div className="border-b border-[#3D0D13] py-3 px-6 lg:px-12 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.25em] text-[#FED7B8]">
        <span>ISSUE NO. 01 // VOL. 2026</span>
        <span>{personalInfo.location || 'WORLDWIDE'}</span>
        <span>CREATIVE FOLIO</span>
      </div>

      {/* Main Magazine Header */}
      <header className="py-16 px-6 lg:px-12 text-center border-b border-[#3D0D13]">
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-[#FFF5ED] mb-4">
          {personalInfo.fullName || 'THE CREATOR'}
        </h1>
        <div className="text-xs font-mono uppercase tracking-widest text-[#FED7B8] max-w-xl mx-auto">
          {professionalIdentity.jobTitle || 'PORTFOLIO CHRONICLE & CASE STUDIES'}
        </div>
      </header>

      {/* Editorial Spread Grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Bio & Pull Quote */}
        <div className="lg:col-span-4 space-y-8 border-b lg:border-b-0 lg:border-r border-[#3D0D13] pr-0 lg:pr-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-[#FED7B8] tracking-widest">
              {'//'} PROFILE ESSAY
            </span>
            <blockquote className="text-2xl lg:text-3xl font-bold leading-tight text-[#FFF5ED] italic">
              &ldquo;{personalInfo.tagline || 'Design is not what it looks like, it is how it performs in the arena.'}&rdquo;
            </blockquote>
            {personalInfo.aboutMe && (
              <p className="text-sm font-sans text-[#D4B39B] leading-relaxed font-light">
                {personalInfo.aboutMe}
              </p>
            )}
          </div>

          {skills && skills.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[#3D0D13]">
              <span className="text-xs font-mono uppercase text-[#FED7B8] tracking-widest">
                DISCIPLINE INDEX
              </span>
              <ul className="space-y-1.5 font-sans text-xs text-[#FFF5ED]">
                {skills.map((s, idx) => (
                  <li key={idx} className="flex justify-between border-b border-[#2D0A0E] py-1">
                    <span>{s.name}</span>
                    <span className="font-mono text-[#B89B8D]">{s.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Case Studies Spread */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center justify-between border-b border-[#3D0D13] pb-3 text-xs font-mono text-[#B89B8D]">
            <span>FEATURED ARTICLES & WORKS</span>
            <span>{projects?.length || 0} ENTRIES</span>
          </div>

          <div className="space-y-12">
            {projects?.map((proj, idx) => (
              <article key={proj.id || idx} className="space-y-4 border-b border-[#3D0D13] pb-10">
                <div className="flex items-center justify-between text-xs font-mono text-[#FED7B8]">
                  <span>ARTICLE {'//'} 0{idx + 1}</span>
                  <span>{proj.category}</span>
                </div>
                <h3 className="text-3xl font-bold text-[#FFF5ED] uppercase">
                  {proj.title}
                </h3>
                {proj.thumbnail && (
                  <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-[#3D0D13]">
                    <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                  </div>
                )}
                <p className="text-sm font-sans text-[#D4B39B] leading-relaxed font-light">
                  {proj.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[#3D0D13] text-center text-xs font-mono text-[#B89B8D]">
        {personalInfo.fullName} • MAGAZINE THEME • NATURESTUDIOS PLATFORM
      </footer>
    </div>
  );
}
