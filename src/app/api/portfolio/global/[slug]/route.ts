import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioResolutionBySlug, getGlobalPortfolios } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const resolution = await getPortfolioResolutionBySlug(slug);

    if (resolution.state === 'NOT_FOUND' || !resolution.portfolio) {
      return NextResponse.json({ error: 'Creator portfolio not found' }, { status: 404 });
    }

    if (resolution.state === 'SUSPENDED') {
      return NextResponse.json(
        {
          error: 'This creator portfolio is suspended.',
          state: 'SUSPENDED',
          suspendedReason: resolution.suspendedReason,
        },
        { status: 403 }
      );
    }

    const portfolio = resolution.portfolio;

    // Fetch related community portfolios in the same category/subcategory (excluding current)
    const related = await getGlobalPortfolios({
      category: portfolio.category,
      subcategory: portfolio.gfxSubcategory,
      limit: 6,
    });

    const relatedPortfolios = related
      .filter((p) => p.slug !== portfolio.slug)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        name: p.personalInfo?.fullName || p.title,
        avatar: p.personalInfo?.profileImage,
        role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'Creator',
        category: p.category,
        gfxSubcategory: p.gfxSubcategory,
        mediaUrl: p.mediaUrl || p.mediaGallery?.[0] || '/media/work-valorant-championship.jpg',
        subdomainUrl: `https://${p.slug}.naturestudio.in`,
      }));

    return NextResponse.json({
      success: true,
      portfolio,
      relatedPortfolios,
    });
  } catch (error) {
    console.error('Failed to resolve global portfolio by slug:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
