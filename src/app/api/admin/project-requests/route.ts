import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'requests.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const requests = await prisma.projectRequest.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch project requests' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'requests.change_status');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id, status } = await req.json();

    const updated = await prisma.projectRequest.update({
      where: { id },
      data: { status },
    });

    await logAdminAudit(auth.user!.id, auth.user!.email, 'REQUEST_STATUS_CHANGED', 'requests', id, { status });
    return NextResponse.json({ success: true, request: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'requests.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id } = await req.json();
    await prisma.projectRequest.delete({ where: { id } });
    await logAdminAudit(auth.user!.id, auth.user!.email, 'REQUEST_DELETED', 'requests', id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
