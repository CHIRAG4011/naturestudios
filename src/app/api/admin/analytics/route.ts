import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getAggregateAnalytics } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'analytics.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const searchParams = req.nextUrl.searchParams;
  const period = (searchParams.get('period') || '30d') as 'today' | '7d' | '30d' | '90d' | '12m';

  const data = await getAggregateAnalytics(period);

  return NextResponse.json(data);
}
