'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VfxVideoPlayer } from '@/components/portfolio/VfxVideoPlayer';
import { ContactTicketModal } from '@/components/portfolio/ContactTicketModal';
import type { StudioPortfolioItem } from '@/lib/portfolio-shared';
import { DEFAULT_STUDIO_PORTFOLIO_ITEMS, toGfxCategorySlug, toVfxCategorySlug } from '@/lib/portfolio-shared';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Layers,
  Maximize2,
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  Trophy,
  Users,
  Bookmark,
  Zap,
  Mail,
  Instagram,
} from 'lucide-react';
import { DiscordIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';

export default function StudioPortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<StudioPortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [allStudioItems, setAllStudioItems] = useState<StudioPortfolioItem[]>(DEFAULT_STUDIO_PORTFOLIO_ITEMS);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch single item
    fetch(`/api/portfolio/studio/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.item) {
          setItem(data.item);
        } else {
          // Fallback to default items
          const found = DEFAULT_STUDIO_PORTFOLIO_ITEMS.find((i) => i.id === id);
          if (found) setItem(found);
        }
      })
      .catch(() => {
        const found = DEFAULT_STUDIO_PORTFOLIO_ITEMS.find((i) => i.id === id);
        if (found) setItem(found);
      })
      .finally(() => setLoading(false));

    // Fetch all items for past work listing
    fetch('/api/portfolio/studio')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setAllStudioItems(data.items);
        }
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#38BDF8]">
            <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] border-t-[#38BDF8] animate-spin" />
            <span>Loading studio production details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-40 px-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-black uppercase text-[#F8FAFC]">Project Not Found</h1>
            <p className="text-xs text-[#94A3B8]">
              The studio portfolio item you requested could not be located.
            </p>
            <Link href="/portfolio" className="btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio Portfolio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Related and past work in the studio (excluding current item)
  const pastWorks = allStudioItems.filter((i) => i.id !== item.id);

  // Generate complete gallery of graphic images for this project
  const userUploadedImages = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : Array.isArray(item.gallery) && item.gallery.length > 0
    ? item.gallery
    : [];

  const galleryImages = userUploadedImages.length > 0
    ? [item.imageUrl, ...userUploadedImages].filter((img, idx, arr) => Boolean(img) && arr.indexOf(img) === idx)
    : [
        item.imageUrl,
        '/media/work-valorant-championship.jpg',
        '/media/work-nexus-arena.jpg',
        '/media/hero-lightfield.jpg',
      ].filter((img, idx, arr) => Boolean(img) && arr.indexOf(img) === idx);

  const subsectionSlug = item.gfxCategory ? item.gfxCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* BREADCRUMBS & NAVIGATION */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <Link href="/portfolio" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Studio Portfolio
            </Link>
            <span>/</span>
            <Link
              href={item.type === 'GFX' ? '/portfolio/gfx' : '/portfolio/vfx'}
              className="hover:text-[#38BDF8] transition-colors uppercase font-bold text-[#38BDF8]"
            >
              {item.type}
            </Link>
            {item.gfxCategory && (
              <>
                <span>/</span>
                <Link
                  href={`/portfolio/gfx/${toGfxCategorySlug(item.gfxCategory)}`}
                  className="hover:text-[#38BDF8] transition-colors uppercase"
                >
                  {item.gfxCategory}
                </Link>
              </>
            )}
            {item.vfxCategory && (
              <>
                <span>/</span>
                <Link
                  href={`/portfolio/vfx?category=${toVfxCategorySlug(item.vfxCategory)}`}
                  className="hover:text-[#38BDF8] transition-colors uppercase"
                >
                  {item.vfxCategory}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#F8FAFC] truncate max-w-xs">{item.title}</span>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#030712] border border-[#1E3A8A] shadow-glow-burgundy relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#2563EB]/30 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/30 font-mono text-xs uppercase tracking-wider font-bold">
                  {item.type} {item.gfxCategory ? `• ${item.gfxCategory}` : item.vfxCategory ? `• ${item.vfxCategory}` : '• Motion Graphics'}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0F1D38] text-[#94A3B8] border border-[#172554] font-mono text-xs uppercase">
                  Client: {item.client}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#18A957]/15 text-[#18A957] border border-[#18A957]/30 font-mono text-[11px] uppercase font-bold">
                  Verified Studio Asset
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F8FAFC] font-syne leading-tight">
                {item.title}
              </h1>

              <p className="text-sm sm:text-base text-[#D4B5A5] leading-relaxed font-light">
                {item.description}
              </p>

              {/* Action row with Contact Now Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Contact Now / Commission Admin</span>
                </button>

                <Link
                  href={
                    item.type === 'GFX' && item.gfxCategory
                      ? `/portfolio/gfx/${toGfxCategorySlug(item.gfxCategory)}`
                      : item.type === 'GFX'
                      ? '/portfolio/gfx'
                      : item.vfxCategory
                      ? `/portfolio/vfx?category=${toVfxCategorySlug(item.vfxCategory)}`
                      : '/portfolio/vfx'
                  }
                  className="btn-secondary text-xs py-3 px-5 flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>View All in {item.gfxCategory || item.vfxCategory || item.type}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PRIMARY MEDIA DISPLAY */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#172554] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] block">
                  SHOWCASE REEL & HIGH-RES ASSETS
                </span>
                <h2 className="text-2xl font-black uppercase text-[#F8FAFC]">
                  {item.type === 'VFX' ? 'Interactive Video Reel' : 'Deliverable Graphic Assets'}
                </h2>
              </div>
              <span className="text-xs font-mono text-[#94A3B8]">
                {item.type === 'VFX' ? '4K Ultra-HD Stream' : `${galleryImages.length} High-Res Deliverables`}
              </span>
            </div>

            {/* If VFX: Video Player */}
            {item.type === 'VFX' && (
              <div className="rounded-3xl overflow-hidden border border-[#1E3A8A] bg-[#050B17] shadow-2xl">
                <VfxVideoPlayer
                  src={item.videoUrl || '/media/infinix/vfx/infinix-teaser-trailer.mp4'}
                  poster={item.thumbnailUrl || item.imageUrl}
                  title={item.title}
                  className="aspect-video"
                />
              </div>
            )}

            {/* If GFX: Primary Main Image + All Gallery Images */}
            {item.type === 'GFX' && (
              <div className="space-y-6">
                {/* Main Hero Artwork */}
                <div
                  onClick={() => setActiveLightboxImg(item.imageUrl)}
                  className="group relative rounded-3xl overflow-hidden border border-[#1E3A8A] bg-[#050B17] shadow-2xl cursor-pointer aspect-video sm:aspect-[21/9]"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                    <span className="text-xs font-mono text-[#38BDF8] uppercase">
                      Click to expand in full-screen Lightbox
                    </span>
                    <div className="p-2 rounded-xl bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/30">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Sub-gallery of deliverable designs */}
                <div>
                  <h3 className="text-sm font-mono uppercase text-[#38BDF8] font-bold mb-3">
                    Project Deliverable Assets & Variations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveLightboxImg(img)}
                        className="group relative aspect-video rounded-2xl overflow-hidden border border-[#172554] hover:border-[#38BDF8] bg-[#050B17] cursor-pointer transition-all duration-300"
                      >
                        <img
                          src={img}
                          alt={`Asset #${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                          <span className="text-[11px] font-mono text-[#38BDF8] uppercase font-bold flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" /> Expand Asset #{idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* DETAILED NARRATIVE & METADATA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Narrative */}
            <div className="lg:col-span-2 p-8 rounded-3xl bg-[#050B17] border border-[#172554] space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8]">
                  PROJECT BRIEF & ARCHITECTURE
                </span>
                <h3 className="text-2xl font-black uppercase text-[#F8FAFC] mt-1">
                  Creative Direction & Execution
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  NatureStudios was commissioned by <strong>{item.client}</strong> to develop the complete visual
                  architecture for this production. Tailored specifically for tier-1 competitive esports broadcast
                  environments, every asset adheres to broadcast safe-zones, dynamic game-state integration, and
                  sub-second visual readability.
                </p>
                <p>
                  The deliverable suite integrates motion graphics telemetry, high-impact key visuals, and modular branding
                  designed to scale seamlessly from digital stadium ribbon boards to 4K YouTube and Twitch stream outputs.
                </p>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-[#172554]">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-2">
                  PRODUCTION TAGS & KEYWORDS
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#0B132B] border border-[#172554] text-[#38BDF8] font-mono text-xs uppercase"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Production Metadata Card */}
            <div className="p-8 rounded-3xl bg-[#050B17] border border-[#172554] space-y-6 flex flex-col justify-between">
              <div className="space-y-4 font-mono text-xs">
                <span className="text-[10px] uppercase tracking-widest text-[#38BDF8] block">
                  COMMISSION SPECIFICATIONS
                </span>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-[#172554] pb-2">
                    <span className="text-[#94A3B8]">CLIENT / ORG:</span>
                    <span className="text-[#F8FAFC] font-bold">{item.client}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#172554] pb-2">
                    <span className="text-[#94A3B8]">DISCIPLINE:</span>
                    <span className="text-[#38BDF8] uppercase font-bold">{item.type}</span>
                  </div>
                  {item.gfxCategory && (
                    <div className="flex justify-between border-b border-[#172554] pb-2">
                      <span className="text-[#94A3B8]">SUBSECTION:</span>
                      <span className="text-[#38BDF8] uppercase font-bold">{item.gfxCategory}</span>
                    </div>
                  )}
                  {item.vfxCategory && (
                    <div className="flex justify-between border-b border-[#172554] pb-2">
                      <span className="text-[#94A3B8]">SUBSECTION:</span>
                      <span className="text-[#38BDF8] uppercase font-bold">{item.vfxCategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-[#172554] pb-2">
                    <span className="text-[#94A3B8]">PIPELINE:</span>
                    <span className="text-[#F8FAFC]">Photoshop / AE / 3D</span>
                  </div>
                  <div className="flex justify-between border-b border-[#172554] pb-2">
                    <span className="text-[#94A3B8]">RESOLUTION:</span>
                    <span className="text-[#F8FAFC]">3840 × 2160 (4K Master)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#172554] pb-2">
                    <span className="text-[#94A3B8]">OWNERSHIP:</span>
                    <span className="text-[#18A957] font-bold">Studio Production</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1D38] border border-[#1E3A8A] space-y-3">
                <span className="text-xs font-bold uppercase text-[#38BDF8] block">
                  Commission Similar Work
                </span>
                <p className="text-[11px] text-[#94A3B8] leading-tight">
                  Need tournament graphics, lineup cards, or cinematic broadcast openers for your esports brand?
                </p>

                <div className="pt-2 space-y-2 text-[11px] font-mono border-t border-[#172554]">
                  <a
                    href="mailto:naturestudio05@gmail.com"
                    className="flex items-center gap-2 text-[#38BDF8] hover:text-[#F8FAFC] transition-colors"
                    title="Send email to naturestudio05@gmail.com"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>naturestudio05@gmail.com</span>
                  </a>
                  <a
                    href="https://wa.me/917480066539"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors"
                    title="WhatsApp: +91 7480 066 539"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+91 7480 066 539 (WhatsApp)</span>
                  </a>
                  <a
                    href="https://discord.gg/PTVReHZp4n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
                    title="Join Discord Community"
                  >
                    <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Discord Community</span>
                  </a>
                  <a
                    href="https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-300 hover:text-white transition-colors"
                    title="Instagram @naturestudio.in"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>@naturestudio.in (Instagram DM)</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="w-full btn-primary text-xs py-2.5 justify-center shadow-glow-burgundy cursor-pointer mt-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Contact Studio Admin</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PAST WORK & RELATED STUDIO PRODUCTIONS */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#172554] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] block">
                  STUDIO ARCHIVES
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F8FAFC]">
                  All Past Studio Work & Productions
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="text-xs font-mono uppercase text-[#38BDF8] hover:underline flex items-center gap-1.5"
              >
                <span>Browse All Studio Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List of Past Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastWorks.slice(0, 6).map((past) => (
                <Link
                  key={past.id}
                  href={`/portfolio/${past.id}`}
                  className="group rounded-2xl bg-[#050B17] border border-[#172554] hover:border-[#38BDF8] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-burgundy flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] relative overflow-hidden bg-[#030712]">
                      <img
                        src={past.imageUrl}
                        alt={past.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded bg-[#2563EB]/90 text-[#38BDF8] text-[9px] font-mono uppercase font-bold border border-[#38BDF8]/30">
                          {past.type} {past.gfxCategory ? `• ${past.gfxCategory}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                        {past.client}
                      </span>
                      <h4 className="text-base font-black uppercase text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                        {past.title}
                      </h4>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {past.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs font-mono text-[#38BDF8] border-t border-[#172554]/60 mt-3 pt-3">
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#0F1D38] text-[#F8FAFC] border border-[#1E3A8A] z-10 hover:bg-[#2563EB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#1E3A8A]"
            >
              <img
                src={activeLightboxImg}
                alt="Enlarged Showcase Artwork"
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT TICKET MODAL */}
      <ContactTicketModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        targetType="STUDIO"
        targetName="NatureStudios Admin"
        portfolioTitle={item.title}
      />

      <Footer />
    </div>
  );
}
