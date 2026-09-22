import { NextRequest, NextResponse } from 'next/server';
import { getStudioPortfolioItems } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/studio/vfx
 * Public endpoint to fetch studio VFX sample reels only
 */
export async function GET(req: NextRequest) {
  try {
    const items = await getStudioPortfolioItems({
      type: 'VFX',
      status: 'PUBLISHED',
    });

    return NextResponse.json({
      success: true,
      portfolioSource: 'studio',
      category: 'VFX',
      items,
      count: items.length,
    });
  } catch (error: any) {
    console.error('Failed to get studio VFX items:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve studio VFX items', items: [] },
      { status: 500 }
    );
  }
}
