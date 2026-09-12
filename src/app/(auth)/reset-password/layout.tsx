import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Choose a New Password',
  description:
    'Set a new password for your NatureStudios account.',
  path: '/reset-password',
  index: false,
});

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
