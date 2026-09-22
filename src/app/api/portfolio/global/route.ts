import { NextRequest, NextResponse } from 'next/server';
import { getGlobalPortfolios, fromGfxCategorySlug } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/global
 * Public endpoint to fetch user-published portfolios for Global Portfolio directory
 * Strictly excludes studio portfolio items
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category')?.toUpperCase();
    const subParam = searchParams.get('subcategory') || searchParams.get('sub');
    const search = searchParams.get('search') || searchParams.get('q') || '';

    const subcategory = subParam ? fromGfxCategorySlug(subParam) || subParam : undefined;

    const portfolios = await getGlobalPortfolios({
      category: categoryParam,
      subcategory,
      search,
    });

    const publicList = portfolios.map((p) => {
      // Find primary media
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
        category: p.category || (firstProject?.workType === 'VFX' ? 'VFX' : 'GFX'),
        gfxSubcategory: p.gfxSubcategory || firstProject?.gfxCategory || 'Tournament',
        customCategory: p.customCategory,
        mediaType: p.mediaType || (p.category === 'VFX' || firstProject?.workType === 'VFX' ? 'video' : 'image'),
        mediaUrl: primaryMedia,
        mediaGallery: p.mediaGallery || (firstProject?.thumbnail ? [firstProject.thumbnail] : []),
        videoUrl: p.category === 'VFX' || p.mediaType === 'video' ? p.mediaUrl || firstProject?.projectUrl : undefined,
        videoThumbnailUrl: p.videoThumbnailUrl || firstProject?.thumbnail || p.mediaUrl,
        duration: p.duration,
        themeId: p.themeId,
        name: p.personalInfo?.fullName || p.title,
        username: p.personalInfo?.username || p.slug,
        avatar: p.personalInfo?.profileImage,
        tagline: p.personalInfo?.tagline,
        role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'Creator Specialist',
        location: p.personalInfo?.location,
        availability: p.personalInfo?.availability,
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
      portfolios: publicList,
      count: publicList.length,
    });
  } catch (error: any) {
    console.error('Failed to get global portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve global creator portfolios', portfolios: [] },
      { status: 500 }
    );
  }
}
