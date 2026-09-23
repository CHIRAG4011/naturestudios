'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PortfolioSelectionModal } from '@/components/portfolio/PortfolioSelectionModal';
import { VfxVideoPlayer } from '@/components/portfolio/VfxVideoPlayer';
import { ContactTicketModal } from '@/components/portfolio/ContactTicketModal';
import type { StudioPortfolioItem, StudioWorkType, GfxSubsection } from '@/lib/portfolio-shared';
import {
  GFX_SUBSECTIONS,
  DEFAULT_STUDIO_PORTFOLIO_ITEMS,
  toGfxCategorySlug,
  fromGfxCategorySlug,
} from '@/lib/portfolio-shared';
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Layers,
  ArrowRight,
  ExternalLink,
  Play,
  X,
  Maximize2,
  ChevronRight,
  Trophy,
  Users,
  LayoutGrid,
  LayoutList,
  Bookmark,
  ShieldCheck,
  Zap,
  Globe,
  SlidersHorizontal,
  Send,
  Eye,
} from 'lucide-react';

function StudioPortfolioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read track & category from URL query if present
  const trackParam = searchParams.get('track')?.toUpperCase();
  const catParam = searchParams.get('cat') || searchParams.get('category');

  const [activeTrack, setActiveTrack] = useState<StudioWorkType>(
    trackParam === 'VFX' ? 'VFX' : 'GFX'
  );

  const initialGfxCategory = catParam
    ? fromGfxCategorySlug(catParam) || 'ALL'
    : 'ALL';

  const [activeGfxCategory, setActiveGfxCategory] = useState<string>(initialGfxCategory);

  // Popup modal state: Show modal if user lands on /portfolio without explicit track query
  const [showModal, setShowModal] = useState<boolean>(!trackParam);

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [contactTargetItem, setContactTargetItem] = useState<StudioPortfolioItem | null>(null);

  const [studioItems, setStudioItems] = useState<StudioPortfolioItem[]>(DEFAULT_STUDIO_PORTFOLIO_ITEMS);
  const [loadingItems, setLoadingItems] = useState(false);

  // Lightbox Modal for GFX Images
  const [activeLightboxItem, setActiveLightboxItem] = useState<StudioPortfolioItem | null>(null);

  // Video Reel Modal for VFX items
  const [activeVideoModalItem, setActiveVideoModalItem] = useState<StudioPortfolioItem | null>(null);

  // Sync state if URL query changes
  useEffect(() => {
    if (trackParam === 'GFX' || trackParam === 'VFX') {
      setActiveTrack(trackParam);
    }
    if (catParam) {
      const parsed = fromGfxCategorySlug(catParam);
      if (parsed) setActiveGfxCategory(parsed);
    }
  }, [trackParam, catParam]);

  // Fetch Studio Items from dedicated studio endpoint
  useEffect(() => {
    const fetchStudioItems = async () => {
      setLoadingItems(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeTrack) queryParams.set('type', activeTrack);
        if (activeTrack === 'GFX' && activeGfxCategory !== 'ALL') {
          queryParams.set('category', activeGfxCategory);
        }

        const res = await fetch(`/api/portfolio/studio?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setStudioItems(data.items);
          }
        }
      } catch (err) {
        console.error('Failed to fetch studio items:', err);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchStudioItems();
  }, [activeTrack, activeGfxCategory]);

  const handleSelectTrack = (track: 'GFX' | 'VFX', subsection?: string) => {
    setActiveTrack(track);
    setShowModal(false);
    if (subsection) {
      setActiveGfxCategory(subsection);
      router.replace(`/portfolio?track=${track}&cat=${toGfxCategorySlug(subsection)}`);
    } else {
      setActiveGfxCategory('ALL');
      router.replace(`/portfolio?track=${track}`);
    }
  };

  const handleSelectGfxCategory = (cat: string) => {
    setActiveGfxCategory(cat);
    const catSlug = cat === 'ALL' ? '' : `&cat=${toGfxCategorySlug(cat)}`;
    router.replace(`/portfolio?track=GFX${catSlug}`);
  };

  // Filter items in memory
  const displayedItems = useMemo(() => {
    return studioItems.filter((item) => {
      if (item.type !== activeTrack) return false;
      if (activeTrack === 'GFX' && activeGfxCategory !== 'ALL') {
        const normItemCat = item.gfxCategory?.replace(/s$/, '');
        const normActiveCat = activeGfxCategory.replace(/s$/, '');
        if (normItemCat !== normActiveCat) return false;
      }
      return true;
    });
  }, [studioItems, activeTrack, activeGfxCategory]);

  const gfxSubcategoryMeta: Record<
    string,
    { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    ALL: {
      title: 'Complete GFX Suite',
      desc: 'All tournament key visuals, team rosters, high-CTR thumbnails, and branding graphics.',
      icon: LayoutGrid,
    },
    Tournament: {
      title: 'Tournament Graphics',
      desc: 'Esports stage visuals, broadcast match schedules, brackets, HUD stream overlays, and event packaging.',
      icon: Trophy,
    },
    Roster: {
      title: 'Team & Roster Lineups',
      desc: 'Player announcement cards, championship squad posters, transfer reveals, and jersey showcases.',
      icon: Users,
    },
    Thumbnail: {
      title: 'Thumbnails & Media Covers',
      desc: 'High-CTR YouTube thumbnails, live broadcast stream headers, and engagement-driven key covers.',
      icon: Bookmark,
    },
    'Logo/Banner': {
      title: 'Logos & Server Banners',
      desc: 'Vector insignia, esports organization badges, Discord server branding, and Twitter/X headers.',
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
        mode="studio"
        title="Studio Portfolio"
        subtitle="Explore official esports broadcasts, graphics packages, and cinematic VFX created exclusively by NatureStudios."
      />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          {/* Top Banner: Global Portfolio Navigation Callout */}
          <div className="p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-[#240709] via-[#1D0608] to-[#150304] border border-[#59171B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-[#B89B8D]">
              <span className="px-2 py-0.5 rounded bg-[#59171B] text-[#FED7B8] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Studio View
              </span>
              <span>Looking for community and user-submitted portfolios?</span>
            </div>
            <Link
              href="/global-portfolio"
              className="px-3.5 py-1.5 rounded-xl bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all hover:scale-105"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore Global Portfolios</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#3D0D13]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A080C] border border-[#52141A] text-xs font-mono uppercase text-[#FED7B8] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NatureStudios Official Archive</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                Studio Portfolio
              </h1>
              <p className="text-sm sm:text-base text-[#B89B8D] max-w-2xl mt-4 leading-relaxed font-light">
                Official agency portfolio of world-class esports broadcast visuals, competition key art, and cinematic video effects created exclusively by NatureStudios.
              </p>
            </div>

            {/* Change Track / Re-open Modal Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Switch Track Popup</span>
              </button>
            </div>
          </div>
        </section>

        {/* TRACK SWITCHER (GFX vs VFX) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-2 bg-[#1A0507] rounded-3xl border border-[#3D0D13] max-w-2xl">
            {/* GFX Button */}
            <button
              onClick={() => handleSelectTrack('GFX')}
              className={`py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ${
                activeTrack === 'GFX'
                  ? 'bg-gradient-to-r from-[#59171B] to-[#7B1F25] text-[#FED7B8] font-bold shadow-glow-burgundy border border-[#FED7B8]/40'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
              }`}
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>GFX Track (Images)</span>
            </button>

            {/* VFX Button */}
            <button
              onClick={() => handleSelectTrack('VFX')}
              className={`py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ${
                activeTrack === 'VFX'
                  ? 'bg-gradient-to-r from-purple-950 to-purple-800 text-purple-200 font-bold shadow-2xl border border-purple-400/50'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
              }`}
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>VFX Track (Videos)</span>
            </button>
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
                const isSelected = activeGfxCategory === sub || (sub.startsWith('Logo') && activeGfxCategory.startsWith('Logo'));
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
                <span className="font-bold text-white mr-2">Studio VFX Showcase:</span>
                <span>
                  High-energy motion graphics, 3D tournament openers, cinematic match stings, and real-time visual effect packages. Click any card to launch interactive video player.
                </span>
              </div>
            </div>
          </section>
        )}

        {/* PORTFOLIO SHOWCASES: LIST OR GRID VIEW */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Toolbar: Title, Item Count & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#3D0D13]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED] font-syne flex items-center gap-2">
                <span>
                  {activeTrack === 'GFX'
                    ? activeGfxCategory === 'ALL'
                      ? 'All Studio GFX Works'
                      : `${activeGfxCategory} Portfolios`
                    : 'Studio VFX Video Showcases'}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#240709] border border-[#52141A] text-[#FED7B8]">
                  {displayedItems.length} {displayedItems.length === 1 ? 'Production' : 'Productions'}
                </span>
              </h2>
              <p className="text-xs text-[#B89B8D] mt-0.5">
                {activeTrack === 'GFX' && activeGfxCategory !== 'ALL'
                  ? `Displaying official studio ${activeGfxCategory.toLowerCase()} graphics and deliverables.`
                  : 'Official studio productions designed for international esports arenas.'}
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

          {loadingItems ? (
            <div className="py-24 text-center text-xs font-mono text-[#B89B8D]">
              Loading Studio {activeTrack} Showcases...
            </div>
          ) : displayedItems.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-20 text-center rounded-3xl bg-[#1D0608] border border-[#3D0D13] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#2A080C] text-[#FED7B8] flex items-center justify-center mx-auto mb-3">
                {activeTrack === 'GFX' ? <ImageIcon className="w-6 h-6" /> : <Film className="w-6 h-6" />}
              </div>
              <h3 className="font-syne text-lg font-bold text-[#FFF5ED] mb-1">
                No {activeGfxCategory !== 'ALL' ? activeGfxCategory : activeTrack} Showcases found.
              </h3>
              <p className="text-xs text-[#B89B8D] max-w-sm mx-auto mb-4">
                No designs have been added for this category yet. Browse other subsections or all GFX works.
              </p>
              <button
                onClick={() => handleSelectGfxCategory('ALL')}
                className="px-4 py-2 rounded-xl bg-[#59171B] text-[#FED7B8] text-xs font-mono uppercase cursor-pointer"
              >
                View All GFX
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST TYPE VIEW */
            <div className="space-y-6">
              {displayedItems.map((item, idx) => (
                <article
                  key={item.id || idx}
                  className="group rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] transition-all duration-300 hover:shadow-glow-burgundy flex flex-col md:flex-row"
                >
                  {/* Media Thumbnail */}
                  <div className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#150304]">
                    <img
                      src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#150304]/90 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30">
                        {item.type} {item.gfxCategory ? `• ${item.gfxCategory}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (item.type === 'GFX') setActiveLightboxItem(item);
                        else setActiveVideoModalItem(item);
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <span className="px-3 py-1.5 rounded-full bg-[#150304]/90 text-[#FED7B8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#FED7B8]/40">
                        {item.type === 'VFX' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        <span>{item.type === 'VFX' ? 'Quick Play' : 'Zoom Image'}</span>
                      </span>
                    </button>
                  </div>

                  {/* Content & Actions */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-[#FED7B8]/80 font-bold">
                          Client: {item.client}
                        </span>
                        <span className="text-[10px] font-mono text-[#B89B8D] uppercase">
                          Verified Studio Asset
                        </span>
                      </div>

                      <Link href={`/portfolio/${item.id}`} className="block group-hover:text-[#FED7B8] transition-colors">
                        <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.tags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#150304] border border-[#3D0D13] text-[#B89B8D]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-[#3D0D13]/60 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/portfolio/${item.id}`}
                        className="btn-primary text-xs py-2 px-4 shadow-glow-burgundy inline-flex items-center gap-2"
                      >
                        <span>View Full Project & All Images</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setContactTargetItem(item)}
                        className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3 h-3 text-[#FED7B8]" />
                        <span>Contact Now</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item, idx) => (
                <article
                  key={item.id || idx}
                  className="group relative rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] transition-all duration-500 hover:shadow-glow-burgundy flex flex-col justify-between"
                >
                  {/* Media Container */}
                  <div
                    onClick={() => {
                      if (activeTrack === 'GFX') {
                        setActiveLightboxItem(item);
                      } else {
                        setActiveVideoModalItem(item);
                      }
                    }}
                    className="relative aspect-video w-full overflow-hidden bg-[#150304] cursor-pointer"
                  >
                    <img
                      src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D0608] via-transparent to-transparent opacity-80" />

                    {/* Top Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#150304]/80 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30">
                        {item.type === 'GFX' && item.gfxCategory ? item.gfxCategory : item.type}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* GFX Image Lightbox Trigger / VFX Play Trigger */}
                    {activeTrack === 'GFX' ? (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="px-3.5 py-1.5 rounded-full bg-[#150304]/90 border border-[#FED7B8]/40 text-[#FED7B8] text-xs font-mono uppercase flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Image Fullscreen</span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#FED7B8] text-[#150304] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {item.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] text-[#FED7B8]">
                        {item.duration}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#FED7B8]/70 uppercase tracking-widest mb-1.5">
                        {item.client || 'NatureStudios Commission'}
                      </div>
                      <Link href={`/portfolio/${item.id}`} className="block group-hover:text-[#FED7B8] transition-colors">
                        <h3 className="font-syne text-xl font-bold uppercase text-[#FFF5ED] mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#B89B8D] leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 border-t border-[#3D0D13]/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/portfolio/${item.id}`}
                        className="text-xs font-mono uppercase text-[#FED7B8] hover:underline flex items-center gap-1"
                      >
                        <span>Full Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setContactTargetItem(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#2D0A0E] hover:bg-[#59171B] border border-[#52141A] text-[11px] font-mono uppercase text-[#FED7B8] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
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

      {/* FULL-SCREEN GFX LIGHTBOX MODAL */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-[#1C0507] border border-[#59171B] overflow-hidden shadow-2xl">
            {/* Top Modal Bar */}
            <div className="p-4 sm:p-5 border-b border-[#3D0D13] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FED7B8] tracking-widest block">
                  Studio GFX • {activeLightboxItem.gfxCategory || 'Artwork'}
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeLightboxItem.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image View */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#110203]">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 sm:p-5 border-t border-[#3D0D13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#B89B8D]">
              <div>
                <span className="text-[#FED7B8] font-mono mr-2">Client:</span>
                <span>{activeLightboxItem.client || 'NatureStudios Commission'}</span>
              </div>
              <p className="max-w-md line-clamp-1">{activeLightboxItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* VFX REEL VIDEO PLAYER MODAL */}
      {activeVideoModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#1C0507] border border-[#59171B] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D0D13]">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 tracking-widest flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Studio VFX Reel
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeVideoModalItem.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideoModalItem(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive Video Player */}
            <VfxVideoPlayer
              src={activeVideoModalItem.videoUrl || activeVideoModalItem.imageUrl}
              poster={activeVideoModalItem.thumbnailUrl || activeVideoModalItem.imageUrl}
              title={activeVideoModalItem.title}
              autoPlay={true}
            />

            <div className="pt-2 text-xs text-[#B89B8D] flex items-center justify-between">
              <span>{activeVideoModalItem.description}</span>
              <span className="text-[#FED7B8] font-mono font-bold">
                {activeVideoModalItem.client}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT TICKET MODAL */}
      <ContactTicketModal
        isOpen={Boolean(contactTargetItem)}
        onClose={() => setContactTargetItem(null)}
        targetType="STUDIO"
        targetName="NatureStudios Admin"
        portfolioTitle={contactTargetItem?.title}
      />

      <Footer />
    </div>
  );
}

export default function StudioPortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#150304]" />}>
      <StudioPortfolioContent />
    </Suspense>
  );
}
