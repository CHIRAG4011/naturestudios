import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Studio & Capabilities',
  description:
    'Inside Nature Studios: how our studio operates, the disciplines under one roof, and how we run mission-critical live esports production.',
  path: '/studio',
  keywords: [
    'Nature Studios capabilities',
    'Esports production infrastructure',
    'Virtual production studio',
    'Stage architecture engineering',
  ],
});

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Studio', path: '/studio' },
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
