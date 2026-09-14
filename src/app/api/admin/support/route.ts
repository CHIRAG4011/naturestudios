import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, SupportTicketDoc } from '@/lib/admin-db';
import { prisma } from '@/lib/prisma';
import { ObjectId } from 'mongodb';
import { sendTicketReplyEmail, sendAccountReinstatedEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'support.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const searchParams = req.nextUrl.searchParams;
  const statusFilter = searchParams.get('status');
  const categoryFilter = searchParams.get('category');
  const search = searchParams.get('search')?.toLowerCase().trim() || '';

  const db = await getMongoDb();
  let tickets: any[] = [];

  if (db) {
    const query: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      query.status = statusFilter;
    }
    if (categoryFilter && categoryFilter !== 'ALL') {
      query.category = categoryFilter;
    }
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const docs = await db
      .collection('supportTickets')
      .find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    tickets = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({ success: true, tickets });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'support.manage');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { ticketNumber, name, email, subject, message, priority, category } = await req.json();

    const doc: SupportTicketDoc = {
      ticketNumber: ticketNumber || `NS-TCK-${Date.now().toString().slice(-6)}`,
      name: name || 'Creator',
      email: email?.toLowerCase().trim() || '',
      subject: subject || 'Direct Studio Ticket',
      message: message || '',
      category: category || 'GENERAL',
      priority: priority || 'NORMAL',
      status: 'OPEN',
      internalNotes: [`[${new Date().toLocaleString()} by ${auth.user!.email}]: Ticket opened administratively.`],
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    if (db) {
      const res = await db.collection('supportTickets').insertOne(doc as any);
      return NextResponse.json({ success: true, ticket: { id: res.insertedId.toString(), ...doc } });
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
    const body = await req.json();
    const { id, status, internalNote, assignedTo, staffReply, action } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const ticket = await db.collection('supportTickets').findOne({ _id: new ObjectId(id) });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Special Action: One-Click "Approve Appeal & Unsuspend Account"
    if (action === 'approve_appeal_and_unsuspend') {
      let targetUserId = ticket.userId;

      if (!targetUserId && ticket.email) {
        const found = await prisma.user.findUnique({
          where: { email: ticket.email.toLowerCase().trim() },
        });
        if (found) targetUserId = found.id;
      }

      if (targetUserId) {
        // 1. Unsuspend in Prisma
        await prisma.user.update({
          where: { id: targetUserId },
          data: {
            status: 'ACTIVE',
            suspendedReason: null,
            suspendedAt: null,
          },
        });

        // 2. Unsuspend in MongoDB status tracker
        await db.collection('adminUserStatuses').updateOne(
          { userId: targetUserId },
          {
            $set: {
              userId: targetUserId,
              status: 'ACTIVE',
              reason: null,
              updatedBy: auth.user!.id,
              updatedAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );

        // 3. Send Account Reinstated email
        try {
          await sendAccountReinstatedEmail(ticket.email, ticket.name);
        } catch (emailErr) {
          console.error('Failed to send reinstatement email:', emailErr);
        }

        // 4. In-app notification
        await prisma.notification.create({
          data: {
            userId: targetUserId,
            type: 'account_reinstated',
            title: 'Appeal Approved — Account Reinstated',
            message: `Your appeal for ticket ${ticket.ticketNumber} was approved. Full workspace access is restored.`,
          },
        }).catch(() => {});

        await logAdminAudit(
          auth.user!.id,
          auth.user!.email,
          'USER_UNSUSPENDED',
          'users',
          targetUserId,
          { appealTicketNumber: ticket.ticketNumber }
        );
      }

      // Mark ticket as resolved with an official approval response
      const approvalResponse = {
        id: new ObjectId().toString(),
        sender: 'ADMIN',
        senderName: auth.user!.email.split('@')[0] || 'Moderation Staff',
        senderEmail: auth.user!.email,
        message:
          staffReply ||
          'Your appeal has been reviewed and APPROVED by our moderation desk. Your account suspension has been lifted, and full workspace privileges have been reinstated.',
        createdAt: new Date().toISOString(),
      };

      await db.collection('supportTickets').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: 'RESOLVED',
            updatedAt: new Date().toISOString(),
          },
          $push: {
            responses: approvalResponse,
            internalNotes: `[${new Date().toLocaleString()} by ${auth.user!.email}]: Appeal approved & user account unsuspended.`,
          } as any,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Appeal approved. User account reinstated and ticket resolved.',
      });
    }

    // Standard update or staff reply
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const updateOps: any = { $set: updateData };

    if (internalNote) {
      updateOps.$push = updateOps.$push || {};
      updateOps.$push.internalNotes = `[${new Date().toLocaleString()} by ${auth.user!.email}]: ${internalNote}`;
    }

    if (staffReply?.trim()) {
      const responseDoc = {
        id: new ObjectId().toString(),
        sender: 'ADMIN',
        senderName: auth.user!.email.split('@')[0] || 'NatureStudios Team',
        senderEmail: auth.user!.email,
        message: staffReply.trim(),
        createdAt: new Date().toISOString(),
      };

      updateOps.$push = updateOps.$push || {};
      updateOps.$push.responses = responseDoc;

      // When staff replies, set status to WAITING_CLIENT unless resolved
      if (!status) {
        updateOps.$set.status = 'WAITING_CLIENT';
      }

      // Dispatch reply email to user
      try {
        await sendTicketReplyEmail(ticket.email, {
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          name: ticket.name,
          replyMessage: staffReply.trim(),
          staffName: auth.user!.email.split('@')[0] || 'Staff',
        });
      } catch (emailErr) {
        console.error('Failed to send staff reply email:', emailErr);
      }
    }

    await db.collection('supportTickets').updateOne({ _id: new ObjectId(id) }, updateOps);
    await logAdminAudit(auth.user!.id, auth.user!.email, 'SUPPORT_TICKET_UPDATED', 'support', id, {
      status: status || ticket.status,
      assignedTo,
      hadStaffReply: Boolean(staffReply),
    });

    return NextResponse.json({ success: true, message: 'Ticket updated successfully.' });
  } catch (e: any) {
    console.error('Error updating support ticket:', e);
    return NextResponse.json({ error: e.message || 'Failed to update support ticket' }, { status: 500 });
  }
}
