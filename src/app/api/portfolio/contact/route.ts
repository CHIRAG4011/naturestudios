import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPortfolioBySlug, savePortfolioContactMessage } from '@/lib/portfolio-service';
import { sendPortfolioContactEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, email, company, message, projectDetails } = body;

    if (!slug || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const portfolio = await getPublishedPortfolioBySlug(slug);
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found or not published' }, { status: 404 });
    }

    // Record contact message
    await savePortfolioContactMessage(portfolio.id, {
      name,
      email,
      company,
      message,
      projectDetails,
    });

    // Find destination email for portfolio owner
    let ownerEmail = portfolio.contactConfig?.publicEmail || portfolio.personalInfo?.publicEmail;

    if (!ownerEmail) {
      // Lookup user's registered email
      if (isMongoConfigured()) {
        const db = await getMongoDb();
        if (db) {
          const userDoc = await db.collection('users').findOne({ _id: portfolio.userId as unknown as import('mongodb').ObjectId });
          if (userDoc?.email) ownerEmail = userDoc.email;
        }
      }

      if (!ownerEmail) {
        const user = await prisma.user.findUnique({ where: { id: portfolio.userId } });
        if (user) ownerEmail = user.email;
      }
    }

    if (ownerEmail) {
      const portfolioUrl = `https://${slug}.naturestudio.in`;
      sendPortfolioContactEmail(ownerEmail, {
        visitorName: name,
        visitorEmail: email,
        company,
        message,
        portfolioUrl,
      }).catch((err) => console.error('Failed to dispatch portfolio contact email:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been delivered to the creator.',
    });
  } catch (error) {
    console.error('Portfolio contact error:', error);
    return NextResponse.json(
      { error: 'Unable to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
