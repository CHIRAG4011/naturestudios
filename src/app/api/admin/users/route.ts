import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { getMongoDb } from '@/lib/mongodb';
import {
  getUserRoles,
  assignUserRole,
  removeUserRole,
  logAdminAudit,
  countSuperAdmins,
} from '@/lib/admin-db';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'users.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const roleFilter = searchParams.get('role');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            projectRequests: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const db = await getMongoDb();

    // Attach administrative roles and portfolio status
    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const roles = await getUserRoles(u.id);

        let portfolioInfo = null;
        if (db) {
          const p = await db.collection('portfolios').findOne({ userId: u.id });
          if (p) {
            portfolioInfo = {
              slug: p.slug,
              status: p.status,
              views: p.views || 0,
            };
          }
        }

        return {
          ...u,
          roles: roles.length > 0 ? roles : ['USER'],
          portfolio: portfolioInfo,
        };
      })
    );

    const filteredUsers = roleFilter
      ? enrichedUsers.filter((u) => u.roles.includes(roleFilter))
      : enrichedUsers;

    return NextResponse.json({
      users: filteredUsers,
      total,
      page,
      limit,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'users.create');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const body = await req.json();
    const { email, name, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name || null,
        passwordHash,
        emailVerified: true,
      },
    });

    if (role && role !== 'USER') {
      await assignUserRole(user.id, role, auth.user!.id);
    }

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'USER_CREATED',
      'users',
      user.id,
      { email: user.email, role: role || 'USER' }
    );

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, role, verified } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
    }

    // Check specific required permissions based on action
    let requiredPerm = 'users.edit';
    if (action === 'suspend' || action === 'unsuspend') requiredPerm = 'users.suspend';
    if (action === 'verify') requiredPerm = 'users.verify';
    if (action === 'force_logout') requiredPerm = 'users.force_logout';
    if (action === 'change_role') requiredPerm = 'users.change_role';

    const auth = await requireAdminPermission(req, requiredPerm);
    if (!auth.authorized) {
      return unauthorizedResponse(auth);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Last Super Admin Protection
    if (action === 'change_role' || action === 'suspend') {
      const userRoles = await getUserRoles(userId);
      if (userRoles.includes('SUPER_ADMIN')) {
        const superCount = await countSuperAdmins();
        if (superCount <= 1) {
          return NextResponse.json(
            { error: 'Action blocked: Cannot alter or suspend the final Super Administrator account.' },
            { status: 403 }
          );
        }
      }
    }

    if (action === 'verify') {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: verified !== undefined ? verified : true },
      });
      await logAdminAudit(auth.user!.id, auth.user!.email, 'USER_VERIFY_UPDATED', 'users', userId, { verified });
      return NextResponse.json({ success: true });
    }

    if (action === 'force_logout') {
      await prisma.session.deleteMany({ where: { userId } });
      await logAdminAudit(auth.user!.id, auth.user!.email, 'USER_FORCE_LOGOUT', 'users', userId, { reason: 'Admin termination' });
      return NextResponse.json({ success: true, message: 'All active sessions invalidated.' });
    }

    if (action === 'change_role' && role) {
      // Clear previous roles and assign new role
      const currentRoles = await getUserRoles(userId);
      for (const r of currentRoles) {
        await removeUserRole(userId, r);
      }
      if (role !== 'USER') {
        await assignUserRole(userId, role, auth.user!.id);
      }
      await logAdminAudit(auth.user!.id, auth.user!.email, 'USER_ROLE_CHANGED', 'users', userId, { from: currentRoles, to: role });
      return NextResponse.json({ success: true, role });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'users.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { userId, confirmationPhrase } = await req.json();

    if (!userId || confirmationPhrase !== 'DELETE USER') {
      return NextResponse.json(
        { error: 'Typed confirmation phrase "DELETE USER" required to perform destructive deletion.' },
        { status: 400 }
      );
    }

    // Last Super Admin Protection
    const userRoles = await getUserRoles(userId);
    if (userRoles.includes('SUPER_ADMIN')) {
      const superCount = await countSuperAdmins();
      if (superCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the final Super Administrator account.' },
          { status: 403 }
        );
      }
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user from Prisma and associated portfolio from MongoDB
    await prisma.user.delete({ where: { id: userId } });

    const db = await getMongoDb();
    if (db) {
      await db.collection('portfolios').deleteOne({ userId });
      await db.collection('adminRoleAssignments').deleteMany({ userId });
      await db.collection('adminPermissionOverrides').deleteMany({ userId });
    }

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'USER_DELETED',
      'users',
      userId,
      { email: targetUser.email, name: targetUser.name },
      undefined,
      undefined,
      'Administrative break-glass deletion',
      'SUCCESS'
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
