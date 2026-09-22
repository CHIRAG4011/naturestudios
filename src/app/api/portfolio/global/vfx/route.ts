import { NextRequest, NextResponse } from 'next/server';
import { getGlobalPortfolios } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/global/vfx
 * Public endpoint to fetch user VFX portfolios
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || searchParams.get('q') || '';

    const portfolios = await getGlobalPortfolios({
      category: 'VFX',
      search,
    });

    const publicList = portfolios.map((p) => {
      const firstProject = (p.projects || [])[0];
      const videoUrl = p.mediaUrl || firstProject?.projectUrl || firstProject?.videoUrl || firstProject?.thumbnail;
      const poster = p.videoThumbnailUrl || firstProject?.thumbnail || p.personalInfo?.coverImage || '/media/work-nexus-arena.jpg';

      return {
        id: p.id,
        portfolioSource: 'user',
        slug: p.slug,
        title: p.title,
        description: p.description || p.personalInfo?.aboutMe || '',
        category: 'VFX',
        mediaType: 'video',
        videoUrl,
        thumbnailUrl: poster,
        duration: p.duration || '0:45',
        themeId: p.themeId,
        name: p.personalInfo?.fullName || p.title,
        username: p.personalInfo?.username || p.slug,
        avatar: p.personalInfo?.profileImage,
        tagline: p.personalInfo?.tagline,
        role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'VFX & Motion Artist',
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
      category: 'VFX',
      portfolios: publicList,
      count: publicList.length,
    });
  } catch (error: any) {
    console.error('Failed to get global VFX portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve global VFX portfolios', portfolios: [] },
      { status: 500 }
    );
  }
}
