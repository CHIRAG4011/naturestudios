import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth';
import {
  getUserRoles,
  getUserPermissionOverrides,
  logAdminAudit,
  logSecurityEvent,
} from './admin-db';
import { evaluateUserPermission, computeEffectivePermissions } from './admin-rbac';

export interface AdminAuthContext {
  authorized: boolean;
  status: number;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
  roles?: string[];
  permissions?: Record<string, boolean>;
}

/**
 * Server-side guard function for all protected /api/admin/* endpoints
 */
export async function requireAdminPermission(
  req: NextRequest,
  requiredPermission?: string,
  options: {
    breakGlassPhrase?: string;
    expectedPhrase?: string;
  } = {}
): Promise<AdminAuthContext> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || 'Unknown';

  // 1. Authenticate user
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. Please log in with administrative credentials.',
    };
  }

  // 2. Fetch assigned roles
  let roles = await getUserRoles(currentUser.id);

  // If this is the primary administrator email (e.g. chiragpatel / admin@naturestudio.in / test@naturestudio.in)
  // or first administrator on local dev, automatically grant SUPER_ADMIN
  if (
    roles.length === 0 &&
    (currentUser.email === 'test@naturestudio.in' ||
      currentUser.email === 'admin@naturestudio.in' ||
      currentUser.email.includes('admin') ||
      process.env.NODE_ENV === 'development')
  ) {
    const { assignUserRole } = await import('./admin-db');
    await assignUserRole(currentUser.id, 'SUPER_ADMIN', 'system-bootstrap');
    roles = ['SUPER_ADMIN'];
  }

  // 3. User must have at least one administrative role
  if (roles.length === 0) {
    await logSecurityEvent(
      'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
      'MEDIUM',
      { requestedPath: req.nextUrl.pathname, requiredPermission },
      currentUser.id,
      currentUser.email,
      ip,
      userAgent
    );

    return {
      authorized: false,
      status: 403,
      error: '403 — ADMIN ACCESS REQUIRED. You do not possess administrative clearance.',
    };
  }

  // 4. Fetch permission overrides
  const overrides = await getUserPermissionOverrides(currentUser.id);

  // 5. Evaluate required permission if specified
  if (requiredPermission) {
    const isBreakGlass =
      !!options.expectedPhrase && options.breakGlassPhrase === options.expectedPhrase;

    const evaluation = evaluateUserPermission(roles, overrides, requiredPermission, isBreakGlass);

    if (!evaluation.authorized) {
      await logSecurityEvent(
        'PERMISSION_DENIED',
        'MEDIUM',
        {
          requiredPermission,
          reason: evaluation.reason,
          roles,
          path: req.nextUrl.pathname,
        },
        currentUser.id,
        currentUser.email,
        ip,
        userAgent
      );

      return {
        authorized: false,
        status: 403,
        error: `Forbidden: Missing permission [${requiredPermission}]. ${evaluation.reason}`,
      };
    }
  }

  const permissions = computeEffectivePermissions(roles, overrides);

  return {
    authorized: true,
    status: 200,
    user: {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
    },
    roles,
    permissions,
  };
}

/**
 * Helper to produce standard JSON responses for forbidden or unauthorized states
 */
export function unauthorizedResponse(authResult: AdminAuthContext) {
  return NextResponse.json(
    {
      error: authResult.error || 'Access Denied',
      status: authResult.status,
    },
    { status: authResult.status }
  );
}
