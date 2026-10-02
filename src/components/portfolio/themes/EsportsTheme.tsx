'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { Shield, Zap, Target, Trophy, ExternalLink, Activity } from 'lucide-react';

export function EsportsTheme({ portfolio }: { portfolio: PortfolioData }) {
  const { personalInfo, professionalIdentity, skills, projects, experience, services, socialLinks } = portfolio;

  return (
    <div className="min-h-screen bg-[#110204] text-[#FFF5ED] font-mono selection:bg-[#E63946] selection:text-white relative">
      {/* HUD Header Bar */}
      <div className="border-b border-[#52141A] bg-[#1C0507] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="badge-live">LIVE / READY</span>
          <span className="text-[#FED7B8] font-bold tracking-widest uppercase">
            CALLSIGN // {personalInfo.username || personalInfo.fullName}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[#B89B8D]">
          <span>STATUS: ONLINE</span>
          <span>ROLE: {professionalIdentity.primaryRole || 'ESPORTS CREATIVE'}</span>
        </div>
      </div>

      {/* Hero Arena */}
      <section className="px-6 lg:px-16 py-20 border-b border-[#3D0D13]">
        <div className="max-w-6xl">
          <div className="text-xs text-[#E63946] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> COMPETITIVE CREATIVE ARCHITECTURE
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-[#FFF5ED] mb-6">
            {personalInfo.fullName}
          </h1>
          <p className="text-xl lg:text-3xl text-[#FED7B8] uppercase font-bold tracking-wide mb-8">
            {personalInfo.tagline || 'BROADCAST GRAPHICS • ARENA MOTION • BRAND WARFARE'}
          </p>
          {personalInfo.aboutMe && (
            <div className="p-6 bg-[#240709] border-l-4 border-[#E63946] text-sm text-[#E8C5A5] leading-relaxed max-w-3xl">
              {personalInfo.aboutMe}
            </div>
          )}
        </div>
      </section>

      {/* Tournament Works */}
      {projects && projects.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#3D0D13]">
          <div className="flex items-center gap-3 mb-10 text-xs tracking-widest uppercase text-[#FED7B8]">
            <Trophy className="w-4 h-4 text-[#E63946]" /> MATCH ARCHIVE // SELECTED PRODUCTIONS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="bg-[#1C0507] border border-[#52141A] hover:border-[#E63946] transition-all p-6 relative group"
              >
                <div className="text-[10px] text-[#E63946] mb-2 uppercase">
                  OPS // {String(idx + 1).padStart(2, '0')} • {proj.category}
                </div>
                {proj.thumbnail && (
                  <div className="aspect-video mb-4 overflow-hidden bg-black border border-[#3D0D13]">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold uppercase text-[#FFF5ED] mb-2 group-hover:text-[#FED7B8]">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#B89B8D] line-clamp-3 mb-4">{proj.description}</p>
                {proj.projectUrl && (
                  <a
                    href={proj.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#FED7B8] hover:text-[#E63946] uppercase"
                  >
                    DEPLOY REPORT <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Matrix */}
      {skills && skills.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#3D0D13] bg-[#150304]">
          <div className="flex items-center gap-3 mb-8 text-xs tracking-widest uppercase text-[#FED7B8]">
            <Target className="w-4 h-4 text-[#E63946]" /> WEAPONS & CAPABILITIES
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="p-4 bg-[#240709] border border-[#3D0D13]">
                <div className="text-sm font-bold text-[#FFF5ED] uppercase">{skill.name}</div>
                <div className="text-[10px] text-[#FED7B8] uppercase mt-1">LVL: {skill.experienceLevel}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#7A6158]">
        <div>MISSION TERMINATED. NATURESTUDIOS PROTOCOL.</div>
        <div>{personalInfo.publicEmail}</div>
      </footer>
    </div>
  );
}
