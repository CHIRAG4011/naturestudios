import { NextResponse } from 'next/server';
import { getPublishedPortfolios } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/published
 * Public endpoint to fetch all active published creator portfolios
 */
export async function GET() {
  try {
    const portfolios = await getPublishedPortfolios();

    // Map to public view model (stripping any sensitive private data)
    const publicList = portfolios.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      themeId: p.themeId,
      name: p.personalInfo?.fullName || p.title,
      username: p.personalInfo?.username || p.slug,
      avatar: p.personalInfo?.profileImage,
      tagline: p.personalInfo?.tagline,
      role: p.professionalIdentity?.primaryRole || p.personalInfo?.professionalTitle || 'Creative Specialist',
      location: p.personalInfo?.location,
      availability: p.personalInfo?.availability,
      skills: (p.skills || []).slice(0, 5).map((s) => s.name),
      projectCount: (p.projects || []).length,
      views: p.views || 0,
      publishedAt: p.publishedAt,
      subdomainUrl: `https://${p.slug}.naturestudio.in`,
      directUrl: `/p/${p.slug}`,
    }));

    return NextResponse.json({
      success: true,
      portfolios: publicList,
      count: publicList.length,
    });
  } catch (error: any) {
    console.error('Failed to get published portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve published portfolios', portfolios: [] },
      { status: 500 }
    );
  }
}
