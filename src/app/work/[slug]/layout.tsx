import type { Metadata } from 'next';
import { PROJECTS } from '@/data/site';
import { pageMetadata, SITE_URL, SITE_NAME } from '@/lib/seo';

interface CaseStudyLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

/**
 * Per-case-study metadata. The page itself is a client component and so cannot
 * export `metadata`; this server layout resolves the slug against PROJECTS
 * with canonical metadata and CreativeWork JSON-LD.
 */
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = PROJECTS.find((item) => item.slug === params.slug || item.id === params.slug);

  if (!project) {
    return pageMetadata({
      title: 'Case Study Not Found',
      description: 'This case study is not part of the current NatureStudios reel.',
      path: `/work/${params.slug}`,
      index: false,
    });
  }

  return pageMetadata({
    title: `${project.title} — Case Study`,
    description: `${project.category} (${project.year}) — ${project.description}. Directed and produced by Nature Studios.`,
    path: `/work/${project.slug || project.id}`,
    image: project.image,
    keywords: [
      project.title,
      project.category,
      ...(project.tags || []),
      'Nature Studios case study',
      'esports stage design',
      'tournament broadcast package',
    ],
  });
}

/** Pre-renders known case studies at build time. */
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug || project.id }));
}

export default function CaseStudyLayout({ children, params }: CaseStudyLayoutProps) {
  const project = PROJECTS.find((item) => item.slug === params.slug || item.id === params.slug);

  const creativeWorkJsonLd = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: `${project.title} — Esports Production & Broadcast Design`,
        description: project.description,
        image: project.image.startsWith('http') ? project.image : `${SITE_URL}${project.image}`,
        datePublished: `${project.year}-01-01`,
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        genre: project.category,
        keywords: project.tags?.join(', '),
      }
    : null;

  return (
    <>
      {creativeWorkJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
