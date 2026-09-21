import { NextRequest, NextResponse } from 'next/server';
import { getStudioPortfolioItems } from '@/lib/portfolio-service';
import type { StudioWorkType, GfxSubsection } from '@/lib/portfolio-shared';

export const dynamic = 'force-dynamic';

/**
 * GET /api/studio-portfolio
 * Public endpoint to fetch studio GFX and VFX items
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as StudioWorkType | null;
    const category = searchParams.get('category') as GfxSubsection | null;

    const items = await getStudioPortfolioItems({
      type: type || undefined,
      category: category || undefined,
      status: 'PUBLISHED',
    });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error: any) {
    console.error('Failed to get studio portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve studio portfolio items', items: [] },
      { status: 500 }
    );
  }
}
