import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'notifications.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const notifications = await prisma.notification.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ notifications });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'notifications.send');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { target, userId, title, message, type } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message required' }, { status: 400 });
    }

    if (target === 'ALL') {
      const allUsers = await prisma.user.findMany({ select: { id: true } });
      await prisma.notification.createMany({
        data: allUsers.map((u) => ({
          userId: u.id,
          title,
          message,
          type: type || 'admin_broadcast',
        })),
      });

      await logAdminAudit(auth.user!.id, auth.user!.email, 'NOTIFICATION_BROADCAST', 'notifications', undefined, { count: allUsers.length, title });
      return NextResponse.json({ success: true, count: allUsers.length });
    }

    if (userId) {
      const notice = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: type || 'admin_notice',
        },
      });

      await logAdminAudit(auth.user!.id, auth.user!.email, 'NOTIFICATION_SENT', 'notifications', notice.id, { userId, title });
      return NextResponse.json({ success: true, notification: notice });
    }

    return NextResponse.json({ error: 'Invalid notification target' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to dispatch notification' }, { status: 500 });
  }
}
