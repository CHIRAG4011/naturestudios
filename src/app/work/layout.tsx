import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Work',
  description:
    'Selected case studies from the NatureStudios reel: broadcast identities, arena architecture, campaign films, and tournament brand systems.',
  path: '/work',
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
