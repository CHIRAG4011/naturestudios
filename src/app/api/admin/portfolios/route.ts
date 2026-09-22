import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'portfolios.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  if (!db) {
    return NextResponse.json({ portfolios: [] });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category')?.toUpperCase();
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search')?.toLowerCase();

    const query: any = {
      portfolioSource: { $ne: 'studio' },
    };
    if (status) query.status = status;
    if (category && ['GFX', 'VFX', 'OTHER'].includes(category)) query.category = category;
    if (subcategory) query.gfxSubcategory = subcategory;
    if (search) {
      query.$or = [
        { slug: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const docs = await db.collection('portfolios').find(query).sort({ updatedAt: -1 }).toArray();

    // Map user email/name where possible
    const portfolios = await Promise.all(
      docs.map(async (p: any) => {
        let userEmail = '';
        try {
          const user = await prisma.user.findUnique({ where: { id: p.userId }, select: { email: true } });
          if (user) userEmail = user.email;
        } catch (e) {}

        const { _id, ...rest } = p;
        return {
          id: _id.toString(),
          ...rest,
          ownerEmail: userEmail,
        };
      })
    );

    return NextResponse.json({ portfolios });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'portfolios.moderate');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

  try {
    const { slug, status, reason } = await req.json();

    if (!slug || !status) {
      return NextResponse.json({ error: 'Slug and target status are required' }, { status: 400 });
    }

    const before = await db.collection('portfolios').findOne({ slug });
    if (!before) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    await db.collection('portfolios').updateOne(
      { slug },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'PORTFOLIO_MODERATED',
      'portfolios',
      slug,
      { beforeStatus: before.status, afterStatus: status },
      { status: before.status },
      { status },
      reason || 'Administrative moderation',
      'SUCCESS'
    );

    return NextResponse.json({ success: true, status });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to moderate portfolio' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'portfolios.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

  try {
    const { slug } = await req.json();
    await db.collection('portfolios').deleteOne({ slug });

    await logAdminAudit(auth.user!.id, auth.user!.email, 'PORTFOLIO_DELETED', 'portfolios', slug);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
  }
}
