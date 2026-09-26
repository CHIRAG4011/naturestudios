'use client';

import React, { useState } from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { ExternalLink, Play, Sparkles, MapPin, CheckCircle2, X, Film } from 'lucide-react';

export function CinematicTheme({ portfolio }: { portfolio: PortfolioData }) {
  const { personalInfo, professionalIdentity, skills, projects, services, socialLinks } = portfolio;
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] selection:bg-[#38BDF8] selection:text-[#1E40AF] font-sans relative overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radial from-[#2563EB]/50 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between px-6 py-4 rounded-full bg-[#0B132B]/80 backdrop-blur-md border border-[#1E3A8A]">
        <div className="font-extrabold tracking-widest text-sm uppercase text-[#38BDF8]">
          {personalInfo.fullName}
        </div>
        <div className="text-xs font-mono tracking-widest uppercase text-[#94A3B8] hidden sm:block">
          {personalInfo.professionalTitle || 'Creative Reel & Portfolio'}
        </div>
        {personalInfo.availability && (
          <span className="flex items-center gap-2 text-xs font-mono text-[#18A957]">
            <span className="w-2 h-2 rounded-full bg-[#18A957] animate-ping" />
            <span>Available for Booking</span>
          </span>
        )}
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 lg:px-20 max-w-6xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E40AF] border border-[#1E3A8A] text-xs font-mono uppercase text-[#38BDF8] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{professionalIdentity?.jobTitle || 'Motion Designer & VFX Artist'}</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-gradient-warm leading-none mb-8">
          {personalInfo.tagline || 'Crafting Worlds In Motion.'}
        </h1>
        {personalInfo.aboutMe && (
          <p className="text-lg lg:text-2xl text-[#7DD3FC] font-light max-w-3xl leading-relaxed">
            {personalInfo.aboutMe}
          </p>
        )}
      </section>

      {/* Featured Reel / Projects */}
      {projects && projects.length > 0 && (
        <section className="px-6 lg:px-20 py-24 border-t border-[#172554]">
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="text-xs font-mono text-[#38BDF8] tracking-widest uppercase block mb-2">
                Cinematic Reel & Visuals
              </span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase">Featured Works</h2>
            </div>
            <div className="text-xs font-mono text-[#94A3B8]">
              SHOWCASE // 0{projects.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="group relative rounded-2xl overflow-hidden border border-[#1E3A8A] bg-[#0B132B] transition-all duration-500 hover:border-[#38BDF8] hover:shadow-glow-burgundy"
              >
                {proj.thumbnail && (
                  <div
                    onClick={() => {
                      if (proj.workType === 'VFX' && (proj.projectUrl || proj.thumbnail)) {
                        setSelectedVideo(proj.projectUrl || proj.thumbnail || null);
                      }
                    }}
                    className={`aspect-[16/10] overflow-hidden relative ${
                      proj.workType === 'VFX' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {proj.workType ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#030712]/80 backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/30">
                          {proj.workType === 'GFX' && proj.gfxCategory ? `GFX • ${proj.gfxCategory}` : proj.workType}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-[#38BDF8]">
                          {proj.category}
                        </span>
                      )}
                    </div>

                    {/* Play Button for VFX */}
                    {proj.workType === 'VFX' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#38BDF8] text-[#030712] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-8">
                  <div className="text-xs font-mono text-[#38BDF8] uppercase tracking-widest mb-2">
                    {proj.category} {proj.client && `• ${proj.client}`}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold uppercase text-[#F8FAFC] mb-3 group-hover:text-[#38BDF8] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8] line-clamp-3 mb-6">
                    {proj.description}
                  </p>
                  <div className="flex items-center gap-4">
                    {proj.workType === 'VFX' && (proj.projectUrl || proj.thumbnail) && (
                      <button
                        onClick={() => setSelectedVideo(proj.projectUrl || proj.thumbnail || null)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-xs font-mono tracking-wider uppercase text-[#38BDF8] border border-[#38BDF8]/30 transition-all shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch VFX Reel</span>
                      </button>
                    )}
                    {proj.projectUrl && proj.workType !== 'VFX' && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#38BDF8] hover:underline"
                      >
                        Explore Project <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services & Toolkit */}
      {services && services.length > 0 && (
        <section className="px-6 lg:px-20 py-24 border-t border-[#172554] bg-[#050B17]">
          <h2 className="text-3xl lg:text-5xl font-black uppercase mb-12">Creative Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-[#0F1D38] border border-[#1E3A8A]">
                <div className="text-xs font-mono text-[#38BDF8] mb-3">0{idx + 1}</div>
                <h3 className="text-xl font-bold uppercase text-[#F8FAFC] mb-2">{srv.name}</h3>
                <p className="text-sm text-[#94A3B8]">{srv.description}</p>
                {srv.startingPrice && (
                  <div className="text-sm font-mono text-[#38BDF8] mt-4">From {srv.startingPrice}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 lg:px-20 py-16 border-t border-[#172554] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono uppercase text-[#94A3B8]">
        <div>© {new Date().getFullYear()} {personalInfo.fullName}. Powered by NatureStudios.</div>
        <div className="flex gap-6">
          {socialLinks.twitter && <a href={socialLinks.twitter} className="hover:text-[#38BDF8]">Twitter</a>}
          {socialLinks.linkedin && <a href={socialLinks.linkedin} className="hover:text-[#38BDF8]">LinkedIn</a>}
          {socialLinks.github && <a href={socialLinks.github} className="hover:text-[#38BDF8]">GitHub</a>}
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
