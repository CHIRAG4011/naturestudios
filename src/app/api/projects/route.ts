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

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, projectType, budget, timeline } = body;

    if (!title || !description || !projectType) {
      return NextResponse.json({ error: 'Title, description, and project type are required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        projectType: projectType.trim(),
        budget: budget?.trim() || '$15k - $30k',
        timeline: timeline?.trim() || '4 - 8 weeks',
        status: 'RECEIVED',
        messages: {
          create: {
            senderId: user.id,
            message: `Project initiated: ${title.trim()}. Welcome to the workspace. Our lead creative director will review your brief shortly.`,
          },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'project_created',
        title: 'Project Brief Submitted',
        message: `Your project "${project.title}" has been registered in status RECEIVED.`,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
