import { NextRequest, NextResponse } from 'next/server';
import { getStudioPortfolioItems, fromGfxCategorySlug } from '@/lib/portfolio-service';
import type { GfxSubsection } from '@/lib/portfolio-shared';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/studio/gfx
 * Public endpoint to fetch studio GFX items only (with optional ?subcategory=)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const catParam = searchParams.get('category') || searchParams.get('subcategory');

    const gfxCategory: GfxSubsection | undefined = catParam
      ? fromGfxCategorySlug(catParam) || (catParam as GfxSubsection)
      : undefined;

    const items = await getStudioPortfolioItems({
      type: 'GFX',
      category: gfxCategory,
      status: 'PUBLISHED',
    });

    return NextResponse.json({
      success: true,
      portfolioSource: 'studio',
      category: 'GFX',
      items,
      count: items.length,
    });
  } catch (error: any) {
    console.error('Failed to get studio GFX items:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve studio GFX items', items: [] },
      { status: 500 }
    );
  }
}
