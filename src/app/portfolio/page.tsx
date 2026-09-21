'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import type { StudioPortfolioItem, StudioWorkType, GfxSubsection } from '@/lib/portfolio-shared';
import { GFX_SUBSECTIONS, DEFAULT_STUDIO_PORTFOLIO_ITEMS } from '@/lib/portfolio-shared';
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Play,
  Maximize2,
  ExternalLink,
  Layers,
  Globe,
  ArrowUpRight,
  Check,
  Copy,
  Search,
  X,
  Sliders,
  Plus,
  Trophy,
  Users,
  LayoutGrid,
  Bookmark,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CreatorPortfolioCard {
  id: string;
  slug: string;
  title: string;
  name: string;
  username: string;
  avatar?: string;
  tagline?: string;
  role: string;
  themeId: string;
  skills: string[];
  projectCount: number;
  subdomainUrl: string;
  directUrl: string;
}

export default function StudioPortfolioPage() {
  const { user } = useAuth();
  const [activeTrack, setActiveTrack] = useState<StudioWorkType>('GFX');
  const [activeGfxCategory, setActiveGfxCategory] = useState<string>('ALL');
  const [studioItems, setStudioItems] = useState<StudioPortfolioItem[]>(DEFAULT_STUDIO_PORTFOLIO_ITEMS);
  const [loadingItems, setLoadingItems] = useState(false);

  // Published Creators state
  const [creators, setCreators] = useState<CreatorPortfolioCard[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [creatorSearch, setCreatorSearch] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Lightbox Modal state
  const [selectedImage, setSelectedImage] = useState<StudioPortfolioItem | null>(null);

  // Video Player Modal state
  const [activeVideo, setActiveVideo] = useState<StudioPortfolioItem | null>(null);

  // Fetch live studio portfolio items from DB
  useEffect(() => {
    setLoadingItems(true);
    fetch('/api/studio-portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setStudioItems(data.items);
        }
      })
      .catch((err) => console.error('Failed to load studio items, using defaults:', err))
      .finally(() => setLoadingItems(false));
  }, []);

  // Fetch published community portfolios
  useEffect(() => {
    setLoadingCreators(true);
    fetch('/api/portfolio/published')
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolios) {
          setCreators(data.portfolios);
        }
      })
      .catch((err) => console.error('Failed to load published creators:', err))
      .finally(() => setLoadingCreators(false));
  }, []);

  // Filter GFX items
  const gfxItems = studioItems.filter((item) => item.type === 'GFX');
  const filteredGfxItems =
    activeGfxCategory === 'ALL'
      ? gfxItems
      : gfxItems.filter((item) => item.gfxCategory === activeGfxCategory);

  // VFX items
  const vfxItems = studioItems.filter((item) => item.type === 'VFX');

  // Filter creators
  const filteredCreators = creators.filter((c) => {
    const query = creatorSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query) ||
      c.skills.some((s) => s.toLowerCase().includes(query))
    );
  });

  const handleCopySubdomain = (url: string, slug: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Convert standard YouTube/Vimeo URLs to embeddable URLs
  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* HEADER */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" /> Official Studio Archive
              </div>

              {/* Creator Studio Quick Access Button */}
              <Link
                href="/portfolio/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1D23] border border-[#FED7B8]/40 text-xs font-mono font-bold uppercase tracking-wider text-[#FED7B8] hover:scale-105 hover:border-[#FED7B8] transition-all duration-300 shadow-glow-burgundy"
              >
                <Zap className="w-4 h-4 text-[#FF6B1A]" />
                <span>Creator Studio // Build Your Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.9]">
                  STUDIO PORTFOLIO
                </h1>
                <p className="text-sm sm:text-base text-[#B89B8D] max-w-2xl mt-3 leading-relaxed font-light">
                  Championship broadcast packages, stage architecture visual telemetry, and competitive esports creative direction engineered by NatureStudios.
                </p>
              </div>

              {/* Quick Section Anchor Links */}
              <div className="flex items-center gap-3">
                <a
                  href="#creator-network"
                  className="px-3.5 py-2 rounded-lg border border-[#3D0D13] bg-[#1C0507] hover:border-[#52141A] text-xs font-mono text-[#FED7B8] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Published Portfolios</span>
                </a>
              </div>
            </div>
          </div>

          {/* PRIMARY TRACK SELECTOR: GFX vs VFX */}
          <div className="p-1.5 rounded-2xl bg-[#1C0507] border border-[#3D0D13] flex max-w-md mx-auto mb-10 shadow-xl">
            <button
              onClick={() => setActiveTrack('GFX')}
              className={`flex-1 py-3 px-6 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTrack === 'GFX'
                  ? 'bg-gradient-to-r from-[#59171B] to-[#8C232A] text-[#FED7B8] shadow-glow-burgundy border border-[#FED7B8]/40'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#FF6B1A]" />
              <span>GFX Track</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-[#FED7B8]">
                {gfxItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTrack('VFX')}
              className={`flex-1 py-3 px-6 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTrack === 'VFX'
                  ? 'bg-gradient-to-r from-[#59171B] to-[#8C232A] text-[#FED7B8] shadow-glow-burgundy border border-[#FED7B8]/40'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <Film className="w-4 h-4 text-[#FF6B1A]" />
              <span>VFX Track (Video)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-[#FED7B8]">
                {vfxItems.length}
              </span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TRACK 1: GFX (WITH 4 SUBSECTIONS)                        */}
          {/* ======================================================== */}
          {activeTrack === 'GFX' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* GFX Subsections Filter */}
              <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                <button
                  onClick={() => setActiveGfxCategory('ALL')}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    activeGfxCategory === 'ALL'
                      ? 'bg-[#59171B] text-[#FED7B8] border border-[#FED7B8] shadow-glow-burgundy'
                      : 'bg-[#240709] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  All GFX ({gfxItems.length})
                </button>

                {GFX_SUBSECTIONS.map((sub) => {
                  const count = gfxItems.filter((item) => item.gfxCategory === sub).length;
                  const isActive = activeGfxCategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveGfxCategory(sub)}
                      className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#59171B] text-[#FED7B8] border border-[#FED7B8] shadow-glow-burgundy'
                          : 'bg-[#240709] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED]'
                      }`}
                    >
                      {sub === 'Tournament' && <Trophy className="w-3 h-3 text-[#FF6B1A]" />}
                      {sub === 'Roster' && <Users className="w-3 h-3 text-[#FED7B8]" />}
                      {sub === 'Thumbnail' && <LayoutGrid className="w-3 h-3 text-[#18A957]" />}
                      {sub === 'Logo/Banners' && <Bookmark className="w-3 h-3 text-[#E63946]" />}
                      <span>{sub}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* GFX Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredGfxItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      onClick={() => setSelectedImage(item)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-[#52141A] bg-[#1C0507] hover:border-[#FED7B8] transition-all duration-300 shadow-xl flex flex-col"
                    >
                      {/* Image Container with Hover Zoom & Action Overlay */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#150304]">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1C0507] via-transparent to-transparent opacity-80" />

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#150304]/85 border border-[#52141A] text-[#FED7B8] backdrop-blur-md">
                            {item.gfxCategory || 'GFX'}
                          </span>
                        </div>

                        {/* Hover Zoom Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                          <div className="p-3 rounded-full bg-[#59171B]/90 border border-[#FED7B8] text-[#FED7B8] shadow-glow-burgundy scale-90 group-hover:scale-100 transition-transform">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {item.client && (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B89B8D] block mb-1">
                              {item.client}
                            </span>
                          )}
                          <h3 className="text-base font-bold uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#B89B8D] mt-1.5 line-clamp-2 font-light">
                            {item.description}
                          </p>
                        </div>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#3D0D13]/60">
                            {item.tags.slice(0, 3).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#2D0A0E] text-[#FED7B8]/80 border border-[#52141A]/50"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredGfxItems.length === 0 && (
                <div className="py-16 text-center text-[#B89B8D] border border-dashed border-[#3D0D13] rounded-2xl">
                  <ImageIcon className="w-10 h-10 mx-auto text-[#52141A] mb-2" />
                  <p className="font-mono text-sm">No GFX items found for this subsection.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TRACK 2: VFX (VIDEOS & MOTION REELS)                    */}
          {/* ======================================================== */}
          {activeTrack === 'VFX' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-[#3D0D13] pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                    Motion Architecture & Video Reels
                  </h2>
                  <p className="text-xs text-[#B89B8D] mt-1">
                    Playable 3D arena openings, broadcast video packages, and synchronized stadium LED reels.
                  </p>
                </div>
                <span className="font-mono text-xs text-[#FED7B8] px-3 py-1 rounded-full bg-[#240709] border border-[#52141A]">
                  {vfxItems.length} Reels
                </span>
              </div>

              {/* VFX Video Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vfxItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveVideo(item)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-[#52141A] bg-[#1C0507] hover:border-[#FED7B8] transition-all duration-300 shadow-xl flex flex-col"
                  >
                    {/* Video Poster with Play Button */}
                    <div className="relative aspect-video overflow-hidden bg-[#150304]">
                      <Image
                        src={item.thumbnailUrl || item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                      {/* Duration Badge */}
                      {item.duration && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#FED7B8] backdrop-blur-md">
                          {item.duration}
                        </div>
                      )}

                      {/* Center Play Icon with Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#59171B]/90 border-2 border-[#FED7B8] flex items-center justify-center text-[#FED7B8] shadow-glow-burgundy group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 fill-[#FED7B8] ml-1" />
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#150304]/85 border border-[#52141A] text-[#FF6B1A] backdrop-blur-md flex items-center gap-1.5">
                        <Film className="w-3 h-3" /> VFX REEL
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {item.client && (
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B89B8D] block mb-1">
                            {item.client}
                          </span>
                        )}
                        <h3 className="text-base font-bold uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#B89B8D] mt-1.5 line-clamp-2 font-light">
                          {item.description}
                        </p>
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#3D0D13]/60">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#2D0A0E] text-[#FED7B8]/80 border border-[#52141A]/50"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {vfxItems.length === 0 && (
                <div className="py-16 text-center text-[#B89B8D] border border-dashed border-[#3D0D13] rounded-2xl">
                  <Film className="w-10 h-10 mx-auto text-[#52141A] mb-2" />
                  <p className="font-mono text-sm">No VFX video items available yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION: PUBLISHED CREATOR PORTFOLIOS SHOWCASE           */}
          {/* ======================================================== */}
          <section id="creator-network" className="mt-28 pt-16 border-t border-[#3D0D13]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8] mb-3">
                  <Globe className="w-3.5 h-3.5 text-[#18A957]" /> Global Creator Network
                </div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gradient-warm">
                  PUBLISHED PORTFOLIOS
                </h2>
                <p className="text-xs sm:text-sm text-[#B89B8D] max-w-xl mt-2 font-light">
                  Browse live portfolios designed and launched on the NatureStudios platform with dedicated custom subdomains.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B89B8D]" />
                <input
                  type="text"
                  value={creatorSearch}
                  onChange={(e) => setCreatorSearch(e.target.value)}
                  placeholder="Search creators, skills, roles..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1C0507] border border-[#3D0D13] focus:border-[#FED7B8] text-xs text-[#FFF5ED] placeholder-[#775549] outline-none"
                />
              </div>
            </div>

            {/* Creators Grid */}
            {loadingCreators ? (
              <div className="py-16 text-center text-[#B89B8D] font-mono text-xs">
                Loading published creator portfolios...
              </div>
            ) : filteredCreators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="p-6 rounded-2xl border border-[#52141A] bg-[#1C0507] hover:border-[#FED7B8] transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5"
                  >
                    <div>
                      {/* Creator Top Profile Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#2D0A0E] border border-[#52141A] overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-lg text-[#FED7B8]">
                            {creator.avatar ? (
                              <Image
                                src={creator.avatar}
                                alt={creator.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              creator.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-base text-[#FFF5ED] leading-tight">
                                {creator.name}
                              </h3>
                              <ShieldCheck className="w-4 h-4 text-[#18A957]" />
                            </div>
                            <span className="text-xs font-mono text-[#FED7B8]/80">
                              @{creator.username}
                            </span>
                          </div>
                        </div>

                        {/* Theme Badge */}
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8]">
                          {creator.themeId}
                        </span>
                      </div>

                      {/* Role & Tagline */}
                      <div className="mt-4">
                        <span className="text-xs font-mono text-[#FF6B1A] font-medium block">
                          {creator.role}
                        </span>
                        {creator.tagline && (
                          <p className="text-xs text-[#B89B8D] mt-1 line-clamp-2 font-light">
                            &quot;{creator.tagline}&quot;
                          </p>
                        )}
                      </div>

                      {/* Skills */}
                      {creator.skills && creator.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {creator.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#150304] border border-[#3D0D13] text-[#B89B8D]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Subdomain & Direct Actions */}
                    <div className="space-y-2 pt-4 border-t border-[#3D0D13]">
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#150304] border border-[#3D0D13] font-mono text-xs">
                        <span className="text-[#FED7B8] truncate">{creator.slug}.naturestudio.in</span>
                        <button
                          onClick={() => handleCopySubdomain(creator.subdomainUrl, creator.slug)}
                          className="p-1 hover:text-[#FFF5ED] text-[#B89B8D] shrink-0"
                          title="Copy subdomain URL"
                        >
                          {copiedSlug === creator.slug ? (
                            <Check className="w-3.5 h-3.5 text-[#18A957]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={creator.subdomainUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-lg bg-[#59171B] hover:bg-[#721C22] text-xs font-mono font-bold text-[#FED7B8] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Visit Subdomain</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <Link
                          href={creator.directUrl}
                          className="py-2 px-3 rounded-lg bg-[#240709] border border-[#3D0D13] hover:border-[#52141A] text-xs font-mono text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
                          title="Direct route link"
                        >
                          /p/{creator.slug}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-[#B89B8D] border border-dashed border-[#3D0D13] rounded-2xl">
                <Globe className="w-10 h-10 mx-auto text-[#52141A] mb-2" />
                <p className="font-mono text-sm">No published creator portfolios match your search query.</p>
              </div>
            )}

            {/* Bottom Call to Action for Creators */}
            <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#2D0A0E] via-[#1C0507] to-[#150304] border border-[#52141A] text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#FF6B1A]/20 to-transparent blur-3xl pointer-events-none" />

              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FF6B1A] block mb-2">
                Join The NatureStudios Network
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase text-[#FFF5ED] tracking-tight">
                Launch Your Custom Subdomain Today
              </h3>
              <p className="text-xs sm:text-sm text-[#B89B8D] max-w-lg mx-auto mt-3 font-light leading-relaxed">
                Build your professional esports and creative portfolio with our 13-step wizard, choose from 9 cinematic themes, and publish to <code className="text-[#FED7B8]">yourname.naturestudio.in</code> with instant SSL.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/portfolio/dashboard"
                  className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy inline-flex items-center gap-2"
                >
                  <span>Open Creator Studio</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FED7B8]" />
                </Link>
                <Link
                  href="/portfolio/preview"
                  className="btn-secondary text-xs py-3 px-6"
                >
                  Explore Theme Gallery
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: GFX IMAGE FULLSCREEN LIGHTBOX                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#1C0507] border border-[#52141A] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-5 flex items-center justify-between border-b border-[#3D0D13] bg-[#180406]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8]">
                      {selectedImage.gfxCategory || 'GFX'}
                    </span>
                    <span className="text-xs font-mono text-[#B89B8D]">{selectedImage.client}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#FFF5ED] uppercase mt-1">
                    {selectedImage.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 text-[#B89B8D] hover:text-[#FFF5ED] rounded-xl hover:bg-[#240709] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Display */}
              <div className="relative flex-1 min-h-[400px] max-h-[65vh] bg-[#120203] flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Modal Footer Info */}
              <div className="p-5 border-t border-[#3D0D13] bg-[#180406] flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#B89B8D] max-w-xl font-light">
                  {selectedImage.description}
                </p>
                {selectedImage.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedImage.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#240709] border border-[#3D0D13] text-[#FED7B8]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: VFX PLAYABLE VIDEO MODAL                        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#1C0507] border border-[#52141A] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Video Header */}
              <div className="p-5 flex items-center justify-between border-b border-[#3D0D13] bg-[#180406]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#59171B] flex items-center justify-center text-[#FED7B8]">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">
                      {activeVideo.client || 'NatureStudios VFX'}
                    </span>
                    <h3 className="text-base font-bold text-[#FFF5ED] uppercase">
                      {activeVideo.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 text-[#B89B8D] hover:text-[#FFF5ED] rounded-xl hover:bg-[#240709] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {activeVideo.videoUrl?.includes('youtube.com') ||
                activeVideo.videoUrl?.includes('youtu.be') ||
                activeVideo.videoUrl?.includes('vimeo.com') ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.videoUrl)}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : activeVideo.videoUrl ? (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8 text-[#B89B8D]">
                    <Film className="w-12 h-12 mx-auto text-[#52141A] mb-2" />
                    <p className="font-mono text-xs">Video streaming link not available.</p>
                  </div>
                )}
              </div>

              {/* Video Footer Info */}
              <div className="p-5 border-t border-[#3D0D13] bg-[#180406] flex items-center justify-between gap-4">
                <p className="text-xs text-[#B89B8D] max-w-lg font-light leading-relaxed">
                  {activeVideo.description}
                </p>
                {activeVideo.duration && (
                  <span className="px-3 py-1 rounded bg-[#2D0A0E] text-xs font-mono text-[#FED7B8] border border-[#52141A]">
                    Duration: {activeVideo.duration}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
