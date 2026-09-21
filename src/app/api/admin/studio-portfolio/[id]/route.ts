import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import {
  updateStudioPortfolioItem,
  deleteStudioPortfolioItem,
} from '@/lib/portfolio-service';
import { logAdminAudit } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/admin/studio-portfolio/[id]
 * Update an existing Studio Portfolio item
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'content.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const id = params.id;
    const body = await req.json();

    const updated = await updateStudioPortfolioItem(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'STUDIO_PORTFOLIO_UPDATED',
      'studio_portfolio',
      id,
      { title: updated.title, updates: Object.keys(body) }
    );

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Admin update studio portfolio item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update studio portfolio item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/studio-portfolio/[id]
 * Delete a Studio Portfolio item
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'content.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const id = params.id;
    const deleted = await deleteStudioPortfolioItem(id);

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'STUDIO_PORTFOLIO_DELETED',
      'studio_portfolio',
      id
    );

    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Admin delete studio portfolio item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete studio portfolio item' },
      { status: 500 }
    );
  }
}
