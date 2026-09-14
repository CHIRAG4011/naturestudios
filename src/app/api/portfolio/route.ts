import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getPortfolioByUserId, savePortfolio, isSlugAvailable, sanitizeSlug } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio
 * Fetch the authenticated user's portfolio
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isSuspended || user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account is suspended. Portfolio access is restricted. Please appeal via Support Tickets.' },
        { status: 403 }
      );
    }

    let portfolio = await getPortfolioByUserId(user.id);
    if (!portfolio) {
      // Auto-initialize default draft portfolio with user profile info
      const baseSlug = user.name
        ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20)
        : `creator-${user.id.slice(-6)}`;

      portfolio = await savePortfolio(user.id, {
        slug: baseSlug,
        title: `${user.name || 'Creative'} — Portfolio`,
        personalInfo: {
          fullName: user.name || '',
          username: baseSlug,
          publicEmail: user.email,
          profileImage: user.avatarUrl || '',
          tagline: 'Esports Creative & Digital Designer',
          availability: 'Available for projects',
        },
      });
    }

    return NextResponse.json({ success: true, portfolio });
  } catch (error) {
    console.error('Failed to get portfolio:', error);
    return NextResponse.json({ error: 'Unable to retrieve portfolio' }, { status: 500 });
  }
}

/**
 * POST /api/portfolio
 * Autosave / Full save portfolio data
 * Server-side ownership enforced: userId is ALWAYS derived from authenticated session!
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isSuspended || user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account is suspended. Portfolio editing and publishing are restricted. Please appeal via Support Tickets.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Check slug availability and sanitize if changed
    if (body.slug !== undefined) {
      const cleanSlug = sanitizeSlug(body.slug);
      if (cleanSlug.length < 3) {
        return NextResponse.json(
          { error: 'Portfolio subdomain slug must be at least 3 lowercase letters or numbers.' },
          { status: 400 }
        );
      }
      const isAvail = await isSlugAvailable(cleanSlug, user.id);
      if (!isAvail) {
        return NextResponse.json(
          { error: `The subdomain "${cleanSlug}.naturestudio.in" is already taken or reserved. Please choose another.` },
          { status: 400 }
        );
      }
      body.slug = cleanSlug;
    }

    // Save with strict tenant isolation
    const updated = await savePortfolio(user.id, body);

    return NextResponse.json({
      success: true,
      message: 'Portfolio saved successfully',
      portfolio: updated,
    });
  } catch (error) {
    console.error('Failed to save portfolio:', error);
    return NextResponse.json({ error: 'Unable to save portfolio data' }, { status: 500 });
  }
}
