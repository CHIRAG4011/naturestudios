'use client';

import React from 'react';
import type { PortfolioData } from '@/lib/portfolio-shared';
import {
  ExternalLink,
  MapPin,
  Sparkles,
  Layers,
  ArrowUpRight,
  Sliders,
  Mail,
  Calendar,
  Briefcase,
  CheckCircle2,
  Award,
  GraduationCap,
} from 'lucide-react';

interface CustomThemeProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

export function CustomTheme({ portfolio, isEmbed }: CustomThemeProps) {
  const {
    personalInfo,
    professionalIdentity,
    skills,
    projects,
    experience,
    education,
    certifications,
    services,
    socialLinks,
    designConfig,
  } = portfolio;

  // Custom tokens with intelligent defaults
  const accent = designConfig?.accentColor || '#38BDF8';
  const bgStyle = designConfig?.backgroundStyle || 'dark-burgundy';
  const fontPair = designConfig?.fontPair || 'modern-sans';
  const heroLayout = designConfig?.heroLayout || 'split';
  const projectLayout = designConfig?.projectLayout || 'grid-2';
  const cardStyle = designConfig?.cardStyle || 'glass';
  const visible = designConfig?.visibleSections || {};

  // Background style resolver
  const getBgClass = () => {
    switch (bgStyle) {
      case 'void':
        return 'bg-[#050505] text-[#EDEDED]';
      case 'wine':
        return 'bg-[#2B080C] text-[#F8FAFC]';
      case 'midnight':
        return 'bg-[#070C18] text-[#E2E8F0]';
      case 'forest':
        return 'bg-[#08140E] text-[#E8F5E9]';
      case 'warm-beige':
        return 'bg-[#FAF4EE] text-[#1E0F0A]';
      case 'dark-burgundy':
      default:
        return 'bg-[#030712] text-[#F8FAFC]';
    }
  };

  // Font class resolver
  const getFontFamilyClass = () => {
    switch (fontPair) {
      case 'editorial':
        return 'font-serif';
      case 'brutalist':
        return 'font-mono';
      case 'esports':
        return 'font-sans font-black tracking-tight';
      case 'modern-sans':
      default:
        return 'font-sans';
    }
  };

  // Card style resolver
  const getCardClass = () => {
    const isLight = bgStyle === 'warm-beige';
    switch (cardStyle) {
      case 'bordered':
        return isLight
          ? 'bg-white border-2 border-[#D9C3B0] shadow-sm'
          : 'bg-[#050B17] border-2 border-[#1E3A8A] hover:border-[#38BDF8] transition-colors';
      case 'elevated':
        return isLight
          ? 'bg-white shadow-xl border border-[#EADBCE]'
          : 'bg-[#1E0508] shadow-2xl border border-[#172554] hover:shadow-glow-burgundy transition-all';
      case 'minimal':
        return isLight
          ? 'bg-transparent border-b border-[#E0CEBF]'
          : 'bg-transparent border-b border-[#172554]';
      case 'glass':
      default:
        return isLight
          ? 'bg-white/80 backdrop-blur-md border border-[#EADBCE] shadow-lg'
          : 'bg-[#0B132B]/70 backdrop-blur-md border border-[#1E3A8A]/70 hover:border-[#38BDF8]/40 shadow-xl transition-all';
    }
  };

  const isLight = bgStyle === 'warm-beige';
  const subtextColor = isLight ? 'text-[#6E5549]' : 'text-[#94A3B8]';
  const mutedBorder = isLight ? 'border-[#E5D5C6]' : 'border-[#172554]';

  return (
    <div className={`min-h-screen ${getBgClass()} ${getFontFamilyClass()} relative overflow-hidden selection:bg-[${accent}] selection:text-black`}>
      {/* Dynamic Ambient Color Mesh */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ backgroundColor: accent }}
      />
      <div
        className="absolute bottom-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      {/* Floating Header */}
      <header
        className={`fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3.5 rounded-2xl ${
          isLight
            ? 'bg-white/90 border border-[#E0CEBF] shadow-sm'
            : 'bg-[#050B17]/80 backdrop-blur-xl border border-[#1E3A8A]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: accent }}
          />
          <span className="font-extrabold text-sm uppercase tracking-widest">
            {personalInfo.fullName}
          </span>
          <span
            className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-full border"
            style={{
              borderColor: `${accent}40`,
              color: accent,
              backgroundColor: `${accent}15`,
            }}
          >
            Custom Template
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          {personalInfo.availability && (
            <span className="hidden md:flex items-center gap-1.5 text-[#18A957]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18A957] animate-ping" />
              {personalInfo.availability}
            </span>
          )}
          {personalInfo.publicEmail && (
            <a
              href={`mailto:${personalInfo.publicEmail}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-transform active:scale-95"
              style={{
                backgroundColor: accent,
                color: isLight ? '#FFF' : '#030712',
              }}
            >
              Contact
            </a>
          )}
        </div>
      </header>

      {/* HERO SECTION (Configurable Layout) */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 lg:px-20 pt-28 pb-16 relative z-10 max-w-7xl mx-auto">
        {/* LAYOUT 1: SPLIT */}
        {heroLayout === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border border-current"
                style={{ color: accent }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{personalInfo.professionalTitle || professionalIdentity?.jobTitle || 'Creative Specialist'}</span>
                {personalInfo.location && <span>• {personalInfo.location}</span>}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02]">
                {personalInfo.tagline || personalInfo.fullName}
              </h1>

              {personalInfo.aboutMe && (
                <p className={`text-base lg:text-lg ${subtextColor} leading-relaxed max-w-xl`}>
                  {personalInfo.aboutMe}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {personalInfo.publicEmail && (
                  <a
                    href={`mailto:${personalInfo.publicEmail}`}
                    className="btn-primary text-xs py-3 px-6 rounded-xl uppercase font-mono tracking-wider flex items-center gap-2 shadow-lg"
                    style={{ backgroundColor: accent, color: isLight ? '#FFF' : '#030712' }}
                  >
                    <Mail className="w-4 h-4" /> Start Collaboration
                  </a>
                )}
                {socialLinks?.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn-secondary text-xs py-3 px-5 rounded-xl uppercase font-mono flex items-center gap-2 ${
                      isLight ? 'border-[#CBB29C] text-[#3A1F13]' : ''
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" /> Website
                  </a>
                )}
              </div>
            </div>

            {/* Split Media Column */}
            <div className="lg:col-span-5">
              <div className={`p-4 rounded-3xl ${getCardClass()} relative overflow-hidden group`}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-black/40">
                  <img
                    src={personalInfo.profileImage || personalInfo.coverImage || '/media/hero-lightfield.jpg'}
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-white flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] uppercase opacity-75">PORTFOLIO ENGINE</span>
                      <span className="font-bold uppercase tracking-wider">{personalInfo.fullName}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-bold"
                      style={{ backgroundColor: accent, color: '#000' }}
                    >
                      VERIFIED CREATOR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 2: CENTER-BOLD */}
        {heroLayout === 'center-bold' && (
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {personalInfo.profileImage && (
              <div className="inline-block p-1.5 rounded-full border-2" style={{ borderColor: accent }}>
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.fullName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                />
              </div>
            )}
            <div className="text-xs font-mono uppercase tracking-widest" style={{ color: accent }}>
              {personalInfo.professionalTitle || 'Creative Portfolio'}
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95]">
              {personalInfo.fullName}
            </h1>
            {personalInfo.tagline && (
              <p className={`text-lg sm:text-2xl ${subtextColor} max-w-2xl mx-auto font-light`}>
                {personalInfo.tagline}
              </p>
            )}
            {personalInfo.aboutMe && (
              <p className={`text-sm sm:text-base ${subtextColor} max-w-2xl mx-auto leading-relaxed`}>
                {personalInfo.aboutMe}
              </p>
            )}
            <div className="flex justify-center gap-4 pt-4">
              {personalInfo.publicEmail && (
                <a
                  href={`mailto:${personalInfo.publicEmail}`}
                  className="btn-primary text-xs py-3 px-6 rounded-xl uppercase font-mono tracking-wider flex items-center gap-2"
                  style={{ backgroundColor: accent, color: isLight ? '#FFF' : '#030712' }}
                >
                  <Mail className="w-4 h-4" /> Get In Touch
                </a>
              )}
            </div>
          </div>
        )}

        {/* LAYOUT 3: FULL-BLEED */}
        {heroLayout === 'full-bleed' && (
          <div className={`p-8 sm:p-14 rounded-3xl ${getCardClass()} relative overflow-hidden`}>
            <div className="max-w-3xl space-y-6 relative z-10">
              <span
                className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border inline-block"
                style={{ borderColor: accent, color: accent }}
              >
                FULL-BLEED SHOWCASE
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight">
                {personalInfo.tagline || personalInfo.fullName}
              </h1>
              {personalInfo.aboutMe && (
                <p className={`text-base ${subtextColor} leading-relaxed`}>
                  {personalInfo.aboutMe}
                </p>
              )}
              {personalInfo.publicEmail && (
                <a
                  href={`mailto:${personalInfo.publicEmail}`}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold py-3 px-6 rounded-xl"
                  style={{ backgroundColor: accent, color: isLight ? '#FFF' : '#030712' }}
                >
                  <Mail className="w-4 h-4" /> Start Project With {personalInfo.fullName.split(' ')[0]}
                </a>
              )}
            </div>
          </div>
        )}

        {/* LAYOUT 4: MINIMAL */}
        {heroLayout === 'minimal' && (
          <div className="max-w-4xl space-y-6">
            <div className="text-xs font-mono text-[#8E8E8E] uppercase tracking-widest">
              PORTFOLIO // {personalInfo.fullName.toUpperCase()}
            </div>
            <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-wide leading-tight">
              {personalInfo.tagline || personalInfo.fullName}
            </h1>
            {personalInfo.aboutMe && (
              <p className={`text-sm sm:text-base ${subtextColor} max-w-2xl leading-relaxed`}>
                {personalInfo.aboutMe}
              </p>
            )}
          </div>
        )}
      </section>

      {/* SKILLS SECTION */}
      {visible.skills !== false && skills && skills.length > 0 && (
        <section className={`px-6 lg:px-20 py-20 border-t ${mutedBorder} max-w-7xl mx-auto`}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: accent }}>
                Core Toolset
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase">Skills & Competencies</h2>
            </div>
            <span className="text-xs font-mono uppercase opacity-60">
              {skills.length} DISCIPLINARY AREAS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, idx) => (
              <div key={skill.id || idx} className={`p-4 rounded-xl ${getCardClass()}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm uppercase">{skill.name}</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold"
                    style={{ backgroundColor: `${accent}20`, color: accent }}
                  >
                    {skill.experienceLevel}
                  </span>
                </div>
                {skill.category && (
                  <span className={`text-[11px] font-mono uppercase block ${subtextColor}`}>
                    {skill.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED PROJECTS SECTION (Configurable Layout) */}
      {visible.projects !== false && projects && projects.length > 0 && (
        <section className={`px-6 lg:px-20 py-24 border-t ${mutedBorder} max-w-7xl mx-auto`}>
          <div className="flex items-center justify-between mb-14">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: accent }}>
                Curated Works
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase">Selected Projects</h2>
            </div>
            <span className="text-xs font-mono uppercase opacity-60">
              SHOWCASE // 0{projects.length}
            </span>
          </div>

          {/* PROJECT LAYOUT 1: GRID-2 */}
          {projectLayout === 'grid-2' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className={`rounded-2xl overflow-hidden group ${getCardClass()} flex flex-col`}
                >
                  {proj.thumbnail && (
                    <div className="aspect-[16/10] overflow-hidden relative bg-black/40">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold text-black"
                          style={{ backgroundColor: accent }}
                        >
                          {proj.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-2">
                        {proj.client && <span className={subtextColor}>Client: {proj.client}</span>}
                      </div>
                      <h3 className="text-2xl font-bold uppercase mb-3 group-hover:text-[var(--accent)] transition-colors">
                        {proj.title}
                      </h3>
                      <p className={`text-sm ${subtextColor} leading-relaxed line-clamp-3 mb-6`}>
                        {proj.description}
                      </p>
                    </div>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest font-bold group-hover:underline"
                        style={{ color: accent }}
                      >
                        View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECT LAYOUT 2: MASONRY */}
          {projectLayout === 'masonry' && (
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className={`break-inside-avoid rounded-2xl overflow-hidden group ${getCardClass()}`}
                >
                  {proj.thumbnail && (
                    <div className="overflow-hidden relative bg-black/40">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: accent }}>
                      {proj.category}
                    </span>
                    <h3 className="text-xl font-bold uppercase mb-2">{proj.title}</h3>
                    <p className={`text-xs ${subtextColor} leading-relaxed mb-4`}>{proj.description}</p>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono uppercase font-bold"
                        style={{ color: accent }}
                      >
                        Explore <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECT LAYOUT 3: REEL */}
          {projectLayout === 'reel' && (
            <div className="space-y-8">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className={`p-6 sm:p-10 rounded-3xl ${getCardClass()} grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group`}
                >
                  <div className="lg:col-span-5 aspect-[16/10] rounded-2xl overflow-hidden relative bg-black/40">
                    <img
                      src={proj.thumbnail || '/media/work-nexus-arena.jpg'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded uppercase font-bold text-black" style={{ backgroundColor: accent }}>
                        {proj.category}
                      </span>
                      {proj.client && <span className={subtextColor}>• Client: {proj.client}</span>}
                    </div>
                    <h3 className="text-3xl font-black uppercase">{proj.title}</h3>
                    <p className={`text-sm ${subtextColor} leading-relaxed`}>{proj.description}</p>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold pt-2"
                        style={{ color: accent }}
                      >
                        Launch Project <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECT LAYOUT 4: LIST */}
          {projectLayout === 'list' && (
            <div className={`divide-y ${mutedBorder}`}>
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:pl-2 transition-all"
                >
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest mr-4 opacity-50">
                      0{idx + 1}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold uppercase group-hover:text-current">
                      {proj.title}
                    </span>
                    <span className={`text-xs font-mono uppercase ml-4 ${subtextColor}`}>
                      [{proj.category}]
                    </span>
                  </div>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono uppercase flex items-center gap-1 font-bold"
                      style={{ color: accent }}
                    >
                      View <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SERVICES SECTION */}
      {visible.services !== false && services && services.length > 0 && (
        <section className={`px-6 lg:px-20 py-20 border-t ${mutedBorder} max-w-7xl mx-auto`}>
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: accent }}>
              Client Offerings
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase">Creative Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <div key={svc.id || idx} className={`p-8 rounded-2xl ${getCardClass()}`}>
                <h3 className="text-xl font-bold uppercase mb-3">{svc.name}</h3>
                <p className={`text-xs ${subtextColor} leading-relaxed mb-6`}>{svc.description}</p>
                <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-current/10">
                  {svc.startingPrice && <span className="font-bold" style={{ color: accent }}>From {svc.startingPrice}</span>}
                  {svc.deliveryTime && <span className={subtextColor}>{svc.deliveryTime}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className={`px-6 lg:px-20 py-16 border-t ${mutedBorder} max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono`}>
        <div>
          <span className="font-bold uppercase tracking-wider">{personalInfo.fullName}</span>
          <span className={`block text-[11px] ${subtextColor} mt-0.5`}>
            BUILT WITH NATURESTUDIOS CUSTOM TEMPLATE ENGINE
          </span>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks?.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:underline">
              Twitter
            </a>
          )}
          {socialLinks?.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:underline">
              Instagram
            </a>
          )}
          {socialLinks?.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
          )}
          {socialLinks?.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
