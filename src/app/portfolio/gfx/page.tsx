'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Trophy,
  Users,
  Bookmark,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Film,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Shirt,
} from 'lucide-react';
import type { StudioPortfolioItem } from '@/lib/portfolio-shared';
import { DEFAULT_STUDIO_PORTFOLIO_ITEMS } from '@/lib/portfolio-shared';

export default function StudioGfxSubsectionsPage() {
  const [studioItems, setStudioItems] = useState<StudioPortfolioItem[]>(DEFAULT_STUDIO_PORTFOLIO_ITEMS);

  useEffect(() => {
    fetch('/api/portfolio/studio?type=GFX')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setStudioItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const subsections = [
    {
      id: 'tournament',
      title: 'Tournament Graphics',
      slug: 'tournament',
      badge: 'Main Stage & HUD',
      icon: Trophy,
      color: 'from-amber-500/20 to-red-600/20 border-amber-500/30 text-amber-300',
      description:
        'Esports arena stage visuals, broadcast match schedules, playoff brackets, dynamic HUD stream overlays, and event championship packaging.',
      previewImages: [
        '/media/infinix/gfx/posters/coming-soon.jpg',
        '/media/infinix/gfx/broadcast/points-table.png',
        '/media/tournaments/clash-squad-cup/event-roadmap.png',
      ],
      filterCategory: 'Tournament',
    },
    {
      id: 'roster',
      title: 'Team & Roster Lineups',
      slug: 'roster',
      badge: 'Squad Reveals & Player Cards',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/30 text-blue-300',
      description:
        'Player announcement stat cards, starting 5 lineup reveals, championship squad posters, transfer announcements, and jersey sponsor integrations.',
      previewImages: [
        '/media/work-after-dark.jpg',
        '/media/work-level-up.jpg',
      ],
      filterCategory: 'Roster',
    },
    {
      id: 'thumbnail',
      title: 'Thumbnails & Media Covers',
      slug: 'thumbnail',
      badge: 'High-CTR YouTube & Stream Covers',
      icon: Bookmark,
      color: 'from-rose-500/20 to-pink-600/20 border-rose-500/30 text-rose-300',
      description:
        'High-CTR YouTube thumbnails, tournament match highlights artwork, live stream broadcast key art, and social discovery graphics.',
      previewImages: [
        '/media/infinix/gfx/thumbnails/group-stage-group-a.png',
        '/media/hero-lightfield.jpg',
      ],
      filterCategory: 'Thumbnail',
    },
    {
      id: 'logo-banner',
      title: 'Logos & Server Banners',
      slug: 'logo-banner',
      badge: 'Vector Crests & Perimeter Ribbons',
      icon: Zap,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-300',
      description:
        'Vector organization insignias, tournament championship crests, stadium perimeter LED ribbons, Discord server branding, and Twitter/X headers.',
      previewImages: [
        '/media/infinix/gfx/broadcast/hot-70-pro-logo.png',
        '/media/infinix/gfx/broadcast/144hz-badge.png',
      ],
      filterCategory: 'Logo/Banner',
    },
    {
      id: 'jersey',
      title: 'Jersey & Apparel Design',
      slug: 'jersey',
      badge: 'Pro Kits & Sublimation Mockups',
      icon: Shirt,
      color: 'from-amber-600/20 to-orange-700/20 border-amber-500/30 text-amber-300',
      description:
        'Custom esports championship jerseys, team kits, creator apparel merchandise, fabric sublimation layouts, and sponsor logo integration.',
      previewImages: [
        '/media/work-jersey-championship.jpg',
        '/media/work-valorant-championship.jpg',
      ],
      filterCategory: 'Jersey',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* HEADER SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          {/* Top Banner */}
          <div className="p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-[#240709] via-[#1D0608] to-[#150304] border border-[#59171B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-[#B89B8D]">
              <span className="px-2 py-0.5 rounded bg-[#59171B] text-[#FED7B8] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Studio GFX
              </span>
              <span>Select a subsection below to see all official studio productions.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/portfolio/vfx"
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-400/30 text-xs font-mono uppercase tracking-wider text-purple-200 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Switch to VFX</span>
              </Link>
              <Link
                href="/global-portfolio/gfx"
                className="px-3.5 py-1.5 rounded-xl bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all hover:scale-105"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Community GFX</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#3D0D13]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A080C] border border-[#52141A] text-xs font-mono uppercase text-[#FED7B8] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NatureStudios Graphic Design Track</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                GFX Subsections
              </h1>
              <p className="text-sm sm:text-base text-[#B89B8D] max-w-2xl mt-4 leading-relaxed font-light">
                Choose what type of creative work you are looking for. Select any subsection below to view the complete list of official agency productions, deliverables, and sample specifications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/portfolio"
                className="px-4 py-2.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Studio Showcases</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SUBSECTIONS LIST */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-6">
            {subsections.map((sub, sIdx) => {
              const count = studioItems.filter((i) => {
                if (i.type !== 'GFX') return false;
                const normItem = i.gfxCategory?.toLowerCase().replace(/[^a-z]/g, '');
                const normTarget = sub.filterCategory.toLowerCase().replace(/[^a-z]/g, '');
                return normItem?.includes(normTarget) || normTarget?.includes(normItem || '');
              }).length;

              return (
                <Link
                  key={sub.id}
                  href={`/portfolio/gfx/${sub.slug}`}
                  className="group block rounded-3xl overflow-hidden bg-gradient-to-r from-[#1D0608] via-[#240709] to-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] p-6 sm:p-8 transition-all duration-300 hover:shadow-glow-burgundy hover:scale-[1.01]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Icon & Description */}
                    <div className="flex items-start gap-5 max-w-2xl">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#2A080C] border border-[#52141A] flex items-center justify-center text-[#FED7B8] shrink-0 group-hover:scale-110 group-hover:border-[#FED7B8] transition-all">
                        <sub.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] font-bold">
                            Section 0{sIdx + 1}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[#FED7B8]/40" />
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#150304] border border-[#3D0D13] text-[#B89B8D]">
                            {sub.badge}
                          </span>
                        </div>

                        <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors">
                          {sub.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed">
                          {sub.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Preview Artwork & Action Button */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0">
                      {/* Thumbnail previews */}
                      <div className="flex items-center gap-2">
                        {sub.previewImages.map((pImg, pIdx) => (
                          <div
                            key={pIdx}
                            className="w-20 sm:w-24 aspect-video rounded-xl overflow-hidden bg-[#150304] border border-[#3D0D13] shrink-0"
                          >
                            <img
                              src={pImg}
                              alt={sub.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                        <div className="px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-center">
                          <span className="text-xs font-mono font-bold text-[#FED7B8] block">
                            {count > 0 ? count : 'Multiple'}
                          </span>
                          <span className="text-[9px] font-mono uppercase text-[#B89B8D] block">
                            Samples
                          </span>
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#59171B]/60 group-hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase text-[#FED7B8] font-bold transition-all group-hover:translate-x-1 shadow-md">
                        <span>View {sub.title} Works</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
