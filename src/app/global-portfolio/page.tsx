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
    setActiveTrack(track);
    setShowModal(false);
    if (track === 'GFX' && subsection) {
      setActiveGfxCategory(subsection);
      const catSlug = toGfxCategorySlug(subsection);
      router.replace(`/global-portfolio?track=GFX&cat=${catSlug}`);
    } else {
      setActiveGfxCategory('ALL');
      router.replace(`/global-portfolio?track=${track}`);
    }
  };

  const handleSelectGfxCategory = (cat: string) => {
    setActiveGfxCategory(cat);
    const catSlug = cat === 'ALL' ? '' : `&cat=${toGfxCategorySlug(cat)}`;
    router.replace(`/global-portfolio?track=GFX${catSlug}`);
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
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
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
          <div className="p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-[#240709] via-[#1D0608] to-[#150304] border border-[#59171B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-[#B89B8D]">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[10px] uppercase tracking-wider font-semibold border border-emerald-500/30">
                Community Directory
              </span>
              <span>Looking for NatureStudios official agency work?</span>
            </div>
            <Link
              href="/portfolio"
              className="px-3.5 py-1.5 rounded-xl bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Studio Portfolio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#3D0D13]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A080C] border border-[#52141A] text-xs font-mono uppercase text-[#FED7B8] mb-4">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Creator Network</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                Global Portfolio
              </h1>
              <p className="text-sm sm:text-base text-[#B89B8D] max-w-2xl mt-4 leading-relaxed font-light">
                Discover independent creators, esports designers, and motion VFX artists. Browse published portfolios hosted on custom NatureStudios subdomains.
              </p>
            </div>

            {/* Change Track / Re-open Modal Button & Creator Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Switch Track Popup</span>
              </button>

              <Link
                href="/portfolio/edit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
              >
                <span>Publish Your Portfolio</span>
              </Link>
            </div>
          </div>
        </section>

        {/* TRACK SWITCHER (GFX vs VFX) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#1A0507] rounded-3xl border border-[#3D0D13] max-w-md w-full">
              {/* GFX Button */}
              <button
                onClick={() => handleSelectTrack('GFX')}
                className={`py-3 px-4 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTrack === 'GFX'
                    ? 'bg-gradient-to-r from-[#59171B] to-[#7B1F25] text-[#FED7B8] font-bold shadow-glow-burgundy border border-[#FED7B8]/40'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>GFX Portfolios</span>
              </button>

              {/* VFX Button */}
              <button
                onClick={() => handleSelectTrack('VFX')}
                className={`py-3 px-4 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTrack === 'VFX'
                    ? 'bg-gradient-to-r from-purple-950 to-purple-800 text-purple-200 font-bold shadow-2xl border border-purple-400/50'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>VFX Portfolios</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#B89B8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators, skills, titles..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#1D0608] border border-[#3D0D13] rounded-2xl text-xs text-[#FFF5ED] placeholder:text-[#B89B8D]/50 focus:outline-none focus:border-[#FED7B8]/40 shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* GFX SUBSECTIONS BAR (Tournament / Roster / Thumbnail / Logo/Banner) */}
        {activeTrack === 'GFX' && (
          <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 bg-[#1D0608] rounded-2xl border border-[#3D0D13]">
              <button
                onClick={() => handleSelectGfxCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                  activeGfxCategory === 'ALL'
                    ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/40 shadow-sm'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
                }`}
              >
                All GFX Works
              </button>

              {GFX_SUBSECTIONS.map((sub) => {
                const isSelected =
                  activeGfxCategory === sub ||
                  (sub.startsWith('Logo') && activeGfxCategory.startsWith('Logo'));
                return (
                  <button
                    key={sub}
                    onClick={() => handleSelectGfxCategory(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/40 shadow-sm'
                        : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
                    }`}
                  >
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Description Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-[#1A0507]/60 border border-[#3D0D13] flex items-center gap-3 text-xs text-[#B89B8D]">
              {React.createElement(
                gfxSubcategoryMeta[activeGfxCategory]?.icon || LayoutGrid,
                { className: 'w-4 h-4 text-[#FED7B8] flex-shrink-0' }
              )}
              <div>
                <span className="font-bold text-[#FFF5ED] mr-2">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#3D0D13]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED] font-syne flex items-center gap-2">
                <span>
                  {activeTrack === 'GFX'
                    ? activeGfxCategory === 'ALL'
                      ? 'All Community GFX Portfolios'
                      : `${activeGfxCategory} Portfolios`
                    : 'Community VFX Video Showcases'}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#240709] border border-[#52141A] text-[#FED7B8]">
                  {creators.length} {creators.length === 1 ? 'Creator' : 'Creators'}
                </span>
              </h2>
              <p className="text-xs text-[#B89B8D] mt-0.5">
                {activeTrack === 'GFX' && activeGfxCategory !== 'ALL'
                  ? `Showing all verified global creator portfolios categorized under ${activeGfxCategory}.`
                  : 'Independent creator portfolios published on custom NatureStudios subdomains.'}
              </p>
            </div>

            {/* View Mode Toggle: List vs Grid */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1D0608] border border-[#3D0D13] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/30 shadow-sm'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED]'
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
                    ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/30 shadow-sm'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-xs font-mono text-[#B89B8D]">
              Loading Global {activeTrack} Portfolios...
            </div>
          ) : creators.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-20 text-center rounded-3xl bg-[#1D0608] border border-[#3D0D13] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#2A080C] text-[#FED7B8] flex items-center justify-center mx-auto mb-3">
                {activeTrack === 'GFX' ? <ImageIcon className="w-6 h-6" /> : <Film className="w-6 h-6" />}
              </div>
              <h3 className="font-syne text-lg font-bold text-[#FFF5ED] mb-1">
                No creator portfolios found in this category.
              </h3>
              <p className="text-xs text-[#B89B8D] max-w-sm mx-auto mb-5">
                Be the first creator to publish your work in this category and get featured on the NatureStudios Global Directory!
              </p>
              <Link
                href="/portfolio/edit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] text-xs font-mono uppercase text-[#FED7B8] font-bold shadow-lg"
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
                  className="group rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] transition-all duration-300 hover:shadow-glow-burgundy flex flex-col md:flex-row"
                >
                  {/* Media Thumbnail */}
                  <div className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#150304]">
                    <img
                      src={creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#150304]/90 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30">
                        {creator.category === 'GFX' && creator.gfxSubcategory
                          ? creator.gfxSubcategory
                          : creator.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/60 text-[#B89B8D] border border-white/10">
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
                      <span className="px-3 py-1.5 rounded-full bg-[#150304]/90 text-[#FED7B8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#FED7B8]/40 shadow-lg">
                        {activeTrack === 'VFX' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        <span>{activeTrack === 'VFX' ? 'Quick Play' : 'Zoom Artwork'}</span>
                      </span>
                    </button>

                    {creator.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#FED7B8]">
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
                          <div className="w-10 h-10 rounded-full bg-[#2A080C] border border-[#52141A] overflow-hidden flex-shrink-0 flex items-center justify-center font-syne font-bold text-xs text-[#FED7B8]">
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
                              <h4 className="font-syne font-bold text-sm text-[#FFF5ED]">
                                {creator.name}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[9px] font-mono uppercase text-emerald-300">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Verified Creator</span>
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[#B89B8D] block">
                              {creator.role} {creator.location ? `• ${creator.location}` : ''}
                            </span>
                          </div>
                        </div>

                        {creator.availability && (
                          <span className="text-[10px] font-mono text-[#FED7B8] px-2.5 py-1 rounded-full bg-[#2A080C] border border-[#52141A]">
                            {creator.availability}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <Link
                          href={`/global-portfolio/${creator.slug}`}
                          className="block group-hover:text-[#FED7B8] transition-colors"
                        >
                          <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                            {creator.title}
                          </h3>
                        </Link>
                        {creator.tagline && (
                          <p className="text-xs text-[#FED7B8]/80 italic mt-0.5">
                            &quot;{creator.tagline}&quot;
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {creator.description && (
                        <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed line-clamp-2">
                          {creator.description}
                        </p>
                      )}

                      {/* Skills Tags */}
                      {creator.skills && creator.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {creator.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#150304] border border-[#3D0D13] text-[#B89B8D]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-[#3D0D13]/60 flex flex-wrap items-center justify-between gap-3">
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
                          <Send className="w-3 h-3 text-[#FED7B8]" />
                          <span>Contact Creator</span>
                        </button>
                      </div>

                      {/* Subdomain Link */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySubdomain(creator.subdomainUrl, creator.slug)}
                          className="text-[11px] font-mono text-[#B89B8D] hover:text-[#FED7B8] flex items-center gap-1.5"
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
                          className="p-1.5 rounded-lg bg-[#240709] border border-[#52141A] text-[#FED7B8] hover:bg-[#59171B] transition-colors"
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
                  className="group relative rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] transition-all duration-500 hover:shadow-glow-burgundy flex flex-col justify-between"
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
                    className="relative aspect-video w-full overflow-hidden bg-[#150304] cursor-pointer"
                  >
                    <img
                      src={creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D0608] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#150304]/80 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30">
                        {creator.category === 'GFX' && creator.gfxSubcategory
                          ? creator.gfxSubcategory
                          : creator.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/60 text-[#B89B8D] border border-white/10">
                        {creator.themeId}
                      </span>
                    </div>

                    {/* Trigger Overlay */}
                    {activeTrack === 'GFX' ? (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="px-3.5 py-1.5 rounded-full bg-[#150304]/90 border border-[#FED7B8]/40 text-[#FED7B8] text-xs font-mono uppercase flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Artwork</span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#FED7B8] text-[#150304] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {creator.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] text-[#FED7B8]">
                        {creator.duration}
                      </div>
                    )}
                  </div>

                  {/* Creator Info & Description */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Creator Masthead */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#2A080C] border border-[#52141A] overflow-hidden flex-shrink-0 flex items-center justify-center font-syne font-bold text-xs text-[#FED7B8]">
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
                          <h4 className="font-syne font-bold text-sm text-[#FFF5ED] truncate group-hover:text-[#FED7B8] transition-colors">
                            {creator.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#B89B8D] truncate block">
                            {creator.role}
                          </span>
                        </div>
                      </div>

                      <Link href={`/global-portfolio/${creator.slug}`}>
                        <h3 className="font-syne text-base font-bold uppercase text-[#FFF5ED] mb-2 line-clamp-1 hover:text-[#FED7B8] transition-colors">
                          {creator.title}
                        </h3>
                      </Link>

                      {creator.tagline && (
                        <p className="text-xs text-[#FED7B8]/80 italic mb-2 line-clamp-1">
                          &quot;{creator.tagline}&quot;
                        </p>
                      )}

                      {creator.description && (
                        <p className="text-xs text-[#B89B8D] leading-relaxed line-clamp-2 mb-4">
                          {creator.description}
                        </p>
                      )}

                      {/* Skills Tags */}
                      {creator.skills && creator.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {creator.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#150304] border border-[#3D0D13] text-[#B89B8D]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions & Subdomain Footer */}
                    <div className="pt-4 border-t border-[#3D0D13]/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/global-portfolio/${creator.slug}`}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase text-[#FED7B8] font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Full Detail</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setContactTargetCreator(creator)}
                          className="py-2 px-3 rounded-xl bg-[#240709] hover:bg-[#3D0D13] border border-[#52141A] text-xs font-mono uppercase text-[#FFF5ED] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          title="Send ticket inquiry"
                        >
                          <Send className="w-3 h-3 text-[#FED7B8]" />
                          <span>Contact</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#B89B8D] pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopySubdomain(creator.subdomainUrl, creator.slug)}
                          className="hover:text-[#FED7B8] flex items-center gap-1 truncate max-w-[190px]"
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
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-[#1C0507] border border-[#59171B] overflow-hidden shadow-2xl">
            {/* Top Modal Bar */}
            <div className="p-4 sm:p-5 border-b border-[#3D0D13] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FED7B8] tracking-widest block">
                  Creator GFX • {activeImagePreview.category || 'Artwork'}
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeImagePreview.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveImagePreview(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image View */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#110203]">
              <img
                src={activeImagePreview.imageUrl}
                alt={activeImagePreview.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 sm:p-5 border-t border-[#3D0D13] flex items-center justify-between text-xs text-[#B89B8D]">
              <div>
                <span className="text-[#FED7B8] font-mono mr-2">Creator:</span>
                <span>{activeImagePreview.creatorName}</span>
              </div>
              <a
                href={activeImagePreview.subdomainUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#FED7B8] underline hover:text-white font-mono"
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
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#1C0507] border border-[#59171B] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D0D13]">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 tracking-widest flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Creator VFX Reel
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeVideoModal.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
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

            <div className="pt-2 text-xs text-[#B89B8D] flex items-center justify-between">
              <div>
                <span className="text-[#FED7B8] font-mono mr-2">Creator:</span>
                <span>{activeVideoModal.creatorName}</span>
              </div>
              <a
                href={activeVideoModal.subdomainUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#FED7B8] underline hover:text-white font-mono"
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
    <Suspense fallback={<div className="min-h-screen bg-[#150304]" />}>
      <GlobalPortfolioContent />
    </Suspense>
  );
}
