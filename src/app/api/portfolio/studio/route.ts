import { NextRequest, NextResponse } from 'next/server';
import { getStudioPortfolioItems, fromGfxCategorySlug, fromVfxCategorySlug } from '@/lib/portfolio-service';
import type { StudioWorkType } from '@/lib/portfolio-shared';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio/studio
 * Public endpoint to fetch studio-only GFX and VFX showcases
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get('type')?.toUpperCase() as StudioWorkType | null;
    const catParam = searchParams.get('category') || searchParams.get('subcategory');

    const resolvedCategory = catParam
      ? fromGfxCategorySlug(catParam) || fromVfxCategorySlug(catParam) || catParam
      : undefined;

    const items = await getStudioPortfolioItems({
      type: typeParam && ['GFX', 'VFX'].includes(typeParam) ? typeParam : undefined,
      category: resolvedCategory,
      status: 'PUBLISHED',
    });

    return NextResponse.json({
      success: true,
      portfolioSource: 'studio',
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
