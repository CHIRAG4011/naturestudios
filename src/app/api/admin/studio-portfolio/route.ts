import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import {
  getStudioPortfolioItems,
  createStudioPortfolioItem,
} from '@/lib/portfolio-service';
import { logAdminAudit } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/studio-portfolio
 * Fetch all Studio Portfolio items (including DRAFTS)
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'content.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as any;
    const category = searchParams.get('category') as any;
    const status = searchParams.get('status') as any;

    const items = await getStudioPortfolioItems({
      type: type || undefined,
      category: category || undefined,
      status: status || undefined, // undefined returns only published in public, but here if null we fetch all
    });

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Admin fetch studio portfolio items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch studio portfolio items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/studio-portfolio
 * Create a new Studio Portfolio GFX or VFX item
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'content.create');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const body = await req.json();
    const {
      type,
      gfxCategory,
      title,
      client,
      description,
      imageUrl,
      videoUrl,
      thumbnailUrl,
      duration,
      tags,
      featured,
      order,
      status,
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type (GFX/VFX) and Title are required' },
        { status: 400 }
      );
    }

    if (type === 'GFX' && !imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required for GFX items' },
        { status: 400 }
      );
    }

    if (type === 'VFX' && !videoUrl && !imageUrl) {
      return NextResponse.json(
        { error: 'Video URL or thumbnail is required for VFX items' },
        { status: 400 }
      );
    }

    const newItem = await createStudioPortfolioItem({
      type,
      gfxCategory: type === 'GFX' ? gfxCategory || 'Tournament' : undefined,
      title: title.trim(),
      client: client?.trim() || 'NatureStudios Commission',
      description: description?.trim() || '',
      imageUrl: imageUrl || thumbnailUrl || '/media/work-valorant-championship.jpg',
      videoUrl: videoUrl?.trim() || undefined,
      thumbnailUrl: thumbnailUrl?.trim() || imageUrl || undefined,
      duration: duration?.trim() || undefined,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      featured: !!featured,
      order: typeof order === 'number' ? order : 10,
      status: status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    });

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'STUDIO_PORTFOLIO_CREATED',
      'studio_portfolio',
      newItem.id,
      { title: newItem.title, type: newItem.type, gfxCategory: newItem.gfxCategory }
    );

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    console.error('Admin create studio portfolio item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create studio portfolio item' },
      { status: 500 }
    );
  }
}
