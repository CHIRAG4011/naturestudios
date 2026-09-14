'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { PortfolioData } from '@/lib/portfolio-service';
import {
  Globe,
  Edit3,
  Eye,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Trophy,
  Palette,
  Laptop,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

const THEME_PREVIEWS = [
  { id: 'editorial', name: 'EDITORIAL', desc: 'High-contrast fashion & typography system', color: '#FED7B8' },
  { id: 'cinematic', name: 'CINEMATIC', desc: 'Full-bleed wine atmosphere with ambient light', color: '#E63946' },
  { id: 'esports', name: 'ESPORTS', desc: 'Tournament status badges and angular HUD', color: '#18A957' },
  { id: 'minimal', name: 'MINIMAL', desc: 'Understated precision and clean typography', color: '#FFF5ED' },
  { id: 'creative-grid', name: 'CREATIVE GRID', desc: 'Masonry gallery showcase for visual directors', color: '#FF6B1A' },
  { id: 'immersive', name: 'IMMERSIVE', desc: 'Expansive full-screen visual experience', color: '#FED7B8' },
  { id: 'magazine', name: 'MAGAZINE', desc: 'Editorial multi-column layout composition', color: '#E63946' },
  { id: 'experimental', name: 'EXPERIMENTAL', desc: 'Brutalist scale and oversized typography', color: '#FFF5ED' },
  { id: 'custom', name: 'CUSTOM STUDIO', desc: 'Bespoke custom template builder with custom layout & colors', color: '#FED7B8' },
];

export default function MyPortfolioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Scroll animations for 3D device preview
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ['start end', 'end start'],
  });

  const deviceRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -10]);
  const deviceScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.96]);
  const badgeFloat1 = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);
  const badgeFloat2 = useTransform(scrollYProgress, [0, 1], ['0px', '-60px']);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/portfolio');
      return;
    }

    if (user && (user.isSuspended || user.status === 'SUSPENDED')) {
      router.replace('/dashboard/tickets?type=appeal');
      return;
    }

    if (user) {
      fetch('/api/portfolio')
        .then((res) => res.json())
        .then((data) => {
          if (data.portfolio) {
            setPortfolio(data.portfolio);
          }
        })
        .catch(() => setError('Failed to load portfolio'))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleTogglePublish = async () => {
    if (!portfolio) return;
    setPublishing(true);
    const targetStatus = portfolio.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';

    try {
      const res = await fetch('/api/portfolio/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (data.portfolio) {
        setPortfolio(data.portfolio);
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setPublishing(false);
    }
  };

  const copyPublicUrl = () => {
    if (!portfolio) return;
    const url = `https://${portfolio.slug}.naturestudio.in`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FED7B8] animate-spin" />
      </div>
    );
  }

  const publicUrl = portfolio ? `https://${portfolio.slug}.naturestudio.in` : '';

  return (
    <div className="min-h-screen bg-[#150304] text-[#FFF5ED] font-sans selection:bg-[#59171B] selection:text-[#FED7B8] overflow-x-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#3D0D13] bg-[#1C0507]/90 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-mono uppercase text-[#FED7B8] hover:underline">
            ← Dashboard
          </Link>
          <span className="text-[#52141A]">/</span>
          <span className="text-xs font-mono uppercase text-[#B89B8D]">My Portfolio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/portfolio/edit" className="btn-secondary text-xs py-2 px-4">
            <Edit3 className="w-3.5 h-3.5" /> Edit Portfolio
          </Link>
          <Link href="/portfolio/preview" className="btn-secondary text-xs py-2 px-4">
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </Link>
          {portfolio?.status === 'PUBLISHED' && (
            <a
              href={`/portfolio-render/${portfolio.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-xs py-2 px-4"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public
            </a>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Hero */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-[11px] font-mono uppercase tracking-widest text-[#FED7B8] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> NatureStudios Creator Subdomains
            </div>
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tight text-gradient-warm">
              MY PORTFOLIO
            </h1>
            <p className="text-[#B89B8D] text-sm lg:text-base mt-2 max-w-xl">
              Manage your personal creative portfolio, select bespoke visual themes, and publish your work directly under your unique NatureStudios subdomain.
            </p>
          </div>

          {portfolio && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePublish}
                disabled={publishing}
                className={`btn-primary px-6 py-3 font-mono text-xs uppercase tracking-widest ${
                  portfolio.status === 'PUBLISHED'
                    ? 'bg-[#3A0E11] hover:bg-[#52141A] text-[#FED7B8]'
                    : 'bg-[#59171B] hover:bg-[#7A2228] text-[#FED7B8]'
                }`}
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : portfolio.status === 'PUBLISHED' ? (
                  'Unpublish Portfolio'
                ) : (
                  'Publish to Subdomain'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Portfolio Live Overview Card */}
        {portfolio && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 p-8 rounded-2xl bg-[#240709] border border-[#52141A] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#59171B]/30 to-transparent blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      portfolio.status === 'PUBLISHED'
                        ? 'bg-[#18A957] animate-pulse'
                        : 'bg-[#FED7B8]/40'
                    }`}
                  />
                  <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#FED7B8]">
                    STATUS // {portfolio.status}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#FED7B8] bg-[#3A0E11] px-2.5 py-1 rounded-full border border-[#52141A]">
                  THEME: {portfolio.themeId.toUpperCase()}
                </span>
              </div>

              <div className="mb-6 relative z-10">
                <label className="text-[11px] font-mono uppercase text-[#B89B8D] block mb-2">
                  Public Subdomain Link
                </label>
                <div className="flex items-center gap-2 p-3 bg-[#150304] border border-[#3D0D13] rounded-xl">
                  <Globe className="w-4 h-4 text-[#FED7B8] flex-shrink-0" />
                  <span className="font-mono text-sm text-[#FED7B8] truncate flex-1">
                    {publicUrl}
                  </span>
                  <button
                    onClick={copyPublicUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2D0A0E] text-[11px] font-mono uppercase text-[#FED7B8] hover:bg-[#3A0E11] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#18A957]" /> : <Copy className="w-3.5 h-3.5 text-[#FED7B8]" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#3D0D13] text-center font-mono relative z-10">
                <div>
                  <div className="text-2xl font-black text-[#FFF5ED]">
                    {portfolio.projects?.length || 0}
                  </div>
                  <div className="text-[10px] uppercase text-[#B89B8D] mt-1">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#FFF5ED]">
                    {portfolio.skills?.length || 0}
                  </div>
                  <div className="text-[10px] uppercase text-[#B89B8D] mt-1">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#FFF5ED]">
                    {portfolio.views || 0}
                  </div>
                  <div className="text-[10px] uppercase text-[#B89B8D] mt-1">Total Views</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-8 rounded-2xl bg-[#240709] border border-[#52141A] flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-[#FFF5ED] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/portfolio/edit"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#2D0A0E] hover:bg-[#3A0E11] transition-colors text-xs font-mono uppercase text-[#FED7B8]"
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> 13-Step Wizard
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B89B8D]" />
                  </Link>
                  <Link
                    href="/portfolio/preview"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#2D0A0E] hover:bg-[#3A0E11] transition-colors text-xs font-mono uppercase text-[#FED7B8]"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Device Previews
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B89B8D]" />
                  </Link>
                  <Link
                    href="/portfolio/settings"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#2D0A0E] hover:bg-[#3A0E11] transition-colors text-xs font-mono uppercase text-[#FED7B8]"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders className="w-4 h-4" /> Slug & SEO Settings
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B89B8D]" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-[#3D0D13] flex items-center gap-2 text-[11px] font-mono text-[#B89B8D]">
                <ShieldCheck className="w-4 h-4 text-[#18A957]" />
                <span>Multi-tenant encrypted ownership</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Brief Scroll Animation: 3D Perspective Device & Theme Showcase ── */}
        <section ref={showcaseRef} className="py-12 border-t border-[#3D0D13]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FED7B8] block mb-2">
              INTERACTIVE PREVIEW ENGINE // SCROLL STAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#FFF5ED]">
              How Your Domain Renders
            </h2>
            <p className="text-sm text-[#B89B8D] mt-2">
              Every portfolio receives high-performance responsive styling with dedicated serverless subdomains.
            </p>
          </div>

          {/* 3D Perspective Browser Frame with Floating Kinetic Badges */}
          <div className="relative py-6 [perspective:1200px]">
            {/* Floating Badge Left */}
            <motion.div
              style={{ y: badgeFloat1 }}
              className="hidden lg:flex absolute left-0 top-12 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#2D0A0E] border border-[#52141A] text-xs font-mono text-[#FED7B8] shadow-2xl"
            >
              <Zap className="w-4 h-4 text-[#FF6B1A]" />
              <span>LIVE ON SUBDOMAIN</span>
            </motion.div>

            {/* Floating Badge Right */}
            <motion.div
              style={{ y: badgeFloat2 }}
              className="hidden lg:flex absolute right-0 bottom-12 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#2D0A0E] border border-[#52141A] text-xs font-mono text-[#FFF5ED] shadow-2xl"
            >
              <Lock className="w-4 h-4 text-[#18A957]" />
              <span>TENANT ISOLATED</span>
            </motion.div>

            {/* Main 3D Tilted Device Container */}
            <motion.div
              style={{ rotateX: deviceRotateX, scale: deviceScale }}
              className="w-full rounded-2xl border border-[#52141A] bg-[#1C0507] shadow-2xl overflow-hidden transition-shadow duration-500 hover:shadow-glow-burgundy"
            >
              {/* Browser Chrome Header */}
              <div className="px-4 py-3 bg-[#240709] border-b border-[#3D0D13] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E63946]" />
                  <div className="w-3 h-3 rounded-full bg-[#FED7B8]/40" />
                  <div className="w-3 h-3 rounded-full bg-[#18A957]" />
                </div>
                <div className="px-4 py-1 rounded-full bg-[#150304] border border-[#3D0D13] text-[#FED7B8] text-[11px] truncate max-w-xs">
                  https://{portfolio?.slug || 'username'}.naturestudio.in
                </div>
                <div className="flex items-center gap-2 text-[#B89B8D]">
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="text-[10px]">DESKTOP / MOBILE</span>
                </div>
              </div>

              {/* Embedded Live Preview Canvas */}
              <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-[#1E0608] to-[#150304] relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A080C] text-[10px] font-mono text-[#FED7B8] mb-4">
                  <span>ACTIVE THEME: {portfolio?.themeId?.toUpperCase() || 'EDITORIAL'}</span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-black uppercase text-[#FFF5ED] tracking-tight mb-4">
                  {portfolio?.personalInfo?.fullName || 'CREATOR NAME'}
                </h3>
                <p className="text-sm sm:text-base text-[#D4B39B] max-w-lg mx-auto font-light mb-8">
                  {portfolio?.personalInfo?.tagline || 'Esports Broadcast Director & Visual Systems Architect.'}
                </p>

                <div className="flex items-center justify-center gap-4">
                  <Link href="/portfolio/preview" className="btn-beige text-xs py-2.5 px-5">
                    <Eye className="w-3.5 h-3.5" /> Full Device Preview
                  </Link>
                  <Link href="/portfolio/edit" className="btn-secondary text-xs py-2.5 px-5">
                    <Palette className="w-3.5 h-3.5" /> Switch Theme
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 8 Themes Grid Preview with Scroll Cards */}
          <div className="mt-16">
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#FFF5ED] mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#FED7B8]" />
              <span>Available Bespoke Themes & Custom Studio (9)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {THEME_PREVIEWS.map((th) => {
                const isSelected = portfolio?.themeId === th.id;
                return (
                  <motion.div
                    key={th.id}
                    whileHover={{ y: -4 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-[#2D0A0E] border-[#FED7B8] shadow-glow-beige'
                        : 'bg-[#240709] border-[#3D0D13] hover:border-[#52141A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold tracking-wider text-[#FED7B8]">
                        {th.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono bg-[#18A957] text-black px-1.5 py-0.5 rounded font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#B89B8D] leading-relaxed mb-4">
                      {th.desc}
                    </p>
                    <Link
                      href="/portfolio/edit"
                      className="text-[11px] font-mono uppercase text-[#FED7B8] hover:underline inline-flex items-center gap-1"
                    >
                      Select Theme →
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
