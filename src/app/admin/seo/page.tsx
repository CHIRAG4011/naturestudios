'use client';

import React, { useState } from 'react';
import {
  Search,
  Globe,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';

export default function AdminSeoPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const siteUrl = 'https://naturestudio.in';
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const robotsUrl = `${siteUrl}/robots.txt`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const steps = [
    {
      num: '01',
      title: 'Open Google Search Console',
      badge: 'Mandatory',
      description:
        'Navigate to search.google.com/search-console and log in with your primary studio Google account (e.g. naturestudio05@gmail.com).',
      actionText: 'Open Search Console',
      actionUrl: 'https://search.google.com/search-console',
    },
    {
      num: '02',
      title: 'Add Property & Verify Ownership',
      badge: 'Quick Setup',
      description:
        'Select "Domain" or "URL prefix" (https://naturestudio.in). Verify using DNS TXT record or the HTML meta tag: copy the code into NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in your Vercel or production .env.',
      codeSnippet: '<meta name="google-site-verification" content="YOUR_GOOGLE_CODE" />',
    },
    {
      num: '03',
      title: 'Submit Dynamic Sitemap',
      badge: 'Instant Indexing',
      description:
        'In the left sidebar of Google Search Console, click "Sitemaps". Enter "sitemap.xml" and hit Submit. Googlebot will queue all 20+ pages (GFX, VFX, Jersey, case studies).',
      copyValue: sitemapUrl,
      copyLabel: 'Copy sitemap.xml URL',
    },
    {
      num: '04',
      title: 'Request Immediate URL Inspection',
      badge: 'Within 24 Hours',
      description:
        'Paste https://naturestudio.in in the top search bar in GSC ("Inspect any URL in naturestudio.in"). Once loaded, click "Request Indexing". Googlebot crawls the page within hours.',
      actionText: 'Search Console Inspect',
      actionUrl: 'https://search.google.com/search-console',
    },
    {
      num: '05',
      title: 'Build External Authority & Brand Signals',
      badge: 'Ranking Boost',
      description:
        'Add https://naturestudio.in to your official Instagram bio (@naturestudio.in), Discord server welcome channel, YouTube channel about section, and Twitter profile. Google recognizes these cross-platform signals to grant a Knowledge Panel.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1D0608] border border-[#59171B]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Google Search & SEO Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Crawler Ready
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Production search engine indexing architecture, Schema.org rich results, dynamic XML sitemaps, and ranking guide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D93D4A] to-[#B32633] text-[#FFF5ED] text-xs font-semibold shadow-lg shadow-[#D93D4A]/20 hover:brightness-110 transition-all"
          >
            Google Search Console
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Real-time SEO Technical Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#B89B8D]">SITEMAP STATUS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#FFF5ED]">Active & Dynamic</div>
          <p className="text-[11px] text-[#B89B8D] mt-1">Includes GFX, VFX, Jersey & Case Studies</p>
          <div className="mt-3 pt-3 border-t border-[#3D0D13]/60 flex items-center justify-between">
            <a
              href="/sitemap.xml"
              target="_blank"
              className="text-xs text-[#D93D4A] hover:underline flex items-center gap-1"
            >
              /sitemap.xml <ArrowUpRight className="w-3 h-3" />
            </a>
            <button
              onClick={() => copyToClipboard(sitemapUrl, 'sitemap')}
              className="text-[11px] text-[#B89B8D] hover:text-[#FFF5ED]"
            >
              {copiedKey === 'sitemap' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#B89B8D]">ROBOTS.TXT</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#FFF5ED]">Googlebot Allowed</div>
          <p className="text-[11px] text-[#B89B8D] mt-1">Protects /admin while indexing public hub</p>
          <div className="mt-3 pt-3 border-t border-[#3D0D13]/60 flex items-center justify-between">
            <a
              href="/robots.txt"
              target="_blank"
              className="text-xs text-[#D93D4A] hover:underline flex items-center gap-1"
            >
              /robots.txt <ArrowUpRight className="w-3 h-3" />
            </a>
            <button
              onClick={() => copyToClipboard(robotsUrl, 'robots')}
              className="text-[11px] text-[#B89B8D] hover:text-[#FFF5ED]"
            >
              {copiedKey === 'robots' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#B89B8D]">STRUCTURED DATA</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#FFF5ED]">4 JSON-LD Schemas</div>
          <p className="text-[11px] text-[#B89B8D] mt-1">WebSite, Organization, FAQ, Breadcrumbs</p>
          <div className="mt-3 pt-3 border-t border-[#3D0D13]/60 flex items-center justify-between">
            <a
              href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(siteUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D93D4A] hover:underline flex items-center gap-1"
            >
              Test Rich Results <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#B89B8D]">GOOGLE SERP TEST</span>
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#FFF5ED]">Live Index Checker</div>
          <p className="text-[11px] text-[#B89B8D] mt-1">Check currently indexed URLs on Google</p>
          <div className="mt-3 pt-3 border-t border-[#3D0D13]/60 flex items-center justify-between">
            <a
              href="https://www.google.com/search?q=site:naturestudio.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D93D4A] hover:underline flex items-center gap-1"
            >
              site:naturestudio.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Google Search Live Preview Simulator */}
      <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#D93D4A]" />
            <h2 className="font-syne text-base font-bold text-[#FFF5ED]">
              Google SERP Result Preview (How You Appear on Google)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#B89B8D]">Updated for High CTR</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#110203] border border-[#2A0609] space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-[#9aa0a6]">
            <div className="w-4 h-4 rounded-full bg-[#1D0608] border border-[#3D0D13] flex items-center justify-center text-[10px] text-[#FFF5ED]">
              N
            </div>
            <span>naturestudio.in</span>
            <span>›</span>
            <span>esports</span>
          </div>

          <h3 className="text-lg sm:text-xl font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
            Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology
          </h3>

          <p className="text-xs sm:text-sm text-[#bdc1c6] leading-relaxed">
            Nature Studios is a premier creative technology and production studio for global esports. We engineer championship tournament broadcast packages, biophilic stage architecture, real-time Unreal Engine 3D visuals, custom jersey design, and creator clipping suites for Elvish Yadav, Scout, and Kashvi.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { label: 'Work & Projects', path: '/work' },
              { label: 'Jersey GFX', path: '/portfolio/gfx/jersey' },
              { label: 'Clipping VFX', path: '/portfolio/vfx' },
              { label: 'Contact Studio', path: '/contact' },
            ].map((sitelink, i) => (
              <div key={i} className="text-xs text-[#8ab4f8] hover:underline cursor-pointer flex items-center gap-1">
                <span>•</span> {sitelink.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Indexing Guide */}
      <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="font-syne text-lg font-bold text-[#FFF5ED]">
              How to Get Nature Studios to Show on Google Search (5 Easy Steps)
            </h2>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Follow this official checklist to get Googlebot to crawl, index, and rank naturestudio.in within 24–48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#140405] border border-[#2D090C] hover:border-[#59171B] transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xl font-bold text-[#D93D4A] shrink-0">
                  {step.num}
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-syne text-sm font-bold text-[#FFF5ED]">
                      {step.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#320B0F] text-[#D93D4A] border border-[#59171B]/50">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#B89B8D] leading-relaxed max-w-2xl">
                    {step.description}
                  </p>

                  {step.codeSnippet && (
                    <div className="mt-2 p-2.5 rounded-lg bg-[#0C0102] border border-[#3D0D13] font-mono text-[11px] text-[#FFF5ED] flex items-center justify-between">
                      <span className="truncate pr-2">{step.codeSnippet}</span>
                      <button
                        onClick={() => copyToClipboard(step.codeSnippet, 'meta')}
                        className="text-[10px] text-[#D93D4A] hover:text-[#FFF5ED] shrink-0 flex items-center gap-1 font-sans"
                      >
                        {copiedKey === 'meta' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {step.copyValue && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(step.copyValue!, 'copyval')}
                        className="px-3 py-1.5 rounded-lg bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-xs text-[#FFF5ED] flex items-center gap-1.5 transition-colors"
                      >
                        {copiedKey === 'copyval' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied {step.copyValue}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#D93D4A]" /> {step.copyLabel}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {step.actionUrl && (
                <a
                  href={step.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-xs text-[#FFF5ED] font-medium flex items-center gap-1.5 transition-colors self-start"
                >
                  {step.actionText}
                  <ExternalLink className="w-3 h-3 text-[#B89B8D]" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official Google SEO Starter Guide Breakdown */}
      <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-syne text-lg font-bold text-[#FFF5ED]">
              Google SEO Starter Guide: Official Principles Applied to Nature Studios
            </h2>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            How Google ranks websites in 2026 based on the official Search Central guidelines and how your codebase is structured to win.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#140405] border border-[#2D090C] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="font-syne text-sm font-bold text-[#FFF5ED]">
                1. What Google Actually Looks For (Core Ranking Factors)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#B89B8D] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>People-First Content:</strong> Authentic proof of work, client credentials (Elvish Yadav, Scout, Kashvi), and clear portfolio showcases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>Descriptive Title Links:</strong> Every page has a unique, intent-driven title link (&lt;title&gt;) that matches what people search.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>Accurate Snippets:</strong> Meta descriptions written under 160 characters to encourage searchers to click your link (High CTR).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>Clear Site Navigation:</strong> Logical URL hierarchy (/portfolio/gfx/jersey, /portfolio/vfx) and footer crawl paths.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#140405] border border-[#2D090C] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <h3 className="font-syne text-sm font-bold text-[#FFF5ED]">
                2. Myths Busted (What Google Says You Shouldn&apos;t Focus On)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#B89B8D] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span><strong>Meta Keywords Tag:</strong> Google has officially stated they ignore the &lt;meta name=&quot;keywords&quot;&gt; tag completely.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span><strong>Keyword Stuffing:</strong> Repeating terms unnatural times triggers Google SpamBrain algorithmic penalties. Write naturally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span><strong>Buying Fake Backlinks:</strong> Artificially purchased links get penalized. Natural links from your Instagram, YouTube, and Discord rank 10x better.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span><strong>Secret Tricks:</strong> There are no hidden shortcuts—Google rewards usefulness, fast page speeds, and verified brand identity.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Direct Quick Tools */}
      <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-4">
        <h3 className="font-syne text-sm font-bold text-[#FFF5ED]">
          Quick Google Webmaster Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#140405] hover:bg-[#200507] border border-[#2D090C] hover:border-[#59171B] flex items-center justify-between text-xs text-[#FFF5ED] transition-all"
          >
            <span>Google Search Console</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#B89B8D]" />
          </a>
          <a
            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(siteUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#140405] hover:bg-[#200507] border border-[#2D090C] hover:border-[#59171B] flex items-center justify-between text-xs text-[#FFF5ED] transition-all"
          >
            <span>Google Rich Results Validator</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#B89B8D]" />
          </a>
          <a
            href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fnaturestudio.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#140405] hover:bg-[#200507] border border-[#2D090C] hover:border-[#59171B] flex items-center justify-between text-xs text-[#FFF5ED] transition-all"
          >
            <span>Google PageSpeed Insights</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#B89B8D]" />
          </a>
        </div>
      </div>
    </div>
  );
}
