import PublicPortfolioPage, { generateMetadata as renderGenerateMetadata } from '@/app/portfolio-render/[slug]/page';
import { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  return renderGenerateMetadata(props);
}

export default async function PortfolioAliasPage(props: PageProps) {
  return <PublicPortfolioPage {...props} />;
}
