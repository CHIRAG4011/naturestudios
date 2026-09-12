import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Authenticated users can view their own requests
    const requests = await prisma.projectRequest.findMany({
      where: {
        OR: [
          { userId: user.id },
          { email: user.email },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching project requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name, email, company, projectType, budget, timeline, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'Name, email, project type, and message are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const request = await prisma.projectRequest.create({
      data: {
        userId: user ? user.id : null,
        name: name.trim(),
        email: cleanEmail,
        company: company?.trim() || null,
        projectType: projectType.trim(),
        budget: budget?.trim() || 'Flexible',
        timeline: timeline?.trim() || 'Standard',
        message: message.trim(),
        status: 'PENDING',
      },
    });

    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'request_received',
          title: 'Inquiry Submitted',
          message: `Your project request for "${projectType}" has been logged and sent to the studio team.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your project inquiry has been received. Our team will review and respond shortly.',
      request,
    });
  } catch (error) {
    console.error('Error creating project request:', error);
    return NextResponse.json({ error: 'Unable to submit project request.' }, { status: 500 });
  }
}
