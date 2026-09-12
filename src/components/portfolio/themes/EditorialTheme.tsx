'use client';

import React from 'react';
import { PortfolioData } from '@/lib/portfolio-service';
import { ExternalLink, Mail, MapPin, Globe, Sparkles, Briefcase, Award } from 'lucide-react';

interface ThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

export function EditorialTheme({ portfolio }: ThemeProps) {
  const { personalInfo, professionalIdentity, skills, projects, experience, services, socialLinks, contactConfig } = portfolio;

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
                  <div className="flex items-center gap-3 text-xs font-mono text-[#FED7B8] mb-3">
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span>•</span>
                    <span className="uppercase">{proj.category}</span>
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
                  {proj.projectUrl && (
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
                {proj.thumbnail && (
                  <div className="lg:col-span-5 aspect-video overflow-hidden rounded-lg border border-[#3D0D13] bg-[#150304]">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
    </div>
  );
}
