'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VfxVideoPlayer } from '@/components/portfolio/VfxVideoPlayer';
import { ContactTicketModal } from '@/components/portfolio/ContactTicketModal';
import {
  Film,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Maximize2,
  X,
  Send,
  LayoutList,
  LayoutGrid,
  ChevronRight,
  Globe,
  ImageIcon,
} from 'lucide-react';
import type { StudioPortfolioItem } from '@/lib/portfolio-shared';
import { DEFAULT_STUDIO_PORTFOLIO_ITEMS } from '@/lib/portfolio-shared';

export default function StudioVfxShowcasePage() {
  const [studioItems, setStudioItems] = useState<StudioPortfolioItem[]>(DEFAULT_STUDIO_PORTFOLIO_ITEMS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeVideoModalItem, setActiveVideoModalItem] = useState<StudioPortfolioItem | null>(null);
  const [contactTargetItem, setContactTargetItem] = useState<StudioPortfolioItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/portfolio/studio?type=VFX')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setStudioItems(data.items);
        } else {
          setStudioItems(DEFAULT_STUDIO_PORTFOLIO_ITEMS.filter((i) => i.type === 'VFX'));
        }
      })
      .catch(() => {
        setStudioItems(DEFAULT_STUDIO_PORTFOLIO_ITEMS.filter((i) => i.type === 'VFX'));
      })
      .finally(() => setLoading(false));
  }, []);

  const vfxItems = studioItems.filter((i) => i.type === 'VFX');

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
              <span className="text-purple-300 font-bold">VFX Track (Videos)</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/portfolio/gfx"
                className="px-3.5 py-1.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase text-[#FED7B8] inline-flex items-center gap-2 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>GFX Subsections</span>
              </Link>
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          <div className="p-4 mb-8 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 text-xs text-purple-200 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Film className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Cinematic 3D stage openers, Unreal Engine broadcast stings, and real-time motion packaging.</span>
            </div>
            <Link
              href="/global-portfolio/vfx"
              className="px-3.5 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-300/30 text-xs font-mono uppercase text-white flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Community VFX</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#3D0D13]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-xs font-mono uppercase text-purple-200 mb-3">
                <Film className="w-3.5 h-3.5" />
                <span>Studio VFX Productions</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
                Motion & VFX
              </h1>
              <p className="text-sm sm:text-base text-[#B89B8D] max-w-2xl mt-4 leading-relaxed font-light">
                Official agency showreels, 3D stadium tournament openers, synchronized arena LED cube animations, and match reveal cinematics.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1D0608] border border-[#3D0D13] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-purple-900 text-purple-200 font-bold border border-purple-400/40 shadow-sm'
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
                    ? 'bg-purple-900 text-purple-200 font-bold border border-purple-400/40 shadow-sm'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>
        </section>

        {/* VFX SHOWCASE LIST / GRID */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="py-24 text-center text-xs font-mono text-[#B89B8D]">
              Loading Studio VFX Productions...
            </div>
          ) : vfxItems.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#1D0608] border border-[#3D0D13] p-8">
              <Film className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-syne text-lg font-bold text-[#FFF5ED] mb-1">
                No studio VFX productions available yet.
              </h3>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-6">
              {vfxItems.map((item, idx) => (
                <article
                  key={item.id || idx}
                  className="group rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-purple-400 transition-all duration-300 hover:shadow-2xl flex flex-col md:flex-row"
                >
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#150304]">
                    <img
                      src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-purple-950/90 text-purple-200 border border-purple-400/40">
                        VFX Production
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveVideoModalItem(item)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-purple-500 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </button>

                    {item.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-purple-200">
                        {item.duration}
                      </div>
                    )}
                  </div>

                  {/* Info & Actions */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-purple-300 font-bold">
                          Client: {item.client}
                        </span>
                        <span className="text-[10px] font-mono text-[#B89B8D] uppercase">
                          Official Studio Asset
                        </span>
                      </div>

                      <Link href={`/portfolio/${item.id}`} className="block group-hover:text-purple-300 transition-colors">
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

                    <div className="pt-4 border-t border-[#3D0D13]/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveVideoModalItem(item)}
                          className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-purple-200 text-xs font-mono uppercase flex items-center gap-2 border border-purple-400/40 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Showreel</span>
                        </button>
                        <Link
                          href={`/portfolio/${item.id}`}
                          className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
                        >
                          <span>Full Project Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => setContactTargetItem(item)}
                        className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3 h-3 text-[#FED7B8]" />
                        <span>Contact Studio</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vfxItems.map((item, idx) => (
                <article
                  key={item.id || idx}
                  className="group relative rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-purple-400 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div
                    onClick={() => setActiveVideoModalItem(item)}
                    className="relative aspect-video w-full overflow-hidden bg-[#150304] cursor-pointer"
                  >
                    <img
                      src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {item.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-purple-200">
                        {item.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-purple-300 font-bold mb-1.5">
                        Client: {item.client}
                      </div>
                      <Link href={`/portfolio/${item.id}`}>
                        <h3 className="font-syne text-lg font-bold uppercase text-[#FFF5ED] mb-2 line-clamp-2 hover:text-purple-300 transition-colors">
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
                        className="flex-1 py-2 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-400/40 text-xs font-mono uppercase text-purple-200 font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
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

      {/* VIDEO PLAYER MODAL */}
      {activeVideoModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#1C0507] border border-purple-500/40 p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D0D13]">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 tracking-widest flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Studio VFX Production Showreel
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeVideoModalItem.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModalItem(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <VfxVideoPlayer
              src={activeVideoModalItem.videoUrl || activeVideoModalItem.imageUrl}
              poster={activeVideoModalItem.thumbnailUrl || activeVideoModalItem.imageUrl}
              title={activeVideoModalItem.title}
              autoPlay={true}
            />

            <div className="pt-2 text-xs text-[#B89B8D] flex items-center justify-between">
              <span>{activeVideoModalItem.description}</span>
              <span className="text-purple-300 font-mono font-bold">
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
