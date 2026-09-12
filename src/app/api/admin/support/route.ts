import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, SupportTicketDoc } from '@/lib/admin-db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'support.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let tickets: any[] = [];
  if (db) {
    const docs = await db.collection('supportTickets').find({}).sort({ createdAt: -1 }).toArray();
    tickets = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({ tickets });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'support.manage');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { ticketNumber, name, email, subject, message, priority } = await req.json();

    const doc: SupportTicketDoc = {
      ticketNumber: ticketNumber || `NS-TICK-${Date.now().toString().slice(-6)}`,
      name,
      email,
      subject,
      message,
      priority: priority || 'NORMAL',
      status: 'OPEN',
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    if (db) {
      await db.collection('supportTickets').insertOne(doc as any);
      return NextResponse.json({ success: true, ticket: doc });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'support.manage');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id, status, internalNote, assignedTo } = await req.json();

    const db = await getMongoDb();
    if (db && id) {
      const updateData: any = { updatedAt: new Date().toISOString() };
      if (status) updateData.status = status;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

      const updateOps: any = { $set: updateData };
      if (internalNote) {
        updateOps.$push = {
          internalNotes: `[${new Date().toLocaleString()} by ${auth.user!.email}]: ${internalNote}`,
        };
      }

      await db.collection('supportTickets').updateOne({ _id: new ObjectId(id) }, updateOps);
      await logAdminAudit(auth.user!.id, auth.user!.email, 'SUPPORT_TICKET_UPDATED', 'support', id, { status, assignedTo });

      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update support ticket' }, { status: 500 });
  }
}
