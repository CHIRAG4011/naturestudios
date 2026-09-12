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

    const body = await req.json();
    const targetStatus: PortfolioStatus = body.status;

    if (!['PUBLISHED', 'UNPUBLISHED', 'DRAFT', 'ARCHIVED'].includes(targetStatus)) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const portfolio = await getPortfolioByUserId(user.id);
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const updated = await savePortfolio(user.id, {
      ...portfolio,
      status: targetStatus,
    });

    const publicUrl = `https://${updated.slug}.naturestudio.in`;

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
      portfolio: updated,
    });
  } catch (error) {
    console.error('Publish state error:', error);
    return NextResponse.json({ error: 'Unable to update publishing status' }, { status: 500 });
  }
}
