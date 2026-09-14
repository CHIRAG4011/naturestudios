'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { ExternalLink, Play, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export function CinematicTheme({ portfolio }: { portfolio: PortfolioData }) {
  const { personalInfo, professionalIdentity, skills, projects, services, socialLinks } = portfolio;

  return (
    <div className="min-h-screen bg-[#150304] text-[#FFF5ED] selection:bg-[#FED7B8] selection:text-[#3A0E11] font-sans relative overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radial from-[#59171B]/50 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between px-6 py-4 rounded-full bg-[#240709]/80 backdrop-blur-md border border-[#52141A]">
        <div className="font-extrabold tracking-widest text-sm uppercase text-[#FED7B8]">
          {personalInfo.fullName}
        </div>
        <div className="text-xs font-mono tracking-widest uppercase text-[#B89B8D] hidden sm:block">
          {personalInfo.professionalTitle || 'Creative Reel & Portfolio'}
        </div>
        {personalInfo.availability && (
          <span className="flex items-center gap-2 text-xs font-mono text-[#18A957]">
            <span className="w-2 h-2 rounded-full bg-[#18A957] animate-ping" />
            {personalInfo.availability}
          </span>
        )}
      </header>

      {/* Full-Screen Immersive Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 lg:px-20 pt-28 pb-16 relative z-10">
        <div className="max-w-6xl">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FED7B8] mb-6">
            <span className="px-3 py-1 bg-[#3A0E11] rounded-full border border-[#6E1D24]">Cinematic Edition</span>
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.88] text-gradient-warm mb-8">
            {personalInfo.tagline || 'Visual Stories Built For Esports & Culture.'}
          </h1>
          {personalInfo.aboutMe && (
            <p className="text-lg lg:text-2xl text-[#E8C5A5] font-light max-w-4xl leading-relaxed">
              {personalInfo.aboutMe}
            </p>
          )}
        </div>
      </section>

      {/* Cinematic Project Reel */}
      {projects && projects.length > 0 && (
        <section className="px-6 lg:px-20 py-24 border-t border-[#3D0D13]">
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="text-xs font-mono text-[#FED7B8] tracking-widest uppercase block mb-2">
                Cinematic Reel
              </span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase">Featured Works</h2>
            </div>
            <div className="text-xs font-mono text-[#B89B8D]">
              SHOWCASE // 0{projects.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="group relative rounded-2xl overflow-hidden border border-[#52141A] bg-[#240709] transition-all duration-500 hover:border-[#FED7B8] hover:shadow-glow-burgundy"
              >
                {proj.thumbnail && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#150304] via-transparent to-transparent opacity-80" />
                  </div>
                )}
                <div className="p-8">
                  <div className="text-xs font-mono text-[#FED7B8] uppercase tracking-widest mb-2">
                    {proj.category} {proj.client && `• ${proj.client}`}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold uppercase text-[#FFF5ED] mb-3 group-hover:text-[#FED7B8] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-[#B89B8D] line-clamp-3 mb-6">
                    {proj.description}
                  </p>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#FED7B8] hover:underline"
                    >
                      Explore Project <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services & Toolkit */}
      {services && services.length > 0 && (
        <section className="px-6 lg:px-20 py-24 border-t border-[#3D0D13] bg-[#1C0507]">
          <h2 className="text-3xl lg:text-5xl font-black uppercase mb-12">Creative Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-[#2D0A0E] border border-[#52141A]">
                <div className="text-xs font-mono text-[#FED7B8] mb-3">0{idx + 1}</div>
                <h3 className="text-xl font-bold uppercase text-[#FFF5ED] mb-2">{srv.name}</h3>
                <p className="text-xs text-[#B89B8D] leading-relaxed mb-4">{srv.description}</p>
                {srv.startingPrice && (
                  <div className="text-sm font-mono text-[#FED7B8]">From {srv.startingPrice}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 lg:px-20 py-16 border-t border-[#3D0D13] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono uppercase text-[#B89B8D]">
        <div>© {new Date().getFullYear()} {personalInfo.fullName}. Powered by NatureStudios.</div>
        <div className="flex gap-6">
          {socialLinks.twitter && <a href={socialLinks.twitter} className="hover:text-[#FED7B8]">Twitter</a>}
          {socialLinks.linkedin && <a href={socialLinks.linkedin} className="hover:text-[#FED7B8]">LinkedIn</a>}
          {socialLinks.github && <a href={socialLinks.github} className="hover:text-[#FED7B8]">GitHub</a>}
        </div>
      </footer>
    </div>
  );
}
