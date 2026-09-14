import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getPortfolioByUserId, savePortfolio, PortfolioStatus } from '@/lib/portfolio-service';
import { sendPortfolioPublishedEmail, sendPortfolioUnpublishedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isSuspended || user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account is suspended. Portfolio publishing is restricted. Please appeal via Support Tickets.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const targetStatus: PortfolioStatus = body.status;

    if (!['PUBLISHED', 'UNPUBLISHED', 'DRAFT', 'ARCHIVED'].includes(targetStatus)) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const portfolio = await getPortfolioByUserId(user.id);
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const payload: Partial<typeof portfolio> = {
      ...portfolio,
      status: targetStatus,
    };

    if (body.slug) {
      payload.slug = body.slug;
    }

    const updated = await savePortfolio(user.id, payload);

    const publicUrl = `https://${updated.slug}.naturestudio.in`;
    const directUrl = `${process.env.APP_URL || 'https://naturestudio.in'}/p/${updated.slug}`;

    // Email notifications
    if (targetStatus === 'PUBLISHED') {
      sendPortfolioPublishedEmail(user.email, publicUrl, user.name || undefined).catch((err) =>
        console.error('Failed to dispatch published email:', err)
      );
    } else if (targetStatus === 'UNPUBLISHED') {
      sendPortfolioUnpublishedEmail(user.email, user.name || undefined).catch((err) =>
        console.error('Failed to dispatch unpublished email:', err)
      );
    }

    return NextResponse.json({
      success: true,
      status: targetStatus,
      publicUrl,
      directUrl,
      portfolio: updated,
    });
  } catch (error) {
    console.error('Publish state error:', error);
    return NextResponse.json({ error: 'Unable to update publishing status' }, { status: 500 });
  }
}
