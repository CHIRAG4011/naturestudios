import React from 'react';
import { Metadata } from 'next';
import { getPortfolioResolutionBySlug } from '@/lib/portfolio-service';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, HelpCircle } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolution = await getPortfolioResolutionBySlug(params.slug);

  if (resolution.state === 'SUSPENDED') {
    return {
      title: 'Portfolio Suspended — NatureStudios',
      description: 'This creator portfolio is currently suspended.',
      robots: { index: false, follow: false },
    };
  }

  const portfolio = resolution.portfolio;

  if (!portfolio || resolution.state !== 'PUBLISHED') {
    return {
      title: 'Portfolio Not Found — NatureStudios',
    };
  }

  const name = portfolio.personalInfo?.fullName || 'Creator';
  const title = portfolio.seoConfig?.seoTitle || `${name} — Creative Portfolio | NatureStudios`;
  const description =
    portfolio.seoConfig?.seoDescription ||
    portfolio.personalInfo?.aboutMe?.slice(0, 160) ||
    'Professional creative portfolio on NatureStudios.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://${portfolio.slug}.naturestudio.in`,
      siteName: 'NatureStudios Portfolios',
      images: portfolio.personalInfo?.profileImage
        ? [{ url: portfolio.personalInfo.profileImage }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = params;
  const resolution = await getPortfolioResolutionBySlug(slug);

  // 1. Dedicated Suspended State Screen
  if (resolution.state === 'SUSPENDED') {
    return (
      <div className="min-h-screen bg-[#0E0203] text-[#FFF5ED] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-red-500 selection:text-white">
        {/* Ambient Crimson Mesh Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#59171B]/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full rounded-3xl border border-red-500/30 bg-gradient-to-b from-[#1C0508]/95 via-[#26070B]/90 to-[#150204]/95 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Pulsing Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mx-auto mb-5 text-red-400 shadow-[0_0_30px_rgba(230,57,70,0.35)]">
            <ShieldAlert className="w-8 h-8 text-[#E63946]" />
          </div>

          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[11px] font-mono font-bold tracking-widest text-red-300 uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            403 // PORTFOLIO SUSPENDED
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
            PORTFOLIO ACCESS SUSPENDED
          </h1>

          <p className="text-sm text-[#B89B8D] leading-relaxed mb-6">
            The creator portfolio at <span className="text-[#FED7B8] font-mono font-bold">&quot;{slug}.naturestudio.in&quot;</span> is currently unavailable due to platform moderation or creator account suspension.
          </p>

          {resolution.suspendedReason && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/25 text-left mb-6">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold mb-1">
                Moderation Stated Reason:
              </span>
              <p className="text-xs text-red-200 leading-relaxed font-medium">
                {resolution.suspendedReason}
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#150304]/70 border border-white/5 text-xs text-[#B89B8D] mb-8 leading-relaxed">
            If you are the owner of this portfolio, your creator workspace has been placed in restricted access mode. You may log in to submit an official appeal via the NatureStudios Support Ticket desk.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://naturestudio.in"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface border border-rim hover:border-[#FED7B8] text-cream text-xs font-mono font-bold uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Link>
            <Link
              href="/dashboard/tickets?type=appeal"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-red-600/30"
            >
              <HelpCircle className="w-4 h-4" /> Submit Appeal Ticket
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Not Found / Draft State Screen
  if (!resolution.portfolio || resolution.state !== 'PUBLISHED') {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#3A0E11] border border-[#52141A] flex items-center justify-center mb-6 text-[#FED7B8]">
          <ShieldAlert className="w-8 h-8 text-[#E63946]" />
        </div>
        <div className="text-xs font-mono tracking-widest text-[#FED7B8] uppercase mb-2">
          404 // DOMAIN RESOLUTION
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase text-gradient-warm mb-4">
          PORTFOLIO NOT FOUND
        </h1>
        <p className="text-sm sm:text-base text-[#B89B8D] max-w-md mb-8">
          The creator subdomain <span className="text-[#FED7B8] font-mono font-bold">&quot;{slug}.naturestudio.in&quot;</span> is either unverified, currently in draft mode, or does not exist.
        </p>
        <Link
          href="https://naturestudio.in"
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to NatureStudios
        </Link>
      </div>
    );
  }

  // 3. Active Published Portfolio
  return <PortfolioRenderer portfolio={resolution.portfolio} />;
}
