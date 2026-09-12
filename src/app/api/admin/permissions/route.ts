import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { ALL_PERMISSIONS, SYSTEM_ROLES } from '@/lib/admin-rbac';
import { setPermissionOverride, logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'permissions.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  // Extract category names array
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  return NextResponse.json({
    permissions: ALL_PERMISSIONS,
    categories,
    roles: SYSTEM_ROLES.map((r) => ({
      slug: r.slug,
      name: r.name,
      permissions: r.permissions,
    })),
  });
}


export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'permissions.assign');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { userId, permissionKey, effect, reason, expiresAt } = await req.json();

    if (!userId || !permissionKey || !['ALLOW', 'DENY'].includes(effect)) {
      return NextResponse.json({ error: 'Invalid override parameters' }, { status: 400 });
    }

    await setPermissionOverride(
      userId,
      permissionKey,
      effect,
      auth.user!.id,
      reason,
      expiresAt
    );

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'PERMISSION_OVERRIDE_SET',
      'permissions',
      `${userId}:${permissionKey}`,
      { effect, reason, expiresAt }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to assign permission override' }, { status: 500 });
  }
}
