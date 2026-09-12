import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'email.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let totalSent = 0;
  let totalFailed = 0;
  let recentLogs: any[] = [];

  if (db) {
    totalSent = await db.collection('emailLogs').countDocuments({ status: 'SENT' });
    totalFailed = await db.collection('emailLogs').countDocuments({ status: 'FAILED' });
    recentLogs = await db.collection('emailLogs').find({}).sort({ createdAt: -1 }).limit(10).toArray();
  }

  return NextResponse.json({
    provider: 'Resend',
    configured: !!process.env.RESEND_API_KEY,
    domain: 'naturestudio.in',
    status: process.env.RESEND_API_KEY ? 'OPERATIONAL' : 'DEGRADED',
    mailboxes: {
      from: process.env.RESEND_FROM_EMAIL || 'NatureStudios <hello@naturestudio.in>',
      inquiries: process.env.RESEND_INQUIRIES_EMAIL || 'inquiries@naturestudio.in',
      admin: process.env.RESEND_ADMIN_EMAIL || 'admin@naturestudio.in',
      support: process.env.RESEND_SUPPORT_EMAIL || 'support@naturestudio.in',
      noreply: process.env.RESEND_NOREPLY_EMAIL || 'noreply@naturestudio.in',
      portfolio: process.env.RESEND_PORTFOLIO_EMAIL || 'portfolio@naturestudio.in',
    },
    metrics: {
      totalSent,
      totalFailed,
      deliveryRate: totalSent + totalFailed > 0 ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1) + '%' : '100%',
    },
    recentLogs: recentLogs.map((l: any) => {
      const { _id, ...rest } = l;
      return { id: _id.toString(), ...rest };
    }),
  });
}
