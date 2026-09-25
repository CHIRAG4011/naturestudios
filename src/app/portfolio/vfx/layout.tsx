import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Esports Clipping & VFX Showcase — Elvish Yadav, Scout & Kashvi Suite',
  description:
    'High-octane esports clipping, viral gaming shorts, broadcast VFX, and cinematic showreels engineered for elite creators including Elvish Yadav, Scout, and Kashvi.',
  path: '/portfolio/vfx',
  keywords: [
    'Esports clipping studio',
    'Gaming video editor',
    'Elvish Yadav clipping team',
    'Scout esports video editor',
    'Kashvi gaming highlights',
    'Esports VFX studio',
    'Tournament broadcast VFX',
    'Nature Studios VFX',
  ],
});

export default function StudioVfxLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'VFX', path: '/portfolio/vfx' },
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
