import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/site';
import { SITE_URL } from '@/lib/seo';

/**
 * Dynamic sitemap generator providing search engines with full crawl coverage
 * across all public pages, services, studio pillars, and curated case studies.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core public landing and pillar pages
  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/work', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/studio', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/portfolio', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Curated case studies
  const caseStudies: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_URL}/work/${project.slug || project.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // Deduplicate entries by URL
  const seenUrls = new Set<string>();
  const combined = [...staticEntries, ...caseStudies].filter((item) => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });

  return combined;
}
