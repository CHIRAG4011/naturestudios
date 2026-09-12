import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'domains.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  return NextResponse.json({
    domains: [
      {
        hostname: 'naturestudio.in',
        type: 'APEX',
        status: 'VERIFIED',
        ssl: 'ACTIVE',
        target: 'cname.vercel-dns.com',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        hostname: 'www.naturestudio.in',
        type: 'CNAME',
        status: 'VERIFIED',
        ssl: 'ACTIVE',
        target: 'cname.vercel-dns.com',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        hostname: '*.naturestudio.in',
        type: 'WILDCARD',
        status: 'VERIFIED',
        ssl: 'ACTIVE',
        target: 'cname.vercel-dns.com',
        routing: 'Multi-Tenant Subdomain Engine',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ],
  });
}
