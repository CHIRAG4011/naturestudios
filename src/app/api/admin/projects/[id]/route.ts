import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'projects.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const projectId = params.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            sender: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch project details' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'projects.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const projectId = params.id;

  try {
    const body = await req.json();
    const { title, description, projectType, budget, timeline, status } = body;

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(projectType !== undefined && { projectType }),
        ...(budget !== undefined && { budget }),
        ...(timeline !== undefined && { timeline }),
        ...(status !== undefined && { status }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'PROJECT_UPDATED',
      'projects',
      projectId,
      { title, status, budget }
    );

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'projects.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const projectId = params.id;

  try {
    await prisma.message.deleteMany({ where: { projectId } });
    await prisma.project.delete({ where: { id: projectId } });

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'PROJECT_DELETED',
      'projects',
      projectId
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
