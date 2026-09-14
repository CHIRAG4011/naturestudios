import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Services — Esports Broadcast & Stage Architecture',
  description:
    'Explore Nature Studios production services: arena stage architecture, broadcast graphics packages, live telemetry, 3D motion design, and real-time virtual production.',
  path: '/services',
  keywords: [
    'Esports production services',
    'Broadcast graphics design',
    'Arena stage architecture',
    'Tournament telemetry systems',
    'Unreal Engine virtual production',
    'Live event creative studio',
  ],
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
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
