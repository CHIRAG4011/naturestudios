import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Start a project with NatureStudios. Tell us about the property, the format, and the dates, and a director will come back to you.',
  path: '/contact',
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
