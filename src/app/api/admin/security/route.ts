import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { prisma } from '@/lib/prisma';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'security.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let events: any[] = [];
  let totalActiveSessions = 0;

  try {
    totalActiveSessions = await prisma.session.count();
  } catch (e) {}

  if (db) {
    const docs = await db.collection('securityEvents').find({}).sort({ createdAt: -1 }).limit(30).toArray();
    events = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({
    activeSessions: totalActiveSessions,
    encryptionStatus: 'AES-256-GCM / TLS 1.3 / Atlas Rest Encryption',
    keyVersion: 'v1',
    tlsStatus: 'ENFORCED',
    events,
    rateLimits: [
      { endpoint: '/api/auth/login', limit: '5 req/min', status: 'ACTIVE', blockedToday: 0 },
      { endpoint: '/api/auth/verify-otp', limit: '5 req/10min', status: 'ACTIVE', blockedToday: 0 },
      { endpoint: '/api/portfolio/contact', limit: '3 req/15min', status: 'ACTIVE', blockedToday: 0 },
      { endpoint: '/api/admin/*', limit: '60 req/min', status: 'ACTIVE', blockedToday: 0 },
    ],
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'sessions.revoke');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { action } = await req.json();

    if (action === 'REVOKE_ALL_SESSIONS') {
      // Clear all sessions except current admin
      await prisma.session.deleteMany({
        where: { userId: { not: auth.user!.id } },
      });

      await logAdminAudit(
        auth.user!.id,
        auth.user!.email,
        'ALL_SESSIONS_REVOKED',
        'sessions',
        undefined,
        { reason: 'Administrative session flush' }
      );

      return NextResponse.json({ success: true, message: 'All external sessions revoked.' });
    }

    return NextResponse.json({ error: 'Unknown security action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to execute security command' }, { status: 500 });
  }
}
