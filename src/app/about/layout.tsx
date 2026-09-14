import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About Nature Studios',
  description:
    'The people, philosophy, and engineering behind Nature Studios — a creative studio where organic worldbuilding, cinema, and championship gaming intersect.',
  path: '/about',
  keywords: [
    'About Nature Studios',
    'Esports creative directors',
    'Nature Studios team',
    'Live broadcast production philosophy',
    'Biophilic stage design',
  ],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
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
