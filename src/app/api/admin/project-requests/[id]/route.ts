import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'requests.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const requestId = params.id;

  try {
    const request = await prisma.projectRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Project request not found' }, { status: 404 });
    }

    return NextResponse.json({ request });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'requests.change_status');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const requestId = params.id;

  try {
    const body = await req.json();
    const { status, budget, projectType, message, timeline } = body;

    const updated = await prisma.projectRequest.update({
      where: { id: requestId },
      data: {
        ...(status !== undefined && { status }),
        ...(budget !== undefined && { budget }),
        ...(projectType !== undefined && { projectType }),
        ...(message !== undefined && { message }),
        ...(timeline !== undefined && { timeline }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'REQUEST_UPDATED',
      'requests',
      requestId,
      { status, budget, projectType }
    );

    return NextResponse.json({ success: true, request: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'requests.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const requestId = params.id;

  try {
    await prisma.projectRequest.delete({ where: { id: requestId } });

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'REQUEST_DELETED',
      'requests',
      requestId
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
