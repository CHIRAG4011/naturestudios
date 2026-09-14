import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Get unread notifications count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    // Check if user has administrative clearance
    const { getUserRoles } = await import('@/lib/admin-db');
    let roles: string[] = [];
    try {
      roles = await getUserRoles(user.id);
    } catch {
      roles = [];
    }

    const isAdmin =
      roles.length > 0 ||
      user.email === 'admin@naturestudio.in' ||
      user.email === 'test@naturestudio.in' ||
      user.email.toLowerCase().includes('admin');

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        status: user.status || 'ACTIVE',
        suspendedReason: user.suspendedReason || null,
        suspendedAt: user.suspendedAt || null,
        isSuspended: Boolean(user.isSuspended || user.status === 'SUSPENDED'),
        createdAt: user.createdAt,
        providers: user.providers,
        hasPassword: user.hasPassword,
        isAdmin,
        roles,
      },
      unreadCount,
    });

  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
