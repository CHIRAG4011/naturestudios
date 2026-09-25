import type { Metadata } from 'next';
import { pageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { fromGfxCategorySlug } from '@/lib/portfolio-shared';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const categoryName = fromGfxCategorySlug(params.category) || 'Tournament';

  const descriptions: Record<string, string> = {
    Jersey: 'Custom esports jersey designs, apparel mockups, team kit sublimation graphics, and tournament wear engineered by Nature Studios.',
    Tournament: 'Broadcast tournament graphics, match schedule screens, brackets, in-game spectator HUDs, and leaderboard overlays by Nature Studios.',
    'Team Branding': 'Esports organization brand identities, team mascot crests, typography systems, and competitive visual kits by Nature Studios.',
    'Social Media': 'High-impact esports roster announcements, match-day banners, victory posters, and YouTube thumbnails by Nature Studios.',
    'Stream Package': 'Animated Twitch & YouTube stream packages, webcam frames, stingers, starting soon screens, and live alerts by Nature Studios.',
  };

  return pageMetadata({
    title: `${categoryName} GFX Showcase — Esports Graphics`,
    description: descriptions[categoryName] || `Explore curated ${categoryName} esports graphics and design systems by Nature Studios.`,
    path: `/portfolio/gfx/${params.category}`,
    keywords: [
      `${categoryName} esports`,
      `${categoryName} graphics`,
      'Nature Studios GFX',
      'Esports design studio',
      'Gaming visual identity',
    ],
  });
}

export default function GfxCategoryLayout({ children, params }: CategoryLayoutProps) {
  const categoryName = fromGfxCategorySlug(params.category) || 'Tournament';

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'GFX', path: '/portfolio/gfx' },
    { name: categoryName, path: `/portfolio/gfx/${params.category}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
