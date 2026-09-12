import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Reset Password',
  description:
    'Request a password reset link for your NatureStudios account.',
  path: '/forgot-password',
  index: false,
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
