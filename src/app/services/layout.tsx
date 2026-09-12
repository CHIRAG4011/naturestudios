import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Services',
  description:
    'What we build — broadcast packages, brand and visual systems, cinematic content, interactive platforms, stage design, and creative direction.',
  path: '/services',
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
