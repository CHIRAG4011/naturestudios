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
  Film,
  Globe,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import type { StudioPortfolioItem, GfxSubsection } from '@/lib/portfolio-shared';
import {
  DEFAULT_STUDIO_PORTFOLIO_ITEMS,
  GFX_SUBSECTIONS,
  fromGfxCategorySlug,
  toGfxCategorySlug,
} from '@/lib/portfolio-shared';

export default function StudioGfxCategoryWorkPage() {
  const params = useParams();
  const router = useRouter();
  const rawCategory = params?.category as string;

  // Resolve category name (e.g. tournament -> Tournament)
  const categoryName: GfxSubsection = useMemo(() => {
    return fromGfxCategorySlug(rawCategory) || 'Tournament';
  }, [rawCategory]);

  const [studioItems, setStudioItems] = useState<StudioPortfolioItem[]>(DEFAULT_STUDIO_PORTFOLIO_ITEMS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeLightboxItem, setActiveLightboxItem] = useState<StudioPortfolioItem | null>(null);
  const [contactTargetItem, setContactTargetItem] = useState<StudioPortfolioItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/portfolio/studio?type=GFX&category=${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setStudioItems(data.items);
        } else {
          // In-memory fallback
          const filtered = DEFAULT_STUDIO_PORTFOLIO_ITEMS.filter((i) => {
            if (i.type !== 'GFX') return false;
            const normItem = i.gfxCategory?.toLowerCase().replace(/[^a-z]/g, '');
            const normTarget = categoryName.toLowerCase().replace(/[^a-z]/g, '');
            return normItem?.includes(normTarget) || normTarget?.includes(normItem || '');
          });
          setStudioItems(filtered);
        }
      })
      .catch(() => {
        const filtered = DEFAULT_STUDIO_PORTFOLIO_ITEMS.filter((i) => {
          if (i.type !== 'GFX') return false;
          const normItem = i.gfxCategory?.toLowerCase().replace(/[^a-z]/g, '');
          const normTarget = categoryName.toLowerCase().replace(/[^a-z]/g, '');
          return normItem?.includes(normTarget) || normTarget?.includes(normItem || '');
        });
        setStudioItems(filtered);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  const displayedItems = useMemo(() => {
    return studioItems.filter((item) => {
      if (item.type !== 'GFX') return false;
      const normItem = item.gfxCategory?.toLowerCase().replace(/[^a-z]/g, '');
      const normTarget = categoryName.toLowerCase().replace(/[^a-z]/g, '');
      return normItem?.includes(normTarget) || normTarget?.includes(normItem || '');
    });
  }, [studioItems, categoryName]);

  const categoryMeta: Record<
    string,
    { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    Tournament: {
      title: 'Tournament Graphics',
      desc: 'Esports stage visuals, broadcast match schedules, playoff brackets, dynamic HUD overlays, and event championship packaging.',
      icon: Trophy,
    },
    Roster: {
      title: 'Team & Roster Lineups',
      desc: 'Player announcement cards, championship squad posters, transfer reveals, and pro esports jersey sponsor integrations.',
      icon: Users,
    },
    Thumbnail: {
      title: 'Thumbnails & Media Covers',
      desc: 'High-CTR YouTube thumbnails, tournament match highlights artwork, live stream broadcast key art, and social discovery graphics.',
      icon: Bookmark,
    },
    'Logo/Banner': {
      title: 'Logos & Server Banners',
      desc: 'Vector insignia, esports organization badges, Discord server branding, and Twitter/X headers.',
      icon: Zap,
    },
  };

  const currentMeta = categoryMeta[categoryName] || categoryMeta['Tournament'];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* BREADCRUMB NAVIGATION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3D0D13]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B89B8D]">
              <Link href="/portfolio" className="hover:text-[#FED7B8] transition-colors">
                Studio Portfolio
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#52141A]" />
              <Link href="/portfolio/gfx" className="hover:text-[#FED7B8] transition-colors">
                GFX Subsections
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#52141A]" />
              <span className="text-[#FFF5ED] font-bold">{categoryName}</span>
            </div>

            <Link
              href="/portfolio/gfx"
              className="px-3.5 py-1.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase text-[#FED7B8] inline-flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All GFX Subsections</span>
            </Link>
          </div>
        </section>

        {/* HEADER & TOPIC METADATA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#3D0D13]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A080C] border border-[#52141A] text-xs font-mono uppercase text-[#FED7B8] mb-3">
                <currentMeta.icon className="w-3.5 h-3.5" />
                <span>Official Studio Section</span>
              </div>
              <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                {currentMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#B89B8D] max-w-2xl mt-3 leading-relaxed">
                {currentMeta.desc}
              </p>
            </div>

            {/* Quick Switch Subsections Pills */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#1D0608] rounded-2xl border border-[#3D0D13]">
              {GFX_SUBSECTIONS.map((sub) => {
                const isCurrent =
                  categoryName === sub ||
                  (sub.startsWith('Logo') && categoryName.startsWith('Logo'));
                return (
                  <Link
                    key={sub}
                    href={`/portfolio/gfx/${toGfxCategorySlug(sub)}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-colors ${
                      isCurrent
                        ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/30 shadow-sm'
                        : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709]'
                    }`}
                  >
                    {sub}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORKS LIST / SAMPLES SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Toolbar: Production Count & View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#3D0D13]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED] font-syne flex items-center gap-2">
                <span>Studio {categoryName} Productions</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#240709] border border-[#52141A] text-[#FED7B8]">
                  {displayedItems.length} {displayedItems.length === 1 ? 'Production' : 'Productions'}
                </span>
              </h2>
              <p className="text-xs text-[#B89B8D] mt-0.5">
                Click any project to see all uploaded high-resolution images, creative brief, and technical specifications.
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
              Loading {categoryName} Productions...
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#1D0608] border border-[#3D0D13] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#2A080C] text-[#FED7B8] flex items-center justify-center mx-auto mb-3">
                <currentMeta.icon className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-lg font-bold text-[#FFF5ED] mb-1">
                No {categoryName} productions found.
              </h3>
              <p className="text-xs text-[#B89B8D] max-w-sm mx-auto mb-4">
                Explore our other GFX subsections or check out the complete studio archive.
              </p>
              <Link
                href="/portfolio/gfx"
                className="px-4 py-2 rounded-xl bg-[#59171B] text-[#FED7B8] text-xs font-mono uppercase cursor-pointer"
              >
                View Other Subsections
              </Link>
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
                  <Link
                    href={`/portfolio/${item.id}`}
                    className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#150304] block cursor-pointer group/thumb"
                  >
                    <img
                      src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#150304]/90 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30">
                        {item.gfxCategory || categoryName}
                      </span>
                    </div>
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold bg-black/80 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30 flex items-center gap-1 shadow">
                          <ImageIcon className="w-2.5 h-2.5 text-[#FED7B8]" />
                          <span>{item.images.length} Assets</span>
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-[#150304]/90 text-[#FED7B8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#FED7B8]/40 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Project & All Details</span>
                      </span>
                    </div>
                  </Link>

                  {/* Content & Actions */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-[#FED7B8]/80 font-bold">
                          Client: {item.client}
                        </span>
                        <span className="text-[10px] font-mono text-[#B89B8D] uppercase">
                          Official Agency Asset
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
                        <span>View Full Project & All Details</span>
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
                  <Link
                    href={`/portfolio/${item.id}`}
                    className="relative aspect-video w-full overflow-hidden bg-[#150304] block cursor-pointer group/thumb"
                  >
                    <img
                      src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#150304]/90 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30">
                        {item.gfxCategory || categoryName}
                      </span>
                    </div>
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold bg-black/80 backdrop-blur-md text-[#FED7B8] border border-[#FED7B8]/30 flex items-center gap-1 shadow">
                          <ImageIcon className="w-2.5 h-2.5 text-[#FED7B8]" />
                          <span>{item.images.length}</span>
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-[#150304]/90 text-[#FED7B8] text-xs font-mono uppercase flex items-center gap-1.5 border border-[#FED7B8]/40 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-[#FED7B8]/80 font-bold mb-1.5">
                        Client: {item.client}
                      </div>
                      <Link href={`/portfolio/${item.id}`}>
                        <h3 className="font-syne text-lg font-bold uppercase text-[#FFF5ED] mb-2 line-clamp-2 hover:text-[#FED7B8] transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#B89B8D] leading-relaxed line-clamp-2 mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#3D0D13]/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/portfolio/${item.id}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase text-[#FED7B8] font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Full Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setContactTargetItem(item)}
                        className="py-2 px-3 rounded-xl bg-[#240709] hover:bg-[#3D0D13] border border-[#52141A] text-xs font-mono uppercase text-[#FFF5ED] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Send className="w-3 h-3 text-[#FED7B8]" />
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
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-[#1C0507] border border-[#59171B] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-[#3D0D13] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FED7B8] tracking-widest block">
                  Studio GFX • {activeLightboxItem.gfxCategory || categoryName}
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeLightboxItem.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveLightboxItem(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#110203]">
              <img
                src={activeLightboxItem.imageUrl || '/media/work-valorant-championship.jpg'}
                alt={activeLightboxItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 sm:p-5 border-t border-[#3D0D13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#B89B8D]">
              <div>
                <span className="text-[#FED7B8] font-mono mr-2">Client:</span>
                <span>{activeLightboxItem.client || 'NatureStudios Production'}</span>
              </div>
              <Link
                href={`/portfolio/${activeLightboxItem.id}`}
                className="text-[#FED7B8] underline hover:text-white font-mono"
              >
                View Full Production Details →
              </Link>
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
