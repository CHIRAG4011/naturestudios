import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Creator Portfolio Hub',
  description:
    'Build, showcase, and share your esports creative portfolio on Nature Studios. Bespoke live themes, project reels, and verified creator badges.',
  path: '/portfolio',
  keywords: [
    'Esports creator portfolio',
    'Gaming designer portfolio builder',
    'Nature Studios portfolio',
    '3D artist portfolio',
  ],
});

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
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
