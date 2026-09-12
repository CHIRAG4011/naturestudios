import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, PortfolioReportDoc } from '@/lib/admin-db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'portfolio_reports.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ reports: [] });

  try {
    const docs = await db.collection('portfolioReports').find({}).sort({ createdAt: -1 }).toArray();
    const reports = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });

    return NextResponse.json({ reports });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'portfolio_reports.resolve');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

  try {
    const { reportId, status, resolutionNote } = await req.json();

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Missing reportId or status' }, { status: 400 });
    }

    await db.collection('portfolioReports').updateOne(
      { _id: new ObjectId(reportId) },
      {
        $set: {
          status,
          resolutionNote: resolutionNote || null,
          resolvedBy: auth.user!.email,
          resolvedAt: new Date().toISOString(),
        },
      }
    );

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'PORTFOLIO_REPORT_RESOLVED',
      'portfolio_reports',
      reportId,
      { status, resolutionNote }
    );

    return NextResponse.json({ success: true, status });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to resolve report' }, { status: 500 });
  }
}
