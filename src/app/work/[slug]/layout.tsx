import type { Metadata } from 'next';
import { PROJECTS } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

interface CaseStudyLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

/**
 * Per-case-study metadata. The page itself is a client component and so cannot
 * export `metadata`; this server layout resolves the slug against the same
 * PROJECTS source the page renders from, so the two can never disagree.
 */
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = PROJECTS.find((item) => item.id === params.slug);

  if (!project) {
    return pageMetadata({
      title: 'Case Study Not Found',
      description: 'This case study is not part of the current NatureStudios reel.',
      path: `/work/${params.slug}`,
      index: false,
    });
  }

  return pageMetadata({
    title: project.title,
    description: `${project.category}, ${project.year} — ${project.description}`,
    path: `/work/${project.id}`,
    image: project.image,
  });
}

/** Pre-renders the four known case studies at build time. */
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return <>{children}</>;
}
