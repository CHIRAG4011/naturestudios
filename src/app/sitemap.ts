import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/site';
import { SITE_URL } from '@/lib/seo';

/**
 * Public surface only.
 *
 * Auth screens and the client workspace are deliberately absent — they are
 * also `noindex` at the page level and disallowed in robots.txt, so the three
 * signals agree.
 *
 * `SITE_URL` is read from `APP_URL` at build time; set it in the deployment
 * environment or the emitted URLs will point at localhost.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/work', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/studio', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const caseStudies = PROJECTS.map((project) => ({
    url: `${SITE_URL}/work/${project.id}`,
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...caseStudies,
  ];
}
