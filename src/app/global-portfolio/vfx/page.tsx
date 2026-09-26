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
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  ImageIcon,
} from 'lucide-react';
import { DEFAULT_COMMUNITY_PORTFOLIO_ITEMS } from '@/lib/portfolio-shared';

interface GlobalCreatorCard {
  id: string;
  userId?: string;
  userEmail?: string;
  portfolioSource: 'user';
  slug: string;
  title: string;
  description: string;
  category: 'GFX' | 'VFX' | 'Other';
  mediaType: 'image' | 'video';
  mediaUrl: string;
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

export default function GlobalVfxShowcasePage() {
  const [creators, setCreators] = useState<GlobalCreatorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    videoUrl: string;
    posterUrl?: string;
    title: string;
    creatorName: string;
  } | null>(null);
  const [contactTargetCreator, setContactTargetCreator] = useState<GlobalCreatorCard | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/portfolio/global?category=VFX')
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolios && data.portfolios.length > 0) {
          setCreators(data.portfolios);
        } else {
          setCreators([]);
        }
      })
      .catch(() => {
        setCreators([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
              <span className="text-purple-300 font-bold">Community VFX</span>
            </div>

            <Link
              href="/global-portfolio/gfx"
              className="px-3.5 py-1.5 rounded-xl bg-[#070D1E] hover:bg-[#0E1A33] border border-[#172554] hover:border-[#38BDF8]/40 text-xs font-mono uppercase text-[#38BDF8] inline-flex items-center gap-2 transition-all"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Community GFX Topics</span>
            </Link>
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#172554]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-xs font-mono uppercase text-purple-200 mb-3">
                <Film className="w-3.5 h-3.5" />
                <span>Community VFX Network</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
                Community VFX
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mt-4 leading-relaxed font-light">
                Discover independent motion designers, 3D animators, and VFX artists. Watch creator reels and commission custom motion graphics.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070D1E] border border-[#172554] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-purple-900 text-purple-200 font-bold border border-purple-400/40 shadow-sm'
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
                    ? 'bg-purple-900 text-purple-200 font-bold border border-purple-400/40 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>
        </section>

        {/* CREATORS LIST / GRID */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="py-24 text-center text-xs font-mono text-[#94A3B8]">
              Loading Community VFX Artists...
            </div>
          ) : creators.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#070D1E] border border-[#172554] p-8">
              <Film className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-syne text-lg font-bold text-[#F8FAFC] mb-1">
                No community VFX portfolios published yet.
              </h3>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-6">
              {creators.map((creator) => (
                <article
                  key={creator.id}
                  className="group rounded-3xl overflow-hidden bg-[#070D1E] border border-[#172554] hover:border-purple-400 transition-all duration-300 hover:shadow-2xl flex flex-col md:flex-row"
                >
                  <div className="relative w-full md:w-80 lg:w-96 aspect-video shrink-0 overflow-hidden bg-[#030712]">
                    <img
                      src={creator.videoThumbnailUrl || creator.mediaUrl || '/media/work-valorant-championship.jpg'}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setActiveVideoModal({
                          videoUrl: creator.videoUrl || creator.mediaUrl,
                          posterUrl: creator.videoThumbnailUrl,
                          title: creator.title,
                          creatorName: creator.name,
                        })
                      }
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-purple-500 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </button>
                    {creator.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-purple-200">
                        {creator.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-400/40 overflow-hidden flex items-center justify-center font-bold text-xs text-purple-200">
                          {creator.avatar ? <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" /> : creator.name.slice(0, 2)}
                        </div>
                        <h4 className="font-syne font-bold text-sm text-[#F8FAFC]">{creator.name}</h4>
                        <span className="text-xs font-mono text-[#94A3B8]">({creator.role})</span>
                      </div>

                      <Link href={`/global-portfolio/${creator.slug}`} className="block group-hover:text-purple-300 transition-colors">
                        <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#F8FAFC]">
                          {creator.title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                        {creator.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#172554]/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/global-portfolio/${creator.slug}`}
                          className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
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

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySubdomain(creator.subdomainUrl, creator.slug)}
                          className="text-[11px] font-mono text-[#94A3B8] hover:text-purple-300 flex items-center gap-1.5"
                        >
                          {copiedSlug === creator.slug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{creator.slug}.naturestudio.in</span>
                        </button>
                        <a href={creator.subdomainUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-400/30 text-purple-200">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <article
                  key={creator.id}
                  className="group relative rounded-3xl overflow-hidden bg-[#070D1E] border border-[#172554] hover:border-purple-400 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div
                    onClick={() =>
                      setActiveVideoModal({
                        videoUrl: creator.videoUrl || creator.mediaUrl,
                        posterUrl: creator.videoThumbnailUrl,
                        title: creator.title,
                        creatorName: creator.name,
                      })
                    }
                    className="relative aspect-video w-full overflow-hidden bg-[#030712] cursor-pointer"
                  >
                    <img
                      src={creator.videoThumbnailUrl || creator.mediaUrl}
                      alt={creator.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-syne font-bold text-sm text-[#F8FAFC] mb-1">{creator.name}</h4>
                      <Link href={`/global-portfolio/${creator.slug}`}>
                        <h3 className="font-syne text-base font-bold uppercase text-[#F8FAFC] mb-2 line-clamp-2 hover:text-purple-300 transition-colors">
                          {creator.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-[#172554]/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/global-portfolio/${creator.slug}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-400/40 text-xs font-mono uppercase text-purple-200 font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
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

      {/* VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#050B17] border border-purple-500/40 p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 tracking-widest flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Community VFX Video Showcase
                </span>
                <h4 className="font-syne text-lg font-bold text-[#F8FAFC]">
                  {activeVideoModal.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-full bg-[#030712] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
