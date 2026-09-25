import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Robots configuration directing Googlebot and web crawlers to public portfolio,
 * case studies, and services while blocking private admin surfaces, dashboards,
 * auth screens, and internal API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/work',
          '/work/*',
          '/services',
          '/studio',
          '/about',
          '/contact',
          '/portfolio',
          '/portfolio/*',
          '/global-portfolio',
          '/global-portfolio/*',
          '/p/*',
          '/privacy',
          '/terms',
          '/media/*',
          '/_next/static/*',
          '/_next/image*',
          '/favicon.svg',
          '/favicon.png',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/login',
          '/register',
          '/verify',
          '/forgot-password',
          '/reset-password',
          '/*?*draft=*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
