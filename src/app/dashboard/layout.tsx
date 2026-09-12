import type { Metadata } from 'next';
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient';

/**
 * Private workspace — explicitly excluded from indexing and from the sitemap.
 * The client-side auth guard lives in DashboardLayoutClient; the real
 * authorization check runs server-side on every /api route.
 */
export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Your NatureStudios client workspace.',
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
