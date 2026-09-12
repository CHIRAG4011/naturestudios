import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Create Account',
  description:
    'Create a NatureStudios client account to brief projects and follow them through production.',
  path: '/register',
  index: false,
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
