'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VfxVideoPlayer } from '@/components/portfolio/VfxVideoPlayer';
import { ContactTicketModal } from '@/components/portfolio/ContactTicketModal';
import type { PortfolioData } from '@/lib/portfolio-shared';
import { DEFAULT_COMMUNITY_PORTFOLIO_ITEMS, toGfxCategorySlug } from '@/lib/portfolio-shared';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
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
  Copy,
  Check,
  Briefcase,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface RelatedCreator {
  id: string;
  slug: string;
  title: string;
  name: string;
  avatar?: string;
  role: string;
  category?: string;
  gfxSubcategory?: string;
  mediaUrl: string;
  subdomainUrl: string;
}

export default function GlobalCreatorPortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [relatedPortfolios, setRelatedPortfolios] = useState<RelatedCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title?: string; caption?: string } | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetch(`/api/portfolio/global/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolio) {
          setPortfolio(data.portfolio);
          if (data.relatedPortfolios) {
            setRelatedPortfolios(data.relatedPortfolios);
          }
        } else {
          // Fallback to sample community portfolios
          const found = DEFAULT_COMMUNITY_PORTFOLIO_ITEMS.find((c) => c.slug === slug);
          if (found) {
            setPortfolio(found);
            const others = DEFAULT_COMMUNITY_PORTFOLIO_ITEMS.filter((c) => c.slug !== slug).slice(0, 3);
            setRelatedPortfolios(
              others.map((o) => ({
                id: o.id,
                slug: o.slug,
                title: o.title,
                name: o.personalInfo?.fullName || o.title,
                avatar: o.personalInfo?.profileImage,
                role: o.professionalIdentity?.primaryRole || o.personalInfo?.professionalTitle || 'Creator',
                category: o.category,
                gfxSubcategory: o.gfxSubcategory,
                mediaUrl: o.mediaUrl || o.mediaGallery?.[0] || '/media/work-valorant-championship.jpg',
                subdomainUrl: `https://${o.slug}.naturestudio.in`,
              }))
            );
          }
        }
      })
      .catch(() => {
        const found = DEFAULT_COMMUNITY_PORTFOLIO_ITEMS.find((c) => c.slug === slug);
        if (found) setPortfolio(found);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopySubdomain = () => {
    if (!portfolio) return;
    const url = `https://${portfolio.slug}.naturestudio.in`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#FED7B8]">
            <div className="w-8 h-8 rounded-full border-2 border-[#59171B] border-t-[#FED7B8] animate-spin" />
            <span>Loading creator portfolio details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-40 px-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-black uppercase text-[#FFF5ED]">Creator Not Found</h1>
            <p className="text-xs text-[#B89B8D]">
              The community creator portfolio you requested could not be found or may have been updated.
            </p>
            <Link
              href="/global-portfolio"
              className="btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Global Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const creatorName = portfolio.personalInfo?.fullName || portfolio.title;
  const creatorRole =
    portfolio.professionalIdentity?.primaryRole ||
    portfolio.personalInfo?.professionalTitle ||
    'Creator Specialist';
  const categoryLabel =
    portfolio.category === 'GFX' && portfolio.gfxSubcategory
      ? `GFX • ${portfolio.gfxSubcategory}`
      : portfolio.category || 'Creator Portfolio';

  // Aggregate all uploaded images from mediaGallery, mediaUrl, and project thumbnails
  const allUploadedImages: { url: string; title: string; caption?: string }[] = [];
  const addedUrls = new Set<string>();

  if (portfolio.mediaUrl) {
    allUploadedImages.push({
      url: portfolio.mediaUrl,
      title: portfolio.title,
      caption: portfolio.description || 'Primary Showcase Artwork',
    });
    addedUrls.add(portfolio.mediaUrl);
  }

  if (portfolio.mediaGallery && portfolio.mediaGallery.length > 0) {
    for (const gUrl of portfolio.mediaGallery) {
      if (!addedUrls.has(gUrl)) {
        allUploadedImages.push({
          url: gUrl,
          title: `${creatorName} Deliverable`,
          caption: 'High-resolution showcase deliverable',
        });
        addedUrls.add(gUrl);
      }
    }
  }

  for (const proj of portfolio.projects || []) {
    if (proj.thumbnail && !addedUrls.has(proj.thumbnail)) {
      allUploadedImages.push({
        url: proj.thumbnail,
        title: proj.title,
        caption: proj.description || proj.client,
      });
      addedUrls.add(proj.thumbnail);
    }
    if (proj.gallery && proj.gallery.length > 0) {
      for (const pG of proj.gallery) {
        if (!addedUrls.has(pG)) {
          allUploadedImages.push({
            url: pG,
            title: `${proj.title} Asset`,
            caption: proj.client || 'Project Asset',
          });
          addedUrls.add(pG);
        }
      }
    }
  }

  // Fallback images if empty
  if (allUploadedImages.length === 0) {
    allUploadedImages.push({
      url: '/media/work-valorant-championship.jpg',
      title: portfolio.title,
      caption: 'Portfolio Showcase Artwork',
    });
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* TOP BREADCRUMB & BACK NAVIGATION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3D0D13]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B89B8D]">
              <Link href="/global-portfolio" className="hover:text-[#FED7B8] transition-colors">
                Global Portfolio
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#52141A]" />
              <Link
                href={
                  portfolio.category === 'GFX' && portfolio.gfxSubcategory
                    ? `/global-portfolio/gfx/${toGfxCategorySlug(portfolio.gfxSubcategory)}`
                    : portfolio.category === 'GFX'
                    ? '/global-portfolio/gfx'
                    : '/global-portfolio/vfx'
                }
                className="text-[#FED7B8] hover:underline"
              >
                {categoryLabel}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#52141A]" />
              <span className="text-[#FFF5ED] font-bold truncate max-w-[200px]">{creatorName}</span>
            </div>

            <Link
              href={
                portfolio.category === 'GFX' && portfolio.gfxSubcategory
                  ? `/global-portfolio/gfx/${toGfxCategorySlug(portfolio.gfxSubcategory)}`
                  : portfolio.category === 'GFX'
                  ? '/global-portfolio/gfx'
                  : '/global-portfolio/vfx'
              }
              className="px-3.5 py-1.5 rounded-xl bg-[#1D0608] hover:bg-[#2A080C] border border-[#3D0D13] hover:border-[#FED7B8]/40 text-xs font-mono uppercase text-[#FED7B8] inline-flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {portfolio.gfxSubcategory ? `${portfolio.gfxSubcategory} Portfolios` : 'Directory'}</span>
            </Link>
          </div>
        </section>

        {/* CREATOR MASTHEAD HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#240709] via-[#1D0608] to-[#150304] border border-[#59171B] p-6 sm:p-10 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#59171B]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Creator Identity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar with Glow Ring */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#2A080C] border-2 border-[#FED7B8]/50 overflow-hidden shadow-glow-burgundy flex-shrink-0 flex items-center justify-center font-syne font-black text-2xl text-[#FED7B8]">
                    {portfolio.personalInfo?.profileImage ? (
                      <img
                        src={portfolio.personalInfo.profileImage}
                        alt={creatorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      creatorName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-[#59171B]/70 border border-[#FED7B8]/30 text-xs font-mono uppercase text-[#FED7B8] font-bold">
                      {categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] uppercase font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>NatureStudios Verified</span>
                    </span>
                  </div>

                  <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#FFF5ED] tracking-tight">
                    {creatorName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#B89B8D]">
                    <span className="text-[#FED7B8] font-semibold">{creatorRole}</span>
                    {portfolio.personalInfo?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FED7B8]/70" />
                        <span>{portfolio.personalInfo.location}</span>
                      </span>
                    )}
                    {portfolio.personalInfo?.availability && (
                      <span className="px-2 py-0.5 rounded-md bg-[#2A080C] border border-[#52141A] text-emerald-300">
                        {portfolio.personalInfo.availability}
                      </span>
                    )}
                  </div>

                  {portfolio.personalInfo?.tagline && (
                    <p className="text-xs sm:text-sm text-[#FED7B8]/90 italic font-light max-w-xl">
                      &quot;{portfolio.personalInfo.tagline}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons & Subdomain Link Box */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy inline-flex items-center justify-center gap-2.5 cursor-pointer font-bold"
                >
                  <Send className="w-4 h-4 text-[#FED7B8]" />
                  <span>Contact Now / Create Ticket</span>
                </button>

                {/* Subdomain pill */}
                <div className="p-2.5 rounded-2xl bg-[#150304]/80 border border-[#3D0D13] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FED7B8] truncate">
                    <Globe className="w-3.5 h-3.5 text-[#FED7B8]/70 shrink-0" />
                    <span className="truncate">{portfolio.slug}.naturestudio.in</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopySubdomain}
                      className="p-1.5 rounded-lg bg-[#240709] hover:bg-[#3D0D13] border border-[#52141A] text-[#FED7B8] transition-colors"
                      title="Copy subdomain URL"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://${portfolio.slug}.naturestudio.in`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#59171B]/60 hover:bg-[#59171B] border border-[#FED7B8]/30 text-[#FED7B8] transition-colors"
                      title="Open live subdomain site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS & QUICK SPECIFICATIONS BAR */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-3xl bg-[#1D0608] border border-[#3D0D13]">
            <div className="p-3 rounded-2xl bg-[#150304] border border-[#3D0D13]/60">
              <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">Category & Focus</span>
              <span className="font-syne font-bold text-sm text-[#FED7B8]">{categoryLabel}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#150304] border border-[#3D0D13]/60">
              <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">Past Productions</span>
              <span className="font-syne font-bold text-sm text-[#FED7B8]">
                {portfolio.projects?.length || 0} Listed Projects
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#150304] border border-[#3D0D13]/60">
              <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">Direct Subdomain</span>
              <span className="font-syne font-bold text-sm text-emerald-400">Live & Verified</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#150304] border border-[#3D0D13]/60">
              <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">Design Theme</span>
              <span className="font-syne font-bold text-sm text-[#FED7B8] uppercase">
                {portfolio.themeId || 'Editorial'}
              </span>
            </div>
          </div>
        </section>

        {/* FULL PORTFOLIO DETAILS & BIO */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <div className="rounded-3xl bg-[#1D0608] border border-[#3D0D13] p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FED7B8] block mb-2">
                Portfolio Overview & Creative Brief
              </span>
              <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#FFF5ED]">
                {portfolio.title}
              </h2>
            </div>

            {portfolio.description && (
              <p className="text-sm sm:text-base text-[#B89B8D] leading-relaxed max-w-4xl">
                {portfolio.description}
              </p>
            )}

            {portfolio.personalInfo?.aboutMe && portfolio.personalInfo.aboutMe !== portfolio.description && (
              <div className="p-5 rounded-2xl bg-[#150304] border border-[#3D0D13] space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#FED7B8] font-bold block">
                  About {creatorName}:
                </span>
                <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed">
                  {portfolio.personalInfo.aboutMe}
                </p>
              </div>
            )}

            {/* Skills & Tooling */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <div className="pt-4 border-t border-[#3D0D13]/60">
                <span className="text-xs font-mono uppercase text-[#B89B8D] block mb-3">
                  Production Tooling & Mastered Software:
                </span>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((skill) => (
                    <span
                      key={skill.id || skill.name}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-[#150304] border border-[#52141A] text-[#FED7B8] flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3 text-[#FED7B8]" />
                      <span>{skill.name}</span>
                      {skill.proficiency && (
                        <span className="text-[10px] text-[#B89B8D]">({skill.proficiency}%)</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* VFX VIDEO SHOWCASE (IF VIDEO EXISTS) */}
        {(portfolio.category === 'VFX' || portfolio.mediaType === 'video' || portfolio.projects?.some((p) => p.videoUrl)) && (
          <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
            <div className="rounded-3xl bg-[#1D0608] border border-purple-500/30 p-6 sm:p-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300">
                <Film className="w-4 h-4 text-purple-400" />
                <span>Motion VFX Showreel</span>
              </div>
              <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                Featured Video Reel & Motion Deliverables
              </h3>
              <div className="max-w-4xl mx-auto pt-2">
                <VfxVideoPlayer
                  src={
                    portfolio.mediaUrl ||
                    portfolio.projects?.find((p) => p.videoUrl)?.videoUrl ||
                    '/media/infinix/vfx/infinix-teaser-trailer.mp4'
                  }
                  poster={portfolio.videoThumbnailUrl || portfolio.mediaUrl}
                  title={`${creatorName} Reel`}
                />
              </div>
            </div>
          </section>
        )}

        {/* ALL UPLOADED DELIVERABLES & HIGH-RES ARTWORK GALLERY */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#3D0D13]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FED7B8] block mb-1">
                Visual Deliverables
              </span>
              <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#FFF5ED]">
                All Uploaded Deliverables & Images ({allUploadedImages.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#B89B8D]">
              Click any deliverable to zoom in high resolution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allUploadedImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(img)}
                className="group relative aspect-video rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] cursor-pointer transition-all duration-300 hover:shadow-glow-burgundy"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="self-end px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase text-[#FED7B8] border border-white/20">
                    Deliverable #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-sm text-white">{img.title}</h4>
                    {img.caption && <p className="text-[11px] text-[#FED7B8]/80 line-clamp-1">{img.caption}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ALL PAST WORK LISTED */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="mb-6 pb-4 border-b border-[#3D0D13]">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FED7B8] block mb-1">
              Production History
            </span>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#FFF5ED]">
              All Past Work & Client Projects
            </h2>
            <p className="text-xs text-[#B89B8D] mt-1">
              Complete catalog of tournament productions, client work, and community commissions executed by {creatorName}.
            </p>
          </div>

          {!portfolio.projects || portfolio.projects.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#1D0608] border border-[#3D0D13] text-center text-xs font-mono text-[#B89B8D]">
              No past client projects explicitly cataloged yet.
            </div>
          ) : (
            <div className="space-y-6">
              {portfolio.projects.map((proj, pIdx) => (
                <article
                  key={proj.id || pIdx}
                  className="rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] transition-all p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:items-center justify-between"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#2A080C] text-[#FED7B8] border border-[#52141A]">
                        {proj.workType || proj.category || 'GFX'}
                      </span>
                      {proj.client && (
                        <span className="text-xs font-mono text-[#FED7B8] font-bold">
                          Client: {proj.client}
                        </span>
                      )}
                    </div>

                    <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                      {proj.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed max-w-3xl">
                      {proj.description}
                    </p>

                    {/* Challenge & Solution if specified */}
                    {(proj.challenge || proj.solution) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                        {proj.challenge && (
                          <div className="p-3 rounded-xl bg-[#150304] border border-[#3D0D13]">
                            <span className="font-mono text-[10px] uppercase text-[#FED7B8] block mb-1">
                              Challenge:
                            </span>
                            <span className="text-[#B89B8D]">{proj.challenge}</span>
                          </div>
                        )}
                        {proj.solution && (
                          <div className="p-3 rounded-xl bg-[#150304] border border-[#3D0D13]">
                            <span className="font-mono text-[10px] uppercase text-emerald-400 block mb-1">
                              Solution:
                            </span>
                            <span className="text-[#B89B8D]">{proj.solution}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tools */}
                    {proj.tools && proj.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.tools.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#150304] border border-[#3D0D13] text-[#B89B8D]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Thumbnail if available */}
                  {proj.thumbnail && (
                    <div
                      onClick={() =>
                        setActiveLightboxImg({
                          url: proj.thumbnail!,
                          title: proj.title,
                          caption: proj.client,
                        })
                      }
                      className="w-full lg:w-72 aspect-video rounded-2xl overflow-hidden bg-[#150304] border border-[#3D0D13] shrink-0 cursor-pointer group/thumb relative"
                    >
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-[#150304]/90 text-xs font-mono uppercase text-[#FED7B8] flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> Zoom
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* BOTTOM CALL TO ACTION: CONTACT CREATOR NOW */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#240709] via-[#1D0608] to-[#150304] border border-[#59171B] p-8 sm:p-12 text-center shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59171B]/50 border border-[#FED7B8]/20 text-xs font-mono uppercase text-[#FED7B8]">
                <Send className="w-3.5 h-3.5 text-[#FED7B8]" />
                <span>Commission & Collaboration</span>
              </div>

              <h2 className="font-syne text-3xl sm:text-4xl font-black uppercase text-[#FFF5ED]">
                Work Directly With {creatorName}
              </h2>

              <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed">
                Clicking Contact Now opens an official ticket inquiry routed directly to {creatorName}&apos;s dashboard.
                NatureStudios oversees verified delivery and communications.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="btn-primary text-xs py-3 px-8 shadow-glow-burgundy inline-flex items-center gap-2 cursor-pointer font-bold"
                >
                  <Send className="w-4 h-4 text-[#FED7B8]" />
                  <span>Contact Now / Start Ticket</span>
                </button>

                <a
                  href={`https://${portfolio.slug}.naturestudio.in`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-3 px-6 inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-[#FED7B8]" />
                  <span>Visit Custom Subdomain</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED CREATORS IN THE SAME CATEGORY */}
        {relatedPortfolios.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-6 pb-4 border-b border-[#3D0D13]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FED7B8] block mb-1">
                More Community Talent
              </span>
              <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                Related Creators in {categoryLabel}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPortfolios.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/global-portfolio/${rel.slug}`}
                  className="group rounded-3xl overflow-hidden bg-[#1D0608] border border-[#3D0D13] hover:border-[#FED7B8] transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#150304]">
                      <img
                        src={rel.mediaUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-base text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors">
                        {rel.name}
                      </h4>
                      <span className="text-xs font-mono text-[#B89B8D]">{rel.role}</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#3D0D13]/60 flex items-center justify-between text-xs font-mono text-[#FED7B8]">
                    <span>View Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FULL RESOLUTION IMAGE LIGHTBOX */}
      {activeLightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-[#1C0507] border border-[#59171B] overflow-hidden shadow-2xl">
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-[#3D0D13] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FED7B8] tracking-widest block">
                  {creatorName} • Deliverable Zoom
                </span>
                <h4 className="font-syne text-lg font-bold text-[#FFF5ED]">
                  {activeLightboxImg.title || 'High-Resolution Deliverable'}
                </h4>
              </div>
              <button
                onClick={() => setActiveLightboxImg(null)}
                className="p-2 rounded-full bg-[#150304] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#110203]">
              <img
                src={activeLightboxImg.url}
                alt={activeLightboxImg.title || 'Artwork'}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Info Footer */}
            {activeLightboxImg.caption && (
              <div className="p-4 sm:p-5 border-t border-[#3D0D13] text-xs text-[#B89B8D]">
                <span>{activeLightboxImg.caption}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTACT TICKET MODAL */}
      <ContactTicketModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        targetType="CREATOR"
        targetName={creatorName}
        targetUserId={portfolio.userId}
        targetUserEmail={portfolio.personalInfo?.publicEmail}
        portfolioTitle={portfolio.title}
        portfolioSlug={portfolio.slug}
      />

      <Footer />
    </div>
  );
}
