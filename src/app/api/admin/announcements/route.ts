import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, AnnouncementDoc } from '@/lib/admin-db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'announcements.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let announcements: any[] = [];
  if (db) {
    const docs = await db.collection('announcements').find({}).sort({ createdAt: -1 }).toArray();
    announcements = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'announcements.create');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { title, message, type, audience, enabled } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const doc: AnnouncementDoc = {
      title,
      message,
      type: type || 'INFO',
      audience: audience || 'ALL',
      enabled: enabled !== undefined ? enabled : true,
      createdBy: auth.user!.email,
      createdAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    if (db) {
      await db.collection('announcements').insertOne(doc as any);
      await logAdminAudit(auth.user!.id, auth.user!.email, 'ANNOUNCEMENT_CREATED', 'announcements', title, { type, audience });
      return NextResponse.json({ success: true, announcement: doc });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'announcements.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id, enabled, title, message, type } = await req.json();

    const db = await getMongoDb();
    if (db && id) {
      await db.collection('announcements').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...(enabled !== undefined && { enabled }),
            ...(title && { title }),
            ...(message && { message }),
            ...(type && { type }),
          },
        }
      );
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'announcements.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id } = await req.json();
    const db = await getMongoDb();
    if (db && id) {
      await db.collection('announcements').deleteOne({ _id: new ObjectId(id) });
      await logAdminAudit(auth.user!.id, auth.user!.email, 'ANNOUNCEMENT_DELETED', 'announcements', id);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
