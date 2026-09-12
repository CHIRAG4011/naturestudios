import type { Metadata } from 'next';

/**
 * Canonical origin for absolute URLs (OG tags, sitemap, robots).
 *
 * Never hardcode a host here — `APP_URL` is set per environment so preview and
 * production deployments emit their own absolute URLs. The localhost fallback
 * only applies in local development where no APP_URL has been configured.
 */
export const SITE_URL = process.env.APP_URL || 'http://localhost:3000';

export const SITE_NAME = 'NatureStudios';

/** Shipped 1200×630 social card. */
export const DEFAULT_OG_IMAGE = '/media/og-default.jpg';

interface PageSeoInput {
  /** Page title without the site suffix — the root layout template adds it. */
  title: string;
  description: string;
  /** Route path beginning with a slash, e.g. `/work`. Used for the canonical. */
  path: string;
  /** Absolute-from-root image path. Defaults to the shared social card. */
  image?: string;
  /** Set false for private or transactional routes. */
  index?: boolean;
}

/**
 * Builds a complete per-route `Metadata` object so individual layouts stay
 * declarative and no page can drift out of sync on canonicals or OG tags.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  index = true,
}: PageSeoInput): Metadata {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const isDefaultImage = image === DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      images: [
        isDefaultImage
          ? { url: image, width: 1200, height: 630, alt: fullTitle }
          : { url: image, alt: fullTitle },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } }
      : { index: false, follow: false, nocache: true },
  };
}
