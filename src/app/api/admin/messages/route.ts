import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'messages.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'messages.send');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { projectId, message } = await req.json();

    if (!projectId || !message) {
      return NextResponse.json({ error: 'Missing projectId or message' }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        projectId,
        senderId: auth.user!.id,
        message,
      },
    });

    await logAdminAudit(auth.user!.id, auth.user!.email, 'MESSAGE_SENT', 'messages', newMessage.id, { projectId });
    return NextResponse.json({ success: true, message: newMessage });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'messages.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id } = await req.json();
    await prisma.message.delete({ where: { id } });
    await logAdminAudit(auth.user!.id, auth.user!.email, 'MESSAGE_DELETED', 'messages', id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
