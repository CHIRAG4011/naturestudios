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
    <div className="min-h-screen bg-[#050B17] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-[#38BDF8]">
      {/* Top Editorial Masthead */}
      <header className="border-b border-[#172554] py-6 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#38BDF8] font-mono block">
            NatureStudios Creator Index • Folio 2026
          </span>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[#F8FAFC] uppercase">
            {personalInfo.fullName || 'Creator'}
          </h1>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono tracking-widest uppercase text-[#94A3B8]">
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
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
      <section className="px-6 lg:px-16 py-16 lg:py-24 border-b border-[#172554]">
        <div className="max-w-5xl">
          <div className="inline-block px-3 py-1 bg-[#0F1D38] border border-[#1E3A8A] rounded text-[#38BDF8] text-[11px] font-mono uppercase tracking-widest mb-6">
            {professionalIdentity.jobTitle || personalInfo.professionalTitle || 'Creative Director & Designer'}
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] uppercase text-gradient-warm mb-8">
            {personalInfo.tagline || 'Design Built For Impact & Competition.'}
          </h2>
          {personalInfo.aboutMe && (
            <p className="text-lg lg:text-xl text-[#7DD3FC] leading-relaxed max-w-3xl font-light">
              {personalInfo.aboutMe}
            </p>
          )}
        </div>
      </section>

      {/* Selected Projects */}
      {projects && projects.length > 0 && (
        <section className="px-6 lg:px-16 py-16 border-b border-[#172554]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.25em] font-mono text-[#38BDF8] uppercase block mb-1">
                Selected Works
              </span>
              <h3 className="text-3xl lg:text-4xl font-black uppercase">Projects & Highlights</h3>
            </div>
            <span className="text-sm font-mono text-[#94A3B8]">01 — {String(projects.length).padStart(2, '0')}</span>
          </div>

          <div className="space-y-12">
            {projects.map((proj, idx) => (
              <article
                key={proj.id || idx}
                className="group border border-[#172554] hover:border-[#38BDF8] transition-colors duration-300 p-8 lg:p-12 rounded-xl bg-[#0B132B] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#38BDF8] mb-3">
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span>•</span>
                    {proj.workType ? (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#172554] text-[#38BDF8] border border-[#38BDF8]/30">
                        {proj.workType === 'GFX' && proj.gfxCategory ? `GFX • ${proj.gfxCategory}` : proj.workType}
                      </span>
                    ) : (
                      <span className="uppercase">{proj.category}</span>
                    )}
                    {proj.client && <span>• Client: {proj.client}</span>}
                  </div>
                  <h4 className="text-2xl lg:text-4xl font-bold uppercase tracking-tight text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors mb-4">
                    {proj.title}
                  </h4>
                  <p className="text-[#94A3B8] text-sm lg:text-base leading-relaxed mb-6">
                    {proj.description}
                  </p>
                  {proj.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono uppercase px-2.5 py-1 bg-[#050B17] border border-[#172554] text-[#7DD3FC] rounded"
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
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-xs font-mono tracking-wider uppercase text-[#38BDF8] border border-[#38BDF8]/30 transition-all shadow-sm"
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
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#38BDF8] hover:underline"
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
                    className={`lg:col-span-5 aspect-video overflow-hidden rounded-lg border border-[#172554] bg-[#030712] relative ${
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
                        <div className="w-12 h-12 rounded-full bg-[#38BDF8] text-[#050B17] flex items-center justify-center shadow-lg">
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
      <section className="px-6 lg:px-16 py-16 border-b border-[#172554] grid grid-cols-1 lg:grid-cols-2 gap-12">
        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#38BDF8]" /> Capabilities & Toolkit
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-[#0F1D38] border border-[#1E3A8A] rounded-lg text-sm text-[#F8FAFC] flex items-center gap-2"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase">({s.experienceLevel})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#38BDF8]" /> Experience & Background
            </h3>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-[#1E3A8A] pl-4 py-1">
                  <div className="text-xs font-mono text-[#38BDF8] uppercase">
                    {exp.startDate} — {exp.currentPosition ? 'Present' : exp.endDate || 'Present'}
                  </div>
                  <div className="text-lg font-bold text-[#F8FAFC]">{exp.role}</div>
                  <div className="text-sm text-[#94A3B8]">{exp.company}</div>
                  {exp.description && <p className="text-xs text-[#7DD3FC] mt-2 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Contact & Socials */}
      <footer className="px-6 lg:px-16 py-16 bg-[#030712] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#94A3B8] block mb-1">
            Get In Touch
          </span>
          <h4 className="text-2xl font-bold uppercase text-[#38BDF8]">
            {personalInfo.publicEmail || 'hello@naturestudio.in'}
          </h4>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest">
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="text-[#7DD3FC] hover:text-[#38BDF8]">
              X / Twitter
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-[#7DD3FC] hover:text-[#38BDF8]">
              LinkedIn
            </a>
          )}
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-[#7DD3FC] hover:text-[#38BDF8]">
              GitHub
            </a>
          )}
          {socialLinks.behance && (
            <a href={socialLinks.behance} target="_blank" rel="noreferrer" className="text-[#7DD3FC] hover:text-[#38BDF8]">
              Behance
            </a>
          )}
        </div>
      </footer>

      {/* VFX Video Playback Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#050B17] border border-[#2563EB] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#172554]">
              <span className="font-mono text-xs uppercase text-[#38BDF8] flex items-center gap-2">
                <Film className="w-4 h-4" />
                VFX Reel Presentation
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-[#030712] border border-[#172554] flex items-center justify-center text-[#94A3B8] hover:text-white"
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
