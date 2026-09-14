import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'projects.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'projects.create');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { title, description, projectType, budget, timeline, userId, imageUrl } = await req.json();

    const targetUserId = userId || auth.user!.id;
    const project = await prisma.project.create({
      data: {
        title,
        description: description || '',
        projectType: projectType || 'ESPORTS / BROADCAST',
        budget: budget || '$25k - $50k',
        timeline: timeline || '4-6 Weeks',
        imageUrl: imageUrl || null,
        status: 'IN_PRODUCTION',
        userId: targetUserId,
      },
    });

    await logAdminAudit(auth.user!.id, auth.user!.email, 'PROJECT_CREATED', 'projects', project.id, { title });
    return NextResponse.json({ success: true, project });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'projects.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id, title, description, status, budget, timeline, imageUrl } = await req.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(budget && { budget }),
        ...(timeline && { timeline }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      },
    });

    await logAdminAudit(auth.user!.id, auth.user!.email, 'PROJECT_UPDATED', 'projects', id, { status });
    return NextResponse.json({ success: true, project: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'projects.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id } = await req.json();
    await prisma.project.delete({ where: { id } });
    await logAdminAudit(auth.user!.id, auth.user!.email, 'PROJECT_DELETED', 'projects', id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
