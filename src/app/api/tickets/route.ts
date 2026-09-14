import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getMongoDb } from '@/lib/mongodb';
import { SupportTicketDoc } from '@/lib/admin-db';
import { prisma } from '@/lib/prisma';
import { sendTicketCreatedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getMongoDb();
    let tickets: any[] = [];

    if (db) {
      const docs = await db
        .collection('supportTickets')
        .find({
          $or: [{ userId: user.id }, { email: user.email.toLowerCase().trim() }],
        })
        .sort({ updatedAt: -1, createdAt: -1 })
        .toArray();

      tickets = docs.map((d: any) => {
        const { _id, ...rest } = d;
        return { id: _id.toString(), ...rest };
      });
    }

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to retrieve tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, message, category, priority } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Subject and detailed message are required.' },
        { status: 400 }
      );
    }

    const isAppeal =
      category === 'APPEAL' ||
      user.isSuspended ||
      user.status === 'SUSPENDED';

    const ticketCategory = isAppeal ? 'APPEAL' : category || 'GENERAL';
    const ticketPriority = isAppeal ? 'HIGH' : priority || 'NORMAL';
    const ticketNumber = `NS-${isAppeal ? 'APL' : 'TCK'}-${Date.now().toString().slice(-6)}`;

    const doc: SupportTicketDoc = {
      ticketNumber,
      userId: user.id,
      name: user.name || 'Creator',
      email: user.email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      category: ticketCategory as any,
      priority: ticketPriority as any,
      status: 'OPEN',
      internalNotes: isAppeal
        ? [`[System]: Appeal ticket submitted by account currently marked as SUSPENDED (${user.suspendedReason || 'Reason not specified'}).`]
        : [],
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const result = await db.collection('supportTickets').insertOne(doc as any);
    const createdId = result.insertedId.toString();

    // Send confirmation email
    try {
      await sendTicketCreatedEmail(user.email, {
        ticketNumber,
        subject: subject.trim(),
        name: user.name || undefined,
        category: ticketCategory,
      });
    } catch (emailErr) {
      console.error('Error dispatching ticket receipt email:', emailErr);
    }

    // In-app notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'ticket_created',
        title: `Ticket Submitted: ${ticketNumber}`,
        message: `Your ticket regarding "${subject.trim()}" has been queued with our operations and moderation desk.`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      ticket: { id: createdId, ...doc },
      message: isAppeal
        ? 'Your appeal ticket has been submitted to moderation.'
        : 'Support ticket opened successfully.',
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
