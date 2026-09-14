import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { getMongoDb } from '@/lib/mongodb';
import {
  getUserRoles,
  getUserPermissionOverrides,
  setPermissionOverride,
  assignUserRole,
  removeUserRole,
  countSuperAdmins,
  logAdminAudit,
} from '@/lib/admin-db';
import { computeEffectivePermissions, ALL_PERMISSIONS } from '@/lib/admin-rbac';
import { hashPassword } from '@/lib/auth';
import { sendAccountSuspendedEmail, sendAccountReinstatedEmail } from '@/lib/email';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'users.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const userId = params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
        status: true,
        suspendedReason: true,
        suspendedAt: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
            createdAt: true,
          },
        },
        sessions: {
          select: {
            id: true,
            expiresAt: true,
            userAgent: true,
            ipAddress: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        projects: {
          select: {
            id: true,
            title: true,
            projectType: true,
            status: true,
            budget: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        projectRequests: {
          select: {
            id: true,
            projectType: true,
            budget: true,
            status: true,
            createdAt: true,
            message: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const roles = await getUserRoles(userId);
    const overrides = await getUserPermissionOverrides(userId);
    const effectivePermissions = computeEffectivePermissions(roles, overrides);

    const db = await getMongoDb();
    let portfolio = null;
    let userStatus = 'ACTIVE';
    let auditEvents: any[] = [];
    let securityEvents: any[] = [];

    if (db) {
      portfolio = await db.collection('portfolios').findOne({ userId });
      const statusDoc = await db.collection('adminUserStatuses').findOne({ userId });
      if (statusDoc && statusDoc.status) {
        userStatus = statusDoc.status;
      }

      auditEvents = await db
        .collection('adminAuditLogs')
        .find({ $or: [{ resourceId: userId }, { adminId: userId }] })
        .sort({ createdAt: -1 })
        .limit(25)
        .toArray();

      securityEvents = await db
        .collection('securityEvents')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(15)
        .toArray();
    }

    return NextResponse.json({
      user: {
        ...user,
        status: userStatus,
      },
      roles: roles.length > 0 ? roles : ['USER'],
      overrides,
      effectivePermissions,
      availablePermissions: ALL_PERMISSIONS.map((p) => ({
        key: p.key,
        name: p.name,
        category: p.category,
        description: p.description,
        dangerous: Boolean(p.dangerous),
      })),
      portfolio: portfolio
        ? {
            slug: portfolio.slug,
            status: portfolio.status,
            themeId: portfolio.themeId,
            views: portfolio.views || 0,
            title: portfolio.title || '',
            bio: portfolio.bio || '',
          }
        : null,
      recentAudits: auditEvents.map((a: any) => ({
        id: a._id?.toString(),
        action: a.action,
        resourceType: a.resourceType,
        status: a.status,
        createdAt: a.createdAt,
      })),
      recentSecurity: securityEvents.map((s: any) => ({
        id: s._id?.toString(),
        type: s.type,
        severity: s.severity,
        createdAt: s.createdAt,
      })),
    });
  } catch (err: any) {
    console.error('Error fetching user detail:', err);
    return NextResponse.json({ error: 'Failed to retrieve user details' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'users.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const userId = params.id;

  try {
    const body = await req.json();
    const {
      name,
      email,
      avatarUrl,
      emailVerified,
      status,
      role,
      newPassword,
      permissionOverrides,
      portfolioSlug,
      reason,
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check email uniqueness if email is changed
    if (email && email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (emailConflict && emailConflict.id !== userId) {
        return NextResponse.json(
          { error: 'Another account already uses this email address.' },
          { status: 400 }
        );
      }
    }

    // Protection for last SUPER_ADMIN
    const currentRoles = await getUserRoles(userId);
    if (
      currentRoles.includes('SUPER_ADMIN') &&
      ((role && role !== 'SUPER_ADMIN') || (status && status !== 'ACTIVE'))
    ) {
      const superCount = await countSuperAdmins();
      if (superCount <= 1) {
        return NextResponse.json(
          { error: 'Blocked: Cannot demote or suspend the final Super Administrator account.' },
          { status: 403 }
        );
      }
    }

    // 1. Update Prisma User Core fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name ? name.trim() : null;
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
    if (emailVerified !== undefined) updateData.emailVerified = Boolean(emailVerified);

    if (status !== undefined && ['ACTIVE', 'SUSPENDED', 'DISABLED'].includes(status)) {
      updateData.status = status;
      if (status === 'SUSPENDED') {
        updateData.suspendedReason = reason?.trim() || 'Violation of platform policies or community guidelines.';
        updateData.suspendedAt = new Date();
      } else if (status === 'ACTIVE') {
        updateData.suspendedReason = null;
        updateData.suspendedAt = null;
      }
    }

    if (newPassword && typeof newPassword === 'string' && newPassword.length >= 6) {
      const hash = await hashPassword(newPassword);
      updateData.passwordHash = hash;
    }

    const updatedPrismaUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 2. Update Role Assignment if changed
    if (role && typeof role === 'string') {
      for (const r of currentRoles) {
        await removeUserRole(userId, r);
      }
      if (role !== 'USER') {
        await assignUserRole(userId, role, auth.user!.id);
      }
    }

    // 3. Update Status in MongoDB & send emails
    const db = await getMongoDb();
    if (status && ['ACTIVE', 'SUSPENDED', 'DISABLED'].includes(status)) {
      const suspendReason = reason?.trim() || 'Violation of platform policies or community guidelines.';
      if (db) {
        await db.collection('adminUserStatuses').updateOne(
          { userId },
          {
            $set: {
              userId,
              status,
              reason: status === 'SUSPENDED' ? suspendReason : null,
              updatedBy: auth.user!.id,
              updatedAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );

        if (status === 'SUSPENDED') {
          await db.collection('portfolios').updateMany(
            { userId },
            {
              $set: {
                status: 'SUSPENDED',
                suspendedReason: suspendReason,
                suspendedAt: new Date().toISOString(),
              },
            }
          );
        } else if (status === 'ACTIVE') {
          await db.collection('portfolios').updateMany(
            { userId, status: 'SUSPENDED' },
            {
              $set: {
                status: 'PUBLISHED',
                suspendedReason: null,
                suspendedAt: null,
              },
            }
          );
        }
      }

      if (status === 'SUSPENDED') {
        try {
          await sendAccountSuspendedEmail(existingUser.email, {
            name: existingUser.name || undefined,
            reason: suspendReason,
            appealUrl: `${process.env.APP_URL || 'https://naturestudio.in'}/dashboard/tickets?type=appeal`,
          });
        } catch (emailErr) {
          console.error('Failed to send suspension email:', emailErr);
        }

        await prisma.notification.create({
          data: {
            userId,
            type: 'account_suspended',
            title: 'Account Suspended',
            message: `Your account has been suspended: ${suspendReason}. You can appeal this decision via the support ticket system.`,
          },
        }).catch(() => {});
      } else if (status === 'ACTIVE') {
        try {
          await sendAccountReinstatedEmail(existingUser.email, existingUser.name || undefined);
        } catch (emailErr) {
          console.error('Failed to send reinstatement email:', emailErr);
        }

        await prisma.notification.create({
          data: {
            userId,
            type: 'account_reinstated',
            title: 'Account Reinstated',
            message: 'Your account suspension has been lifted. Full access to workspace features has been restored.',
          },
        }).catch(() => {});
      }
    }

    // 4. Update Permission Overrides if provided
    if (Array.isArray(permissionOverrides)) {
      for (const override of permissionOverrides) {
        if (!override.permissionKey) continue;
        if (override.effect === 'RESET') {
          if (db) {
            await db.collection('adminPermissionOverrides').deleteOne({
              userId,
              permissionKey: override.permissionKey,
            });
          }
        } else if (override.effect === 'ALLOW' || override.effect === 'DENY') {
          await setPermissionOverride(
            userId,
            override.permissionKey,
            override.effect,
            auth.user!.id,
            override.reason || 'Admin manual update'
          );
        }
      }
    }

    // 5. Update Portfolio slug if provided and exists
    if (db && portfolioSlug) {
      await db.collection('portfolios').updateOne(
        { userId },
        {
          $set: {
            slug: portfolioSlug.toLowerCase().trim(),
            updatedAt: new Date().toISOString(),
          },
        }
      );
    }

    // 6. Log Audit Trail
    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'USER_UPDATED',
      'users',
      userId,
      {
        nameUpdated: name !== undefined,
        emailUpdated: email !== undefined,
        roleUpdated: role !== undefined ? role : undefined,
        statusUpdated: status !== undefined ? status : undefined,
        passwordReset: Boolean(newPassword),
        overridesUpdated: Array.isArray(permissionOverrides),
      }
    );

    return NextResponse.json({
      success: true,
      message: 'User details successfully updated',
      user: {
        id: updatedPrismaUser.id,
        name: updatedPrismaUser.name,
        email: updatedPrismaUser.email,
        avatarUrl: updatedPrismaUser.avatarUrl,
        emailVerified: updatedPrismaUser.emailVerified,
        status: status || 'ACTIVE',
        role: role || (currentRoles[0] || 'USER'),
      },
    });
  } catch (err: any) {
    console.error('Error updating user detail:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminPermission(req, 'users.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const userId = params.id;

  try {
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

    // Cascade delete user associations in Prisma
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.message.deleteMany({ where: { senderId: userId } });
    await prisma.projectRequest.deleteMany({ where: { userId } });
    await prisma.project.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    // Clean up MongoDB collections
    const db = await getMongoDb();
    if (db) {
      await db.collection('adminRoleAssignments').deleteMany({ userId });
      await db.collection('adminPermissionOverrides').deleteMany({ userId });
      await db.collection('adminUserStatuses').deleteMany({ userId });
      await db.collection('portfolios').deleteMany({ userId });
    }

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'USER_DELETED',
      'users',
      userId,
      { targetUserId: userId }
    );

    return NextResponse.json({ success: true, message: 'User account permanently deleted.' });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'Failed to delete user account' }, { status: 500 });
  }
}
