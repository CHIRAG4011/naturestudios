'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactTicketModal } from '@/components/portfolio/ContactTicketModal';
import {
  Trophy,
  Users,
  Bookmark,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Maximize2,
  X,
  Send,
  LayoutList,
  LayoutGrid,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Film,
  Eye,
  Shirt,
} from 'lucide-react';
import type { GfxSubsection } from '@/lib/portfolio-shared';
import {
  DEFAULT_COMMUNITY_PORTFOLIO_ITEMS,
  GFX_SUBSECTIONS,
  fromGfxCategorySlug,
  toGfxCategorySlug,
} from '@/lib/portfolio-shared';

interface GlobalCreatorCard {
  id: string;
  userId?: string;
  userEmail?: string;
  portfolioSource: 'user';
  slug: string;
  title: string;
  description: string;
  category: 'GFX' | 'VFX' | 'Other';
  gfxSubcategory?: GfxSubsection;
  customCategory?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaGallery?: string[];
  themeId: string;
  name: string;
  username: string;
  avatar?: string;
  tagline?: string;
  role: string;
  location?: string;
  availability?: string;
  skills: string[];
  projectCount: number;
  publishedAt: string;
  subdomainUrl: string;
  directUrl: string;
}

export default function GlobalGfxCategoryPortfoliosPage() {
  const params = useParams();
  const router = useRouter();
  const rawCategory = params?.category as string;

  // Resolve category name (e.g. tournament -> Tournament)
  const categoryName: GfxSubsection = useMemo(() => {
    return fromGfxCategorySlug(rawCategory) || 'Tournament';
  }, [rawCategory]);

  const [creators, setCreators] = useState<GlobalCreatorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<{
    imageUrl: string;
    title: string;
    creatorName: string;
  } | null>(null);
  const [contactTargetCreator, setContactTargetCreator] = useState<GlobalCreatorCard | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/portfolio/global?category=GFX&subcategory=${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolios && data.portfolios.length > 0) {
          setCreators(data.portfolios);
        } else {
          // Fallback to sample community items
          const filtered = DEFAULT_COMMUNITY_PORTFOLIO_ITEMS.filter((c) => {
            if (c.category !== 'GFX') return false;
            const normItem = c.gfxSubcategory?.toLowerCase().replace(/[^a-z]/g, '');
            const normTarget = categoryName.toLowerCase().replace(/[^a-z]/g, '');
            return normItem?.includes(normTarget) || normTarget?.includes(normItem || '');
          }).map((p) => ({
            id: p.id,
            userId: p.userId,
            userEmail: p.personalInfo?.publicEmail,
            portfolioSource: 'user' as const,
            slug: p.slug,
            title: p.title,
            description: p.description || p.personalInfo?.aboutMe || '',
            category: p.category || 'GFX',
            gfxSubcategory: p.gfxSubcategory,
            mediaType: p.mediaType || 'image',
            mediaUrl: p.mediaUrl || p.mediaGallery?.[0] || '/media/work-valorant-championship.jpg',
            mediaGallery: p.mediaGallery,
            themeId: p.themeId,
            name: p.personalInfo?.fullName || p.title,
            username: p.personalInfo?.username || p.slug,
            avatar: p.personalInfo?.profileImage,
            tagline: p.personalInfo?.tagline,
            role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'Creator',
            location: p.personalInfo?.location,
            availability: p.personalInfo?.availability,
            skills: (p.skills || []).map((s) => s.name),
            projectCount: (p.projects || []).length,
            publishedAt: p.publishedAt || p.createdAt,
            subdomainUrl: `https://${p.slug}.naturestudio.in`,
            directUrl: `/global-portfolio/${p.slug}`,
          }));
          setCreators(filtered);
        }
      })
      .catch(() => {
        const filtered = DEFAULT_COMMUNITY_PORTFOLIO_ITEMS.filter((c) => {
          if (c.category !== 'GFX') return false;
          const normItem = c.gfxSubcategory?.toLowerCase().replace(/[^a-z]/g, '');
          const normTarget = categoryName.toLowerCase().replace(/[^a-z]/g, '');
          return normItem?.includes(normTarget) || normTarget?.includes(normItem || '');
        }).map((p) => ({
          id: p.id,
          userId: p.userId,
          userEmail: p.personalInfo?.publicEmail,
          portfolioSource: 'user' as const,
          slug: p.slug,
          title: p.title,
          description: p.description || p.personalInfo?.aboutMe || '',
          category: p.category || 'GFX',
          gfxSubcategory: p.gfxSubcategory,
          mediaType: p.mediaType || 'image',
          mediaUrl: p.mediaUrl || p.mediaGallery?.[0] || '/media/work-valorant-championship.jpg',
          mediaGallery: p.mediaGallery,
          themeId: p.themeId,
          name: p.personalInfo?.fullName || p.title,
          username: p.personalInfo?.username || p.slug,
          avatar: p.personalInfo?.profileImage,
          tagline: p.personalInfo?.tagline,
          role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'Creator',
          location: p.personalInfo?.location,
          availability: p.personalInfo?.availability,
          skills: (p.skills || []).map((s) => s.name),
          projectCount: (p.projects || []).length,
          publishedAt: p.publishedAt || p.createdAt,
          subdomainUrl: `https://${p.slug}.naturestudio.in`,
          directUrl: `/global-portfolio/${p.slug}`,
        }));
        setCreators(filtered);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  const categoryMeta: Record<
    string,
    { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    Tournament: {
      title: 'Tournament Graphics',
      desc: 'Esports tournament posters, schedule overlays, bracket graphics, stage key visuals, and stream packaging created by verified community creators.',
      icon: Trophy,
    },
    Roster: {
      title: 'Team & Roster Lineups',
      desc: 'Squad announcements, player cards, contract signings, pro esports starting 5 reveals, and team lineup graphics created by global designers.',
      icon: Users,
    },
    Thumbnail: {
      title: 'Thumbnails & Media Covers',
      desc: 'High-CTR YouTube thumbnails and live broadcast stream covers designed by independent community visual creators.',
      icon: Bookmark,
    },
    'Logo/Banner': {
      title: 'Logos & Server Banners',
      desc: 'Esports emblems, mascot vector logos, Twitch banners, and Twitter/X headers created by community branding artists.',
      icon: Zap,
    },
    Jersey: {
      title: 'Jersey & Apparel Design',
      desc: 'Custom competitive esports jerseys, player uniforms, hoodie graphics, and pro team apparel mocks designed by community visual artists.',
      icon: Shirt,
    },
  };

  const currentMeta = categoryMeta[categoryName] || categoryMeta['Tournament'];

  const handleCopySubdomain = (url: string, slug: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* BREADCRUMB NAVIGATION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#172554]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <Link href="/global-portfolio" className="hover:text-[#38BDF8] transition-colors">
                Global Portfolio
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <Link href="/global-portfolio/gfx" className="hover:text-[#38BDF8] transition-colors">
                GFX Topics
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span className="text-[#F8FAFC] font-bold">{categoryName}</span>
            </div>

            <Link
              href="/global-portfolio/gfx"
              className="px-3.5 py-1.5 rounded-xl bg-[#070D1E] hover:bg-[#0E1A33] border border-[#172554] hover:border-[#38BDF8]/40 text-xs font-mono uppercase text-[#38BDF8] inline-flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All GFX Topics</span>
            </Link>
          </div>
        </section>

        {/* HEADER & TOPIC METADATA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#172554]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1A33] border border-[#1E3A8A] text-xs font-mono uppercase text-[#38BDF8] mb-3">
                <currentMeta.icon className="w-3.5 h-3.5" />
                <span>Community Creator Topic</span>
              </div>
              <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                {currentMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mt-3 leading-relaxed">
                {currentMeta.desc}
              </p>
            </div>

            {/* Quick Switch Subsections Pills */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#070D1E] rounded-2xl border border-[#172554]">
              {GFX_SUBSECTIONS.map((sub) => {
                const isCurrent =
                  categoryName === sub ||
                  (sub.startsWith('Logo') && categoryName.startsWith('Logo'));
                return (
                  <Link
                    key={sub}
                    href={`/global-portfolio/gfx/${toGfxCategorySlug(sub)}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-colors ${
                      isCurrent
                        ? 'bg-[#2563EB] text-[#38BDF8] font-bold border border-[#38BDF8]/30 shadow-sm'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
                    }`}
                  >
                    {sub}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMMUNITY PORTFOLIOS LIST SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Toolbar: Creator Count & View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#172554]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F8FAFC] font-syne flex items-center gap-2">
                <span>Community {categoryName} Portfolios</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#0B132B] border border-[#1E3A8A] text-[#38BDF8]">
                  {creators.length} {creators.length === 1 ? 'Creator' : 'Creators'}
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                All community creators specializing in {categoryName.toLowerCase()} graphics. Click any portfolio to view full details.
              </p>
            </div>

            {/* View Mode Toggle: List vs Grid */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070D1E] border border-[#172554] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#2563EB] text-[#38BDF8] font-bold border border-[#38BDF8]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#2563EB] text-[#38BDF8] font-bold border border-[#38BDF8]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-xs font-mono text-[#94A3B8]">
              Loading {categoryName} Portfolios...
            </div>
          ) : creators.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#070D1E] border border-[#172554] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#0E1A33] text-[#38BDF8] flex items-center justify-center mx-auto mb-3">
                <currentMeta.icon className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-lg font-bold text-[#F8FAFC] mb-1">
                No creator portfolios found in {categoryName} yet.
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mb-4">
                Be the first creator to publish your work in this category and get featured on the NatureStudios Global Directory!
              </p>
              <Link
                href="/portfolio/edit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-xs font-mono uppercase text-[#38BDF8] font-bold shadow-lg inline-block"
              >
                Publish Your Portfolio
              </Link>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST TYPE VIEW */
            <div className="space-y-6">
              {creators.map((creator) => (
                <article
                  key={creator.id}
                  className="group rounded-3xl overflow-hidden bg-[#070D1E] border border-[#172554] hover:border-[#38BDF8] transition-all duration-300 hover:shadow-glow-burgundy flex flex-col md:flex-row"
                >
                  {/* Media Thumbnail */}
                  <Link
                    href={`/global-portfolio/${creator.slug}`}
                    className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#030712] block cursor-pointer group/thumb"
                  >
                    <img
                      src={creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 brightness-95 group-hover/thumb:brightness-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#030712]/90 backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/30">
                        {creator.gfxSubcategory || categoryName}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-[#030712]/90 text-[#38BDF8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#38BDF8]/40 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Dedicated Portfolio</span>
                      </span>
                    </div>
                  </Link>

                  {/* Creator Content & Actions */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      {/* Masthead */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0E1A33] border border-[#1E3A8A] overflow-hidden flex-shrink-0 flex items-center justify-center font-syne font-bold text-xs text-[#38BDF8]">
                            {creator.avatar ? (
                              <img
                                src={creator.avatar}
                                alt={creator.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              creator.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-syne font-bold text-sm text-[#F8FAFC]">
                                {creator.name}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[9px] font-mono uppercase text-emerald-300">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Verified Creator</span>
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[#94A3B8] block">
                              {creator.role} {creator.location ? `• ${creator.location}` : ''}
                            </span>
                          </div>
                        </div>

                        {creator.availability && (
                          <span className="text-[10px] font-mono text-[#38BDF8] px-2.5 py-1 rounded-full bg-[#0E1A33] border border-[#1E3A8A]">
                            {creator.availability}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <Link
                          href={`/global-portfolio/${creator.slug}`}
                          className="block group-hover:text-[#38BDF8] transition-colors"
                        >
                          <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#F8FAFC]">
                            {creator.title}
                          </h3>
                        </Link>
                        {creator.tagline && (
                          <p className="text-xs text-[#38BDF8]/80 italic mt-0.5">
                            &quot;{creator.tagline}&quot;
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {creator.description && (
                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                          {creator.description}
                        </p>
                      )}

                      {/* Skills Tags */}
                      {creator.skills && creator.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {creator.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#030712] border border-[#172554] text-[#94A3B8]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-[#172554]/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/global-portfolio/${creator.slug}`}
                          className="btn-primary text-xs py-2 px-4 shadow-glow-burgundy inline-flex items-center gap-2"
                        >
                          <span>View Dedicated Portfolio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setContactTargetCreator(creator)}
                          className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-[#38BDF8]" />
                          <span>Contact Creator</span>
                        </button>
                      </div>

                      {/* Subdomain Link */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySubdomain(creator.subdomainUrl, creator.slug)}
                          className="text-[11px] font-mono text-[#94A3B8] hover:text-[#38BDF8] flex items-center gap-1.5"
                          title="Click to copy subdomain"
                        >
                          {copiedSlug === creator.slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{creator.slug}.naturestudio.in</span>
                        </button>
                        <a
                          href={creator.subdomainUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[#0B132B] border border-[#1E3A8A] text-[#38BDF8] hover:bg-[#2563EB] transition-colors"
                          title="Visit live subdomain"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <article
                  key={creator.id}
                  className="group relative rounded-3xl overflow-hidden bg-[#070D1E] border border-[#172554] hover:border-[#38BDF8] transition-all duration-500 hover:shadow-glow-burgundy flex flex-col justify-between"
                >
                  <Link
                    href={`/global-portfolio/${creator.slug}`}
                    className="relative aspect-video w-full overflow-hidden bg-[#030712] block cursor-pointer group/thumb"
                  >
                    <img
                      src={creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700 brightness-95 group-hover/thumb:brightness-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#030712]/80 backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/30">
                        {creator.gfxSubcategory || categoryName}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-[#030712]/90 text-[#38BDF8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#38BDF8]/40 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Portfolio</span>
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-syne font-bold text-sm text-[#F8FAFC] mb-1">
                        {creator.name}
                      </h4>
                      <Link href={`/global-portfolio/${creator.slug}`}>
                        <h3 className="font-syne text-base font-bold uppercase text-[#F8FAFC] mb-2 line-clamp-1 hover:text-[#38BDF8] transition-colors">
                          {creator.title}
                        </h3>
                      </Link>
                      {creator.description && (
                        <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2 mb-4">
                          {creator.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#172554]/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/global-portfolio/${creator.slug}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#2563EB]/60 hover:bg-[#2563EB] border border-[#38BDF8]/30 text-xs font-mono uppercase text-[#38BDF8] font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Full Detail</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setContactTargetCreator(creator)}
                        className="py-2 px-3 rounded-xl bg-[#0B132B] hover:bg-[#172554] border border-[#1E3A8A] text-xs font-mono uppercase text-[#F8FAFC] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Send className="w-3 h-3 text-[#38BDF8]" />
                        <span>Contact</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* QUICK LIGHTBOX MODAL */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-[#050B17] border border-[#2563EB] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-[#172554] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-widest block">
                  Community GFX • {categoryName}
                </span>
                <h4 className="font-syne text-lg font-bold text-[#F8FAFC]">
                  {activeImagePreview.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveImagePreview(null)}
                className="p-2 rounded-full bg-[#030712] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#030712]">
              <img
                src={activeImagePreview.imageUrl}
                alt={activeImagePreview.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 sm:p-5 border-t border-[#172554] text-xs text-[#94A3B8]">
              <span className="text-[#38BDF8] font-mono mr-2">Creator:</span>
              <span>{activeImagePreview.creatorName}</span>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT TICKET MODAL */}
      <ContactTicketModal
        isOpen={Boolean(contactTargetCreator)}
        onClose={() => setContactTargetCreator(null)}
        targetType="CREATOR"
        targetName={contactTargetCreator?.name || 'Creator'}
        targetUserId={contactTargetCreator?.userId}
        targetUserEmail={contactTargetCreator?.userEmail}
        portfolioTitle={contactTargetCreator?.title}
        portfolioSlug={contactTargetCreator?.slug}
      />

      <Footer />
    </div>
  );
}
