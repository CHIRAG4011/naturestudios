import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Studio',
  description:
    'Inside NatureStudios: how the studio is set up, the disciplines under one roof, and the way we run live production.',
  path: '/studio',
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
