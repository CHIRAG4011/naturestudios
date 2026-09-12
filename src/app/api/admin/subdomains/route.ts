import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { RESERVED_SUBDOMAINS } from '@/lib/portfolio-service';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'subdomains.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let subdomains: any[] = [];

  if (db) {
    const portfolios = await db
      .collection('portfolios')
      .find({})
      .project({ slug: 1, title: 1, status: 1, userId: 1, createdAt: 1, updatedAt: 1 })
      .toArray();

    subdomains = portfolios.map((p: any) => ({
      slug: p.slug,
      hostname: `${p.slug}.naturestudio.in`,
      status: p.status,
      title: p.title || p.slug,
      userId: p.userId,
      isReserved: RESERVED_SUBDOMAINS.has(p.slug),
      updatedAt: p.updatedAt,
    }));
  }

  return NextResponse.json({
    subdomains,
    reservedCount: RESERVED_SUBDOMAINS.size,
    reservedKeywords: Array.from(RESERVED_SUBDOMAINS).slice(0, 20),
  });
}
