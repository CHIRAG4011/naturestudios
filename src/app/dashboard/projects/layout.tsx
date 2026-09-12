import type { Metadata } from 'next';

/** Private route — title only; indexing is already disabled by the parent. */
export const metadata: Metadata = {
  title: 'Projects',
  description: 'Your active and archived NatureStudios projects.',
  robots: { index: false, follow: false, nocache: true },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
