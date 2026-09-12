import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'The people, principles, and production philosophy behind NatureStudios — a creative studio working where nature, cinema, and competitive gaming meet.',
  path: '/about',
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
