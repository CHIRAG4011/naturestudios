import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Esports Graphics (GFX) Hub — Tournaments, Jerseys & Team Branding',
  description:
    'Explore Nature Studios esports graphics: Tournament HUDs, customized esports jerseys, pro team visual branding, social media kits, and broadcast stream overlays.',
  path: '/portfolio/gfx',
  keywords: [
    'Esports graphics studio',
    'Esports jersey design',
    'Gaming tournament graphics',
    'Esports team branding',
    'Stream overlay packages',
    'Nature Studios GFX',
  ],
});

export default function StudioGfxLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'GFX', path: '/portfolio/gfx' },
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
