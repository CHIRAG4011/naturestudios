import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Work & Creative Archive',
  description:
    'Selected case studies from the Nature Studios reel: tournament broadcast identities, arena stage architecture, championship campaign films, and live visual packages.',
  path: '/work',
  keywords: [
    'Nature Studios work',
    'Esports tournament reel',
    'Broadcast graphics case studies',
    'Stage architecture archive',
    'Valorant championship stage design',
  ],
});

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
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
