import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getDatabaseMetrics, logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'database.view');
  if (!auth.authorized || !auth.user) {
    return unauthorizedResponse(auth);
  }

  const metrics = await getDatabaseMetrics();

  // Audit database view
  await logAdminAudit(
    auth.user.id,
    auth.user.email,
    'VIEW_DATABASE_HEALTH',
    'database',
    undefined,
    { latencyMs: metrics.latencyMs, totalCollections: metrics.totalCollections }
  );


  return NextResponse.json({
    metrics: {
      connected: metrics.connected,
      status: metrics.status,
      latencyMs: metrics.latencyMs,
      collections: metrics.collections,
      totalCollections: metrics.totalCollections,
      databaseName: metrics.databaseName,
      tlsEnabled: true,
      encryptionAtRest: 'MongoDB Atlas FIPS 140-2 Encrypted',
      driver: 'mongodb-node 6.x',
    },
  });
}
