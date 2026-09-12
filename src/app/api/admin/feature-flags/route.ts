import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'feature_flags.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let flags: any[] = [];
  if (db) {
    const docs = await db.collection('featureFlags').find({}).toArray();
    flags = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({ flags });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'feature_flags.manage');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { key, enabled } = await req.json();
    if (!key) {
      return NextResponse.json({ error: 'Flag key is required' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (db) {
      await db.collection('featureFlags').updateOne(
        { key },
        {
          $set: {
            enabled,
            updatedBy: auth.user!.email,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      await logAdminAudit(auth.user!.id, auth.user!.email, 'FEATURE_FLAG_TOGGLED', 'feature_flags', key, { enabled });
      return NextResponse.json({ success: true, key, enabled });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update feature flag' }, { status: 500 });
  }
}
