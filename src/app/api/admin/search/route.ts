import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { searchAdminEntities } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req);
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({
      results: {
        users: [],
        portfolios: [],
        projects: [],
        auditLogs: [],
        content: [],
      },
    });
  }

  const results = await searchAdminEntities(q);

  // Filter results according to caller's permissions
  const perms = auth.permissions || {};
  const isSuper = auth.roles?.includes('SUPER_ADMIN') || false;

  return NextResponse.json({
    results: {
      users: isSuper || perms['users.view'] ? results.users : [],
      portfolios: isSuper || perms['portfolios.view'] ? results.portfolios : [],
      projects: isSuper || perms['projects.view'] ? results.projects : [],
      auditLogs: isSuper || perms['audit.view'] ? results.auditLogs : [],
      content: isSuper || perms['content.view'] ? results.content : [],
    },
  });
}

