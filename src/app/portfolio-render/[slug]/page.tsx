import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPortfolioBySlug } from '@/lib/portfolio-service';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPublishedPortfolioBySlug(params.slug);

  if (!portfolio) {
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
  const portfolio = await getPublishedPortfolioBySlug(slug);

  if (!portfolio || portfolio.status !== 'PUBLISHED') {
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

  return <PortfolioRenderer portfolio={portfolio} />;
}
