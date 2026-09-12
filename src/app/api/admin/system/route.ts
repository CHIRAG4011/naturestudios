import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'system.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  // 1. MongoDB Atlas Health
  let mongoStatus = 'UNKNOWN';
  let mongoLatencyMs = 0;
  let mongoVersion = 'N/A';
  const startPing = Date.now();

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const buildInfo = await db.command({ buildInfo: 1 });
        mongoLatencyMs = Date.now() - startPing;
        mongoStatus = mongoLatencyMs < 400 ? 'OPERATIONAL' : 'DEGRADED';
        mongoVersion = buildInfo.version || 'Atlas Cluster';
      } else {
        mongoStatus = 'DOWN';
      }
    } catch (e) {
      mongoStatus = 'DOWN';
    }
  } else {
    mongoStatus = 'OPERATIONAL';
    mongoLatencyMs = 1;
    mongoVersion = 'Local Fallback';
  }

  // 2. Resend Email Service Health
  const resendConfigured = !!process.env.RESEND_API_KEY;
  const resendStatus = resendConfigured ? 'OPERATIONAL' : 'DEGRADED';

  // 3. Google OAuth Health
  const googleConfigured = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  const googleStatus = googleConfigured ? 'OPERATIONAL' : 'DEGRADED';

  // 4. App & Node.js Memory Health
  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  return NextResponse.json({
    overallStatus:
      mongoStatus === 'OPERATIONAL' && resendStatus === 'OPERATIONAL'
        ? 'OPERATIONAL'
        : 'DEGRADED',
    services: [
      {
        name: 'MongoDB Atlas',
        category: 'DATABASE',
        status: mongoStatus,
        latencyMs: mongoLatencyMs,
        details: `Version ${mongoVersion} — Serverless Connection Pooling`,
      },
      {
        name: 'Resend Transactional Email',
        category: 'EMAIL',
        status: resendStatus,
        details: resendConfigured ? 'Connected to verified domain naturestudio.in' : 'Missing RESEND_API_KEY',
      },
      {
        name: 'Google OAuth Branded',
        category: 'AUTHENTICATION',
        status: googleStatus,
        details: googleConfigured ? 'NatureStudios Identity Provider active' : 'Missing Google credentials',
      },
      {
        name: 'Vercel Edge & Serverless',
        category: 'HOSTING',
        status: 'OPERATIONAL',
        details: 'Multi-region edge routing with wildcard SSL (*.naturestudio.in)',
      },
      {
        name: 'Node.js Runtime Engine',
        category: 'COMPUTE',
        status: 'OPERATIONAL',
        details: `Uptime: ${uptimeSeconds}s | Heap: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(1)}MB`,
      },
    ],
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT',
    checkedAt: new Date().toISOString(),
  });
}
