import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req);
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  // Convert permissions map to list of granted keys
  const permissionKeys = Object.entries(auth.permissions || {})
    .filter(([_, granted]) => Boolean(granted))
    .map(([k]) => k);

  return NextResponse.json({
    user: auth.user,
    roles: auth.roles,
    permissions: permissionKeys,
    permissionsMap: auth.permissions,
    isSuperAdmin: auth.roles?.includes('SUPER_ADMIN') || false,
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT',
    appUrl: process.env.APP_URL || 'https://naturestudio.in',
  });
}
