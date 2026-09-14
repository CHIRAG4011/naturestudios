import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getMongoDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    if (!ObjectId.isValid(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID format' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const ticket = await db
      .collection('supportTickets')
      .findOne({ _id: new ObjectId(ticketId) });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Access control: Ensure ticket belongs to current user (unless admin)
    const isOwner =
      ticket.userId === user.id ||
      ticket.email.toLowerCase() === user.email.toLowerCase();

    if (!isOwner && !user.isAdmin) {
      return NextResponse.json({ error: 'Access denied to this ticket' }, { status: 403 });
    }

    const { _id, internalNotes, ...safeTicket } = ticket;

    return NextResponse.json({
      success: true,
      ticket: {
        id: _id.toString(),
        ...safeTicket,
        // Internal notes only disclosed to staff/admins
        internalNotes: user.isAdmin ? internalNotes : undefined,
      },
    });
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    return NextResponse.json({ error: 'Failed to retrieve ticket' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    if (!ObjectId.isValid(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID format' }, { status: 400 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Reply message cannot be empty' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const ticket = await db
      .collection('supportTickets')
      .findOne({ _id: new ObjectId(ticketId) });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const isOwner =
      ticket.userId === user.id ||
      ticket.email.toLowerCase() === user.email.toLowerCase();

    if (!isOwner && !user.isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const newResponse = {
      id: new ObjectId().toString(),
      sender: (user.isAdmin && !isOwner ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN',
      senderName: user.name || (user.isAdmin ? 'NatureStudios Staff' : 'Creator'),
      senderEmail: user.email,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    const updateOps: any = {
      $push: { responses: newResponse },
      $set: {
        updatedAt: new Date().toISOString(),
        // If ticket was resolved or closed and user replied, reopen it
        status: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'OPEN' : ticket.status,
      },
    };

    await db
      .collection('supportTickets')
      .updateOne({ _id: new ObjectId(ticketId) }, updateOps);

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      response: newResponse,
    });
  } catch (error) {
    console.error('Error posting ticket reply:', error);
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 });
  }
}
