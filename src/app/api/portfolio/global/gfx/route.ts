import { NextRequest, NextResponse } from 'next/server';
import { getGlobalPortfolios, fromGfxCategorySlug } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/global/gfx
 * Public endpoint to fetch user GFX portfolios
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subParam = searchParams.get('subcategory') || searchParams.get('sub');
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const subcategory = subParam ? fromGfxCategorySlug(subParam) || subParam : undefined;

    const portfolios = await getGlobalPortfolios({
      category: 'GFX',
      subcategory,
      search,
    });

    const publicList = portfolios.map((p) => {
      const firstProject = (p.projects || [])[0];
      const primaryMedia =
        p.mediaUrl ||
        (p.mediaGallery && p.mediaGallery[0]) ||
        firstProject?.thumbnail ||
        p.personalInfo?.coverImage ||
        '/media/work-valorant-championship.jpg';

      return {
        id: p.id,
        portfolioSource: 'user',
        slug: p.slug,
        title: p.title,
        description: p.description || p.personalInfo?.aboutMe || '',
        category: 'GFX',
        gfxSubcategory: p.gfxSubcategory || firstProject?.gfxCategory || 'Tournament',
        mediaType: 'image',
        mediaUrl: primaryMedia,
        mediaGallery: p.mediaGallery || (firstProject?.thumbnail ? [firstProject.thumbnail] : []),
        themeId: p.themeId,
        name: p.personalInfo?.fullName || p.title,
        username: p.personalInfo?.username || p.slug,
        avatar: p.personalInfo?.profileImage,
        tagline: p.personalInfo?.tagline,
        role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'GFX Designer',
        skills: (p.skills || []).slice(0, 5).map((s) => s.name),
        projectCount: (p.projects || []).length,
        publishedAt: p.publishedAt || p.createdAt,
        subdomainUrl: `https://${p.slug}.naturestudio.in`,
        directUrl: `/p/${p.slug}`,
      };
    });

    return NextResponse.json({
      success: true,
      portfolioSource: 'user',
      category: 'GFX',
      portfolios: publicList,
      count: publicList.length,
    });
  } catch (error: any) {
    console.error('Failed to get global GFX portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve global GFX portfolios', portfolios: [] },
      { status: 500 }
    );
  }
}
