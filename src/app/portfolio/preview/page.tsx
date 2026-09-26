'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PortfolioData, PortfolioThemeId } from '@/lib/portfolio-shared';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import {
  Monitor,
  Smartphone,
  Maximize2,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Sliders,
} from 'lucide-react';

export default function PortfolioPreviewPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'full'>('desktop');

  const handleQuickThemeSwitch = async (themeId: PortfolioThemeId) => {
    if (!portfolio) return;
    const updated: PortfolioData = {
      ...portfolio,
      themeId,
      designConfig: {
        ...(portfolio.designConfig || {}),
        themeId,
      },
    };
    setPortfolio(updated);
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolio) setPortfolio(data.portfolio);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !portfolio) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  const publicUrl = `https://${portfolio.slug}.naturestudio.in`;

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col font-sans">
      {/* Control Bar */}
      <header className="sticky top-0 z-50 bg-[#050B17] border-b border-[#172554] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portfolio" className="text-xs font-mono uppercase text-[#38BDF8] hover:underline flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <span className="text-[#1E3A8A]">/</span>
          <span className="text-xs font-mono uppercase text-[#94A3B8]">
            Live Preview // {portfolio.themeId.toUpperCase()}
          </span>
        </div>

        {/* Viewport Selectors */}
        <div className="flex items-center gap-2 p-1 rounded-lg bg-[#0B132B] border border-[#172554]">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-mono uppercase ${
              viewMode === 'desktop'
                ? 'bg-[#2563EB] text-[#38BDF8]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-mono uppercase ${
              viewMode === 'mobile'
                ? 'bg-[#2563EB] text-[#38BDF8]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-mono uppercase ${
              viewMode === 'full'
                ? 'bg-[#2563EB] text-[#38BDF8]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" /> Full
          </button>
        </div>

        {/* Quick Theme Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#0B132B] border border-[#172554] rounded-lg px-2 py-1">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Theme:</span>
            <select
              value={portfolio.themeId}
              onChange={(e) => handleQuickThemeSwitch(e.target.value as PortfolioThemeId)}
              className="bg-transparent text-[#38BDF8] text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="editorial" className="bg-[#050B17]">01 Editorial</option>
              <option value="cinematic" className="bg-[#050B17]">02 Cinematic</option>
              <option value="esports" className="bg-[#050B17]">03 Esports</option>
              <option value="minimal" className="bg-[#050B17]">04 Minimal</option>
              <option value="creative-grid" className="bg-[#050B17]">05 Creative Grid</option>
              <option value="immersive" className="bg-[#050B17]">06 Immersive</option>
              <option value="magazine" className="bg-[#050B17]">07 Magazine</option>
              <option value="experimental" className="bg-[#050B17]">08 Experimental</option>
              <option value="custom" className="bg-[#050B17] text-[#38BDF8] font-bold">★ Custom Studio</option>
            </select>
          </div>

          <Link
            href="/portfolio/edit"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" /> Customize
          </Link>

          <a
            href={`/p/${portfolio.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Public
          </a>
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-1 p-6 flex justify-center items-start overflow-y-auto bg-[#0E0203]">
        {viewMode === 'full' && (
          <div className="w-full">
            <PortfolioRenderer portfolio={portfolio} />
          </div>
        )}

        {viewMode === 'desktop' && (
          <div className="w-full max-w-[1240px] rounded-2xl overflow-hidden border-2 border-[#1E3A8A] shadow-2xl bg-[#030712]">
            {/* Desktop Mock Browser Chrome */}
            <div className="bg-[#050B17] border-b border-[#172554] px-4 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9540C]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#18A957]" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-[#030712] border border-[#172554] rounded-md px-3 py-1 text-[11px] font-mono text-[#38BDF8] text-center truncate">
                {publicUrl}
              </div>
            </div>
            <div className="max-h-[82vh] overflow-y-auto">
              <PortfolioRenderer portfolio={portfolio} isEmbed={true} />
            </div>
          </div>
        )}

        {viewMode === 'mobile' && (
          <div className="w-[390px] rounded-[40px] overflow-hidden border-4 border-[#1E3A8A] shadow-2xl bg-[#030712] my-6">
            {/* Mobile Notch Bar */}
            <div className="bg-[#050B17] border-b border-[#172554] px-6 py-3 flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
              <span>9:41</span>
              <div className="w-16 h-3 rounded-full bg-[#030712]" />
              <span>5G</span>
            </div>
            <div className="h-[740px] overflow-y-auto">
              <PortfolioRenderer portfolio={portfolio} isEmbed={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
