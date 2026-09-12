import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Verify Email',
  description:
    'Verify your email address to activate your NatureStudios account.',
  path: '/verify',
  index: false,
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
