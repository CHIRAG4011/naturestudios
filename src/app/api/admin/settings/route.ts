import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getSiteSettings, updateSiteSettings, logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'settings.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'settings.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const body = await req.json();
    const updated = await updateSiteSettings(body);

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'SETTINGS_UPDATED',
      'settings',
      'siteSettings',
      { updatedKeys: Object.keys(body) }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
