import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact & Inquiries',
  description:
    'Start a project with Nature Studios. Tell us about your tournament, broadcast scope, or stage architecture mandate, and an executive director will respond within 24 hours.',
  path: '/contact',
  keywords: [
    'Contact Nature Studios',
    'Hire esports creative agency',
    'Tournament broadcast quote',
    'Stage design inquiry',
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
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
