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
  Shirt,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Film,
  Globe,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { DEFAULT_COMMUNITY_PORTFOLIO_ITEMS } from '@/lib/portfolio-shared';

export default function GlobalGfxSubsectionsPage() {
  const [creators, setCreators] = useState(DEFAULT_COMMUNITY_PORTFOLIO_ITEMS);

  useEffect(() => {
    fetch('/api/portfolio/global?category=GFX')
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolios && data.portfolios.length > 0) {
          setCreators(data.portfolios);
        }
      })
      .catch(() => {});
  }, []);

  const subsections = [
    {
      id: 'tournament',
      title: 'Tournament Graphics',
      slug: 'tournament',
      badge: 'Community Tournament Specialists',
      icon: Trophy,
      description:
        'Esports tournament posters, schedule overlays, bracket graphics, stage key visuals, and stream packaging created by verified community creators.',
      previewImages: [
        '/media/work-valorant-championship.jpg',
        '/media/work-nexus-arena.jpg',
      ],
      filterCategory: 'Tournament',
    },
    {
      id: 'roster',
      title: 'Team & Roster Lineups',
      slug: 'roster',
      badge: 'Pro Lineups & Player Cards',
      icon: Users,
      description:
        'Squad announcements, player cards, contract signings, pro esports starting 5 reveals, and team lineup graphics created by global designers.',
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
      description:
        'High-CTR YouTube thumbnails and live broadcast stream covers designed by independent community visual creators.',
      previewImages: [
        '/media/hero-lightfield.jpg',
        '/media/studio-plate.jpg',
      ],
      filterCategory: 'Thumbnail',
    },
    {
      id: 'logo-banner',
      title: 'Logos & Server Banners',
      slug: 'logo-banner',
      badge: 'Vector Crests & Channel Banners',
      icon: Zap,
      description:
        'Esports emblems, mascot vector logos, Twitch banners, and Twitter/X headers created by community branding artists.',
      previewImages: [
        '/media/cta-field.jpg',
        '/media/hero-lightfield-portrait.jpg',
      ],
      filterCategory: 'Logo/Banner',
    },
    {
      id: 'jersey',
      title: 'Jersey & Apparel Design',
      slug: 'jersey',
      badge: 'Esports Apparel & Kits',
      icon: Shirt,
      description:
        'Custom competitive esports jerseys, player uniforms, hoodie graphics, and pro team apparel mocks designed by community visual artists.',
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
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[10px] uppercase tracking-wider font-semibold border border-emerald-500/30">
                Community GFX
              </span>
              <span>Select a category below to explore verified independent creator portfolios.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/global-portfolio/vfx"
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-400/30 text-xs font-mono uppercase tracking-wider text-purple-200 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Community VFX</span>
              </Link>
              <Link
                href="/portfolio/gfx"
                className="px-3.5 py-1.5 rounded-xl bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Studio GFX</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#3D0D13]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A080C] border border-[#52141A] text-xs font-mono uppercase text-[#FED7B8] mb-4">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Creator Network</span>
              </div>
              <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
                Community GFX
              </h1>
              <p className="text-sm sm:text-base text-[#B89B8D] max-w-2xl mt-4 leading-relaxed font-light">
                Discover published community portfolios categorized by design specialty. Choose what you want to see below (Tournament, Roster, Thumbnail, Logo/Banner, Jersey).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/global-portfolio"
                className="px-4 py-2.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Global Portfolios</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SUBSECTIONS LIST */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-6">
            {subsections.map((sub, sIdx) => {
              const count = creators.filter((c: any) => {
                const normItem = (c.gfxSubcategory || c.category || '').toLowerCase().replace(/[^a-z]/g, '');
                const normTarget = sub.filterCategory.toLowerCase().replace(/[^a-z]/g, '');
                return normItem?.includes(normTarget) || normTarget?.includes(normItem);
              }).length;

              return (
                <Link
                  key={sub.id}
                  href={`/global-portfolio/gfx/${sub.slug}`}
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
                            Topic 0{sIdx + 1}
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
                            Creators
                          </span>
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#59171B]/60 group-hover:bg-[#59171B] border border-[#FED7B8]/30 text-xs font-mono uppercase text-[#FED7B8] font-bold transition-all group-hover:translate-x-1 shadow-md">
                        <span>View {sub.title} Portfolios</span>
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
