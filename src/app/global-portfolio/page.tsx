'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PortfolioSelectionModal } from '@/components/portfolio/PortfolioSelectionModal';
import { VfxVideoPlayer } from '@/components/portfolio/VfxVideoPlayer';
import { ContactTicketModal } from '@/components/portfolio/ContactTicketModal';
import {
  GFX_SUBSECTIONS,
  toGfxCategorySlug,
  fromGfxCategorySlug,
  type GfxSubsection,
} from '@/lib/portfolio-shared';
import {
  Globe,
  Film,
  Image as ImageIcon,
  Search,
  ExternalLink,
  Copy,
  Check,
  Play,
  X,
  Maximize2,
  Sparkles,
  Trophy,
  Users,
  Bookmark,
  Zap,
  Shirt,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

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
  videoUrl?: string;
  videoThumbnailUrl?: string;
  duration?: string;
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

function GlobalPortfolioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const trackParam = searchParams.get('track')?.toUpperCase();
  const catParam = searchParams.get('cat') || searchParams.get('category');

  const [activeTrack, setActiveTrack] = useState<'GFX' | 'VFX'>(
    trackParam === 'VFX' ? 'VFX' : 'GFX'
  );

  const initialGfxCategory = catParam
    ? fromGfxCategorySlug(catParam) || 'ALL'
    : 'ALL';

  const [activeGfxCategory, setActiveGfxCategory] = useState<string>(initialGfxCategory);

  // Popup modal state: Show modal if user lands on /global-portfolio without explicit track query
  const [showModal, setShowModal] = useState<boolean>(!trackParam);

  // View Mode: List by default (per user specification)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Contact Modal State
  const [contactTargetCreator, setContactTargetCreator] = useState<GlobalCreatorCard | null>(null);

  const [creators, setCreators] = useState<GlobalCreatorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modals for previewing creator assets
  const [activeImagePreview, setActiveImagePreview] = useState<{
    imageUrl: string;
    title: string;
    creatorName: string;
    subdomainUrl: string;
    category?: string;
  } | null>(null);

  const [activeVideoModal, setActiveVideoModal] = useState<{
    videoUrl: string;
    posterUrl?: string;
    title: string;
    creatorName: string;
    subdomainUrl: string;
  } | null>(null);

  useEffect(() => {
    if (trackParam === 'GFX' || trackParam === 'VFX') {
      setActiveTrack(trackParam);
    }
    if (catParam) {
      const parsed = fromGfxCategorySlug(catParam);
      if (parsed) setActiveGfxCategory(parsed);
    }
  }, [trackParam, catParam]);

  // Fetch published user portfolios
  useEffect(() => {
    const fetchGlobalPortfolios = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeTrack) queryParams.set('category', activeTrack);
        if (activeTrack === 'GFX' && activeGfxCategory !== 'ALL') {
          queryParams.set('subcategory', activeGfxCategory);
        }
        if (searchQuery.trim()) {
          queryParams.set('search', searchQuery.trim());
        }

        const res = await fetch(`/api/portfolio/global?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCreators(data.portfolios || []);
        }
      } catch (err) {
        console.error('Failed to load global creator portfolios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalPortfolios();
  }, [activeTrack, activeGfxCategory, searchQuery]);

  const handleSelectTrack = (track: 'GFX' | 'VFX', subsection?: string) => {
    setShowModal(false);
    if (track === 'GFX') {
      if (subsection) {
        router.push(`/global-portfolio/gfx/${toGfxCategorySlug(subsection)}`);
      } else {
        router.push('/global-portfolio/gfx');
      }
    } else if (track === 'VFX') {
      router.push('/global-portfolio/vfx');
    }
  };

  const handleSelectGfxCategory = (cat: string) => {
    if (cat === 'ALL') {
      router.push('/global-portfolio/gfx');
    } else {
      router.push(`/global-portfolio/gfx/${toGfxCategorySlug(cat)}`);
    }
  };

  const handleCopySubdomain = (url: string, slug: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const gfxSubcategoryMeta: Record<
    string,
    { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    ALL: {
      title: 'All Creator GFX Work',
      desc: 'Browse user-published tournament graphics, roster cards, YouTube thumbnails, and branding marks.',
      icon: LayoutGrid,
    },
    Tournament: {
      title: 'Community Tournament Graphics',
      desc: 'Esports tournament posters, schedule overlays, bracket graphics, and stream packaging created by users.',
      icon: Trophy,
    },
    Roster: {
      title: 'Community Roster Lineups',
      desc: 'Squad announcements, player cards, contract signings, and team lineup graphics created by creators.',
      icon: Users,
    },
    Thumbnail: {
      title: 'Community Thumbnails',
      desc: 'High-CTR YouTube and live streaming thumbnails designed by global creators.',
      icon: Bookmark,
    },
    'Logo/Banner': {
      title: 'Community Logos & Banners',
      desc: 'Esports emblems, mascot logos, Twitch banners, and Twitter/X headers created by creators.',
      icon: Zap,
    },
    Jersey: {
      title: 'Community Jersey & Apparel',
      desc: 'Custom esports jerseys, team uniforms, apparel mockups, and merchandise concepts created by creators.',
      icon: Shirt,
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      {/* INITIAL POPUP SELECTION MODAL */}
      <PortfolioSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSelectTrack}
        mode="global"
        title="Global Portfolio"
        subtitle="Explore verified community creator portfolios published by graphic designers, motion artists, and visual creators."
      />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          {/* Top Banner: Studio Portfolio Switcher Callout */}
          <div className="p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#070D1E] to-[#030712] border border-[#2563EB] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-[#94A3B8]">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[10px] uppercase tracking-wider font-semibold border border-emerald-500/30">
                Community Directory
              </span>
              <span>Looking for NatureStudios official agency work?</span>
            </div>
            <Link
              href="/portfolio"
              className="px-3.5 py-1.5 rounded-xl bg-[#2563EB]/60 hover:bg-[#2563EB] border border-[#38BDF8]/30 text-xs font-mono uppercase tracking-wider text-[#38BDF8] flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Studio Portfolio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#172554]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1A33] border border-[#1E3A8A] text-xs font-mono uppercase text-[#38BDF8] mb-4">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Creator Network</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                Global Portfolio
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mt-4 leading-relaxed font-light">
                Discover independent creators, esports designers, and motion VFX artists. Browse published portfolios hosted on custom NatureStudios subdomains.
              </p>
            </div>

            {/* Change Track / Re-open Modal Button & Creator Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#070D1E] hover:bg-[#0E1A33] border border-[#172554] hover:border-[#38BDF8]/40 text-xs font-mono uppercase tracking-wider text-[#38BDF8] flex items-center gap-2 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Switch Track Popup</span>
              </button>

              <Link
                href="/portfolio/edit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
              >
                <span>Publish Your Portfolio</span>
              </Link>
            </div>
          </div>
        </section>

        {/* TRACK SWITCHER (GFX vs VFX) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#050B17] rounded-3xl border border-[#172554] max-w-md w-full">
              {/* GFX Button */}
              <Link
                href="/global-portfolio/gfx"
                className={`py-3 px-4 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTrack === 'GFX'
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-[#38BDF8] font-bold shadow-glow-burgundy border border-[#38BDF8]/40'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>GFX Portfolios</span>
              </Link>

              {/* VFX Button */}
              <Link
                href="/global-portfolio/vfx"
                className={`py-3 px-4 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTrack === 'VFX'
                    ? 'bg-gradient-to-r from-purple-950 to-purple-800 text-purple-200 font-bold shadow-2xl border border-purple-400/50'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>VFX Portfolios</span>
              </Link>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators, skills, titles..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#070D1E] border border-[#172554] rounded-2xl text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8]/40 shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* GFX SUBSECTIONS BAR (Tournament / Roster / Thumbnail / Logo/Banner) */}
        {activeTrack === 'GFX' && (
          <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 bg-[#070D1E] rounded-2xl border border-[#172554]">
              <Link
                href="/global-portfolio/gfx"
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all bg-[#2563EB] text-[#38BDF8] font-bold border border-[#38BDF8]/40 shadow-sm"
              >
                All Community GFX →
              </Link>

              {GFX_SUBSECTIONS.map((sub) => {
                const isSelected =
                  activeGfxCategory === sub ||
                  (sub.startsWith('Logo') && activeGfxCategory.startsWith('Logo'));
                return (
                  <Link
                    key={sub}
                    href={`/global-portfolio/gfx/${toGfxCategorySlug(sub)}`}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#2563EB] text-[#38BDF8] font-bold border border-[#38BDF8]/40 shadow-sm'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
                    }`}
                  >
                    <span>{sub}</span>
                  </Link>
                );
              })}
            </div>

            {/* Category Description Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-[#050B17]/60 border border-[#172554] flex items-center gap-3 text-xs text-[#94A3B8]">
              {React.createElement(
                gfxSubcategoryMeta[activeGfxCategory]?.icon || LayoutGrid,
                { className: 'w-4 h-4 text-[#38BDF8] flex-shrink-0' }
              )}
              <div>
                <span className="font-bold text-[#F8FAFC] mr-2">
                  {gfxSubcategoryMeta[activeGfxCategory]?.title}:
                </span>
                <span>{gfxSubcategoryMeta[activeGfxCategory]?.desc}</span>
              </div>
            </div>
          </section>
        )}

        {/* VFX REEL BANNER */}
        {activeTrack === 'VFX' && (
          <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-200">
              <Film className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white mr-2">Global VFX Community:</span>
                <span>
                  Video showcases, 3D broadcast motion design, and montage edits published by independent creators. Click any card to watch their video reel with full controls.
                </span>
              </div>
            </div>
          </section>
        )}

        {/* CREATORS PORTFOLIO LIST / GRID */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Toolbar: Title, Item Count & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#172554]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F8FAFC] font-syne flex items-center gap-2">
                <span>
                  {activeTrack === 'GFX'
                    ? activeGfxCategory === 'ALL'
                      ? 'All Community GFX Portfolios'
                      : `${activeGfxCategory} Portfolios`
                    : 'Community VFX Video Showcases'}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#0B132B] border border-[#1E3A8A] text-[#38BDF8]">
                  {creators.length} {creators.length === 1 ? 'Creator' : 'Creators'}
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {activeTrack === 'GFX' && activeGfxCategory !== 'ALL'
                  ? `Showing all verified global creator portfolios categorized under ${activeGfxCategory}.`
                  : 'Independent creator portfolios published on custom NatureStudios subdomains.'}
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
              Loading Global {activeTrack} Portfolios...
            </div>
          ) : creators.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-20 text-center rounded-3xl bg-[#070D1E] border border-[#172554] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#0E1A33] text-[#38BDF8] flex items-center justify-center mx-auto mb-3">
                {activeTrack === 'GFX' ? <ImageIcon className="w-6 h-6" /> : <Film className="w-6 h-6" />}
              </div>
              <h3 className="font-syne text-lg font-bold text-[#F8FAFC] mb-1">
                No creator portfolios found in this category.
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mb-5">
                Be the first creator to publish your work in this category and get featured on the NatureStudios Global Directory!
              </p>
              <Link
                href="/portfolio/edit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-xs font-mono uppercase text-[#38BDF8] font-bold shadow-lg"
              >
                Create Your Portfolio
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
                  <div className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#030712]">
                    <img
                      src={creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#030712]/90 backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/30">
                        {creator.category === 'GFX' && creator.gfxSubcategory
                          ? creator.gfxSubcategory
                          : creator.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/60 text-[#94A3B8] border border-white/10">
                        {creator.themeId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (activeTrack === 'GFX') {
                          setActiveImagePreview({
                            imageUrl: creator.mediaUrl,
                            title: creator.title,
                            creatorName: creator.name,
                            subdomainUrl: creator.subdomainUrl,
                            category: creator.gfxSubcategory,
                          });
                        } else {
                          setActiveVideoModal({
                            videoUrl: creator.videoUrl || creator.mediaUrl,
                            posterUrl: creator.videoThumbnailUrl || creator.mediaUrl,
                            title: creator.title,
                            creatorName: creator.name,
                            subdomainUrl: creator.subdomainUrl,
                          });
                        }
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <span className="px-3 py-1.5 rounded-full bg-[#030712]/90 text-[#38BDF8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#38BDF8]/40 shadow-lg">
                        {activeTrack === 'VFX' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        <span>{activeTrack === 'VFX' ? 'Quick Play' : 'Zoom Artwork'}</span>
                      </span>
                    </button>

                    {creator.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#38BDF8]">
                        {creator.duration}
                      </div>
                    )}
                  </div>

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
                  {/* Media Preview Box */}
                  <div
                    onClick={() => {
                      if (activeTrack === 'GFX') {
                        setActiveImagePreview({
                          imageUrl: creator.mediaUrl,
                          title: creator.title,
                          creatorName: creator.name,
                          subdomainUrl: creator.subdomainUrl,
                          category: creator.gfxSubcategory,
                        });
                      } else {
                        setActiveVideoModal({
                          videoUrl: creator.videoUrl || creator.mediaUrl,
                          posterUrl: creator.videoThumbnailUrl || creator.mediaUrl,
                          title: creator.title,
                          creatorName: creator.name,
                          subdomainUrl: creator.subdomainUrl,
                        });
                      }
                    }}
                    className="relative aspect-video w-full overflow-hidden bg-[#030712] cursor-pointer"
                  >
                    <img
                      src={creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#030712]/80 backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/30">
                        {creator.category === 'GFX' && creator.gfxSubcategory
                          ? creator.gfxSubcategory
                          : creator.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/60 text-[#94A3B8] border border-white/10">
                        {creator.themeId}
                      </span>
                    </div>

                    {/* Trigger Overlay */}
                    {activeTrack === 'GFX' ? (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="px-3.5 py-1.5 rounded-full bg-[#030712]/90 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono uppercase flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Artwork</span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#38BDF8] text-[#030712] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {creator.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] text-[#38BDF8]">
                        {creator.duration}
                      </div>
                    )}
                  </div>

                  {/* Creator Info & Description */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Creator Masthead */}
                      <div className="flex items-center gap-3 mb-3">
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

                        <div className="overflow-hidden">
                          <h4 className="font-syne font-bold text-sm text-[#F8FAFC] truncate group-hover:text-[#38BDF8] transition-colors">
                            {creator.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#94A3B8] truncate block">
                            {creator.role}
                          </span>
                        </div>
                      </div>

                      <Link href={`/global-portfolio/${creator.slug}`}>
                        <h3 className="font-syne text-base font-bold uppercase text-[#F8FAFC] mb-2 line-clamp-1 hover:text-[#38BDF8] transition-colors">
                          {creator.title}
                        </h3>
                      </Link>

                      {creator.tagline && (
                        <p className="text-xs text-[#38BDF8]/80 italic mb-2 line-clamp-1">
                          &quot;{creator.tagline}&quot;
                        </p>
                      )}

                      {creator.description && (
                        <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2 mb-4">
                          {creator.description}
                        </p>
                      )}

                      {/* Skills Tags */}
                      {creator.skills && creator.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {creator.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#030712] border border-[#172554] text-[#94A3B8]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions & Subdomain Footer */}
                    <div className="pt-4 border-t border-[#172554]/60 space-y-3">
                      <div className="flex items-center gap-2">
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
                          title="Send ticket inquiry"
                        >
                          <Send className="w-3 h-3 text-[#38BDF8]" />
                          <span>Contact</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopySubdomain(creator.subdomainUrl, creator.slug)}
                          className="hover:text-[#38BDF8] flex items-center gap-1 truncate max-w-[190px]"
                        >
                          {copiedSlug === creator.slug ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="truncate">{creator.slug}.naturestudio.in</span>
                        </button>
                        <a
                          href={creator.subdomainUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FULL-SCREEN GFX IMAGE LIGHTBOX */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-[#050B17] border border-[#2563EB] overflow-hidden shadow-2xl">
            {/* Top Modal Bar */}
            <div className="p-4 sm:p-5 border-b border-[#172554] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-widest block">
                  Creator GFX • {activeImagePreview.category || 'Artwork'}
                </span>
                <h4 className="font-syne text-lg font-bold text-[#F8FAFC]">
                  {activeImagePreview.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveImagePreview(null)}
                className="p-2 rounded-full bg-[#030712] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image View */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#030712]">
              <img
                src={activeImagePreview.imageUrl}
                alt={activeImagePreview.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 sm:p-5 border-t border-[#172554] flex items-center justify-between text-xs text-[#94A3B8]">
              <div>
                <span className="text-[#38BDF8] font-mono mr-2">Creator:</span>
                <span>{activeImagePreview.creatorName}</span>
              </div>
              <a
                href={activeImagePreview.subdomainUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#38BDF8] underline hover:text-white font-mono"
              >
                View Full Portfolio Subdomain →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* VFX REEL VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#050B17] border border-[#2563EB] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 tracking-widest flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Creator VFX Reel
                </span>
                <h4 className="font-syne text-lg font-bold text-[#F8FAFC]">
                  {activeVideoModal.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-full bg-[#030712] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive Video Player */}
            <VfxVideoPlayer
              src={activeVideoModal.videoUrl}
              poster={activeVideoModal.posterUrl}
              title={activeVideoModal.title}
              autoPlay={true}
            />

            <div className="pt-2 text-xs text-[#94A3B8] flex items-center justify-between">
              <div>
                <span className="text-[#38BDF8] font-mono mr-2">Creator:</span>
                <span>{activeVideoModal.creatorName}</span>
              </div>
              <a
                href={activeVideoModal.subdomainUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#38BDF8] underline hover:text-white font-mono"
              >
                View Creator Subdomain →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT CREATOR TICKET MODAL */}
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

export default function GlobalPortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712]" />}>
      <GlobalPortfolioContent />
    </Suspense>
  );
}
