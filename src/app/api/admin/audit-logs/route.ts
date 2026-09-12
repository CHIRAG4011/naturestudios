import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getAuditLogs, logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'audit.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const searchParams = req.nextUrl.searchParams;
  const adminEmail = searchParams.get('adminEmail') || undefined;
  const action = searchParams.get('action') || undefined;
  const resource = searchParams.get('resource') || undefined;
  const status = searchParams.get('status') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const isExport = searchParams.get('export') === 'true';

  if (isExport) {
    const exportAuth = await requireAdminPermission(req, 'audit.export');
    if (!exportAuth.authorized) {
      return unauthorizedResponse(exportAuth);
    }
  }

  const result = await getAuditLogs({
    adminEmail,
    action,
    resource,
    status,
    page: isExport ? 1 : page,
    limit: isExport ? 1000 : limit,
  });

  if (isExport) {
    await logAdminAudit(auth.user!.id, auth.user!.email, 'AUDIT_LOGS_EXPORTED', 'audit', undefined, { count: result.logs.length });
  }

  return NextResponse.json(result);
}
