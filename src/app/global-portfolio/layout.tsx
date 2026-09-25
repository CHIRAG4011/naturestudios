import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Global Esports Creator Directory & Verified Portfolios',
  description:
    'Discover and hire top esports graphic designers, video editors, and 3D artists. Browse verified creator portfolios, tournament packages, and live project reels.',
  path: '/global-portfolio',
  keywords: [
    'Global esports creators',
    'Hire esports designer',
    'Esports graphic designer directory',
    'Gaming video editor portfolio',
    'Verified esports creators',
    'Nature Studios global portfolio',
  ],
});

export default function GlobalPortfolioLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Global Portfolio', path: '/global-portfolio' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
