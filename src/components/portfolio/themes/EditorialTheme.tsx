'use client';

import React, { useState } from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { ExternalLink, Mail, MapPin, Globe, Sparkles, Briefcase, Award, Play, X, Film } from 'lucide-react';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

export function EditorialTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, experience, services, socialLinks, contactConfig } = portfolio;
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#1C0507] text-[#FFF5ED] font-sans selection:bg-[#59171B] selection:text-[#FED7B8]">
      {/* Top Editorial Masthead */}
      <header className="border-b border-[#3D0D13] py-6 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FED7B8] font-mono block">
            NatureStudios Creator Index • Folio 2026
          </span>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[#FFF5ED] uppercase">
            {personalInfo.fullName || 'Creator'}
          </h1>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono tracking-widest uppercase text-[#B89B8D]">
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FED7B8]" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.availability && (
            <span className="flex items-center gap-1.5 text-[#18A957]">
              <span className="w-2 h-2 rounded-full bg-[#18A957] animate-pulse" />
              {personalInfo.availability}
            </span>
          )}
        </div>
      </header>

      {/* Hero / Statement */}
      <section className="px-6 lg:px-16 py-16 lg:py-24 border-b border-[#3D0D13]">
        <div className="max-w-5xl">
          <div className="inline-block px-3 py-1 bg-[#2D0A0E] border border-[#52141A] rounded text-[#FED7B8] text-[11px] font-mono uppercase tracking-widest mb-6">
            {professionalIdentity.jobTitle || personalInfo.professionalTitle || 'Creative Director & Designer'}
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] uppercase text-gradient-warm mb-8">
            {personalInfo.tagline || 'Design Built For Impact & Competition.'}
          </h2>
          {personalInfo.aboutMe && (
            <p className="text-lg lg:text-xl text-[#E8C5A5] leading-relaxed max-w-3xl font-light">
              {personalInfo.aboutMe}
            </p>
          )}
        </div>
      </section>

      {/* Selected Projects */}
      {projects && projects.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#3D0D13]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.25em] font-mono text-[#FED7B8] uppercase block mb-1">
                Selected Works
              </span>
              <h3 className="text-3xl lg:text-4xl font-black uppercase">Projects & Highlights</h3>
            </div>
            <span className="text-sm font-mono text-[#B89B8D]">01 — {String(projects.length).padStart(2, '0')}</span>
          </div>

          <div className="space-y-12">
            {projects.map((proj, idx) => (
              <article
                key={proj.id || idx}
                className="group border border-[#3D0D13] hover:border-[#FED7B8] transition-colors duration-300 p-8 lg:p-12 rounded-xl bg-[#240709] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#FED7B8] mb-3">
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span>•</span>
                    {proj.workType ? (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#3D0D13] text-[#FED7B8] border border-[#FED7B8]/30">
                        {proj.workType === 'GFX' && proj.gfxCategory ? `GFX • ${proj.gfxCategory}` : proj.workType}
                      </span>
                    ) : (
                      <span className="uppercase">{proj.category}</span>
                    )}
                    {proj.client && <span>• Client: {proj.client}</span>}
                  </div>
                  <h4 className="text-2xl lg:text-4xl font-bold uppercase tracking-tight text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors mb-4">
                    {proj.title}
                  </h4>
                  <p className="text-[#B89B8D] text-sm lg:text-base leading-relaxed mb-6">
                    {proj.description}
                  </p>
                  {proj.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono uppercase px-2.5 py-1 bg-[#1A0507] border border-[#3D0D13] text-[#E8C5A5] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {proj.workType === 'VFX' && (proj.projectUrl || proj.thumbnail) && (
                      <button
                        onClick={() => setSelectedVideo(proj.projectUrl || proj.thumbnail || null)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#59171B] hover:bg-[#7A2228] text-xs font-mono tracking-wider uppercase text-[#FED7B8] border border-[#FED7B8]/30 transition-all shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Reel</span>
                      </button>
                    )}
                    {proj.projectUrl && proj.workType !== 'VFX' && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#FED7B8] hover:underline"
                      >
                        View Project <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                {proj.thumbnail && (
                  <div
                    onClick={() => {
                      if (proj.workType === 'VFX' && proj.projectUrl) {
                        setSelectedVideo(proj.projectUrl);
                      }
                    }}
                    className={`lg:col-span-5 aspect-video overflow-hidden rounded-lg border border-[#3D0D13] bg-[#150304] relative ${
                      proj.workType === 'VFX' ? 'cursor-pointer group/thumb' : ''
                    }`}
                  >
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {proj.workType === 'VFX' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/thumb:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#FED7B8] text-[#1C0507] flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Experience */}
      <section className="px-6 lg:px-16 py-16 border-b border-[#3D0D13] grid grid-cols-1 lg:grid-cols-2 gap-12">
        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FED7B8]" /> Capabilities & Toolkit
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-[#2D0A0E] border border-[#52141A] rounded-lg text-sm text-[#FFF5ED] flex items-center gap-2"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[10px] font-mono text-[#FED7B8] uppercase">({s.experienceLevel})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FED7B8]" /> Experience & Background
            </h3>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-[#52141A] pl-4 py-1">
                  <div className="text-xs font-mono text-[#FED7B8] uppercase">
                    {exp.startDate} — {exp.currentPosition ? 'Present' : exp.endDate || 'Present'}
                  </div>
                  <div className="text-lg font-bold text-[#FFF5ED]">{exp.role}</div>
                  <div className="text-sm text-[#B89B8D]">{exp.company}</div>
                  {exp.description && <p className="text-xs text-[#E8C5A5] mt-2 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Contact & Socials */}
      <footer className="px-6 lg:px-16 py-16 bg-[#150304] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#B89B8D] block mb-1">
            Get In Touch
          </span>
          <h4 className="text-2xl font-bold uppercase text-[#FED7B8]">
            {personalInfo.publicEmail || 'hello@naturestudio.in'}
          </h4>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest">
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="text-[#E8C5A5] hover:text-[#FED7B8]">
              X / Twitter
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-[#E8C5A5] hover:text-[#FED7B8]">
              LinkedIn
            </a>
          )}
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-[#E8C5A5] hover:text-[#FED7B8]">
              GitHub
            </a>
          )}
          {socialLinks.behance && (
            <a href={socialLinks.behance} target="_blank" rel="noreferrer" className="text-[#E8C5A5] hover:text-[#FED7B8]">
              Behance
            </a>
          )}
        </div>
      </footer>

      {/* VFX Video Playback Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#1C0507] border border-[#59171B] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <span className="font-mono text-xs uppercase text-[#FED7B8] flex items-center gap-2">
                <Film className="w-4 h-4" />
                VFX Reel Presentation
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-[#150304] border border-[#3D0D13] flex items-center justify-center text-[#B89B8D] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {selectedVideo.includes('youtube.com') || selectedVideo.includes('youtu.be') ? (
                <iframe
                  src={
                    selectedVideo.includes('watch?v=')
                      ? selectedVideo.replace('watch?v=', 'embed/')
                      : selectedVideo.replace('youtu.be/', 'www.youtube.com/embed/')
                  }
                  title="VFX Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedVideo.includes('vimeo.com') ? (
                <iframe
                  src={selectedVideo.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  title="VFX Video"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
