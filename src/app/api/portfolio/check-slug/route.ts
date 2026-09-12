import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isSlugAvailable, isReservedSlug, sanitizeSlug } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get('slug') || '';
    const cleanSlug = sanitizeSlug(rawSlug);

    if (!cleanSlug || cleanSlug.length < 3) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be at least 3 alphanumeric characters.',
      });
    }

    if (isReservedSlug(cleanSlug)) {
      return NextResponse.json({
        available: false,
        reason: 'This username is reserved for system operations.',
      });
    }

    const available = await isSlugAvailable(cleanSlug, user ? user.id : '');
    return NextResponse.json({
      available,
      slug: cleanSlug,
      subdomain: `${cleanSlug}.naturestudio.in`,
    });
  } catch (error) {
    console.error('Slug check error:', error);
    return NextResponse.json({ available: false, error: 'Failed to verify slug' }, { status: 500 });
  }
}
