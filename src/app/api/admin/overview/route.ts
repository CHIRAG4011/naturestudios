import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getAggregateAnalytics } from '@/lib/analytics';
import { getAuditLogs, getSiteSettings } from '@/lib/admin-db';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req);
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  // Get real aggregate stats
  const analytics = await getAggregateAnalytics('30d');
  const recentAudit = await getAuditLogs({ limit: 8 });
  const settings = await getSiteSettings();

  // Check MongoDB connection latency
  let mongoStatus: 'OPERATIONAL' | 'DEGRADED' | 'DOWN' | 'UNKNOWN' = 'UNKNOWN';
  let mongoLatencyMs = 0;
  const startPing = Date.now();

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.command({ ping: 1 });
        mongoLatencyMs = Date.now() - startPing;
        mongoStatus = mongoLatencyMs < 300 ? 'OPERATIONAL' : 'DEGRADED';
      } else {
        mongoStatus = 'DOWN';
      }
    } catch (e) {
      mongoStatus = 'DOWN';
    }
  } else {
    mongoStatus = 'OPERATIONAL'; // Local dev memory mode
  }

  return NextResponse.json({
    metrics: analytics.metrics,
    systemHealth: {
      mongo: { status: mongoStatus, latencyMs: mongoLatencyMs },
      api: { status: 'OPERATIONAL' },
      resend: { status: !!process.env.RESEND_API_KEY ? 'OPERATIONAL' : 'DEGRADED' },
      googleOAuth: { status: !!process.env.GOOGLE_CLIENT_ID ? 'OPERATIONAL' : 'DEGRADED' },
    },
    settings: {
      brandName: settings.brandName,
      maintenanceMode: settings.maintenanceMode,
      registrationEnabled: settings.registrationEnabled,
    },
    recentAuditLogs: recentAudit.logs,
  });
}
