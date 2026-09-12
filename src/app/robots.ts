import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Keeps crawlers off the API surface, the client workspace, and every
 * transactional auth screen. Those routes also carry `robots: noindex` in
 * their own metadata — robots.txt stops the crawl, the meta tag stops any
 * URL that was reached some other way from being indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/login',
          '/register',
          '/verify',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
