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
      const userEmail = user.email.toLowerCase().trim();
      const docs = await db
        .collection('supportTickets')
        .find({
          $or: [
            { userId: user.id },
            { email: userEmail },
            { targetUserId: user.id },
            { targetUserEmail: userEmail },
          ],
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
    const body = await req.json();
    const {
      subject,
      message,
      category,
      priority,
      name: guestName,
      email: guestEmail,
      targetUserId,
      targetUserEmail,
      targetType,
      portfolioSlug,
      portfolioTitle,
    } = body;

    const senderName = user?.name || guestName?.trim() || 'Visitor';
    const senderEmail = (user?.email || guestEmail?.trim() || '').toLowerCase();

    if (!senderEmail || !senderEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required to submit a ticket.' },
        { status: 400 }
      );
    }

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Subject and detailed message are required.' },
        { status: 400 }
      );
    }

    const isAppeal =
      category === 'APPEAL' ||
      (user && (user.isSuspended || user.status === 'SUSPENDED'));

    const ticketCategory = isAppeal
      ? 'APPEAL'
      : category || (targetType === 'STUDIO' ? 'COMMISSION' : targetType === 'CREATOR' ? 'PROJECT_INQUIRY' : 'GENERAL');
    const ticketPriority = isAppeal ? 'HIGH' : priority || 'NORMAL';
    
    const prefix = isAppeal
      ? 'NS-APL'
      : targetType === 'STUDIO'
      ? 'NS-STD'
      : targetType === 'CREATOR'
      ? 'NS-CRT'
      : 'NS-TCK';
    const ticketNumber = `${prefix}-${Date.now().toString().slice(-6)}`;

    const doc: SupportTicketDoc = {
      ticketNumber,
      userId: user?.id,
      name: senderName,
      email: senderEmail,
      subject: subject.trim(),
      message: message.trim(),
      category: ticketCategory as any,
      priority: ticketPriority as any,
      status: 'OPEN',
      targetUserId: targetUserId || undefined,
      targetUserEmail: (targetUserEmail || (targetType === 'STUDIO' ? 'admin@naturestudio.in' : undefined))?.toLowerCase().trim(),
      targetType: targetType || (targetUserId ? 'CREATOR' : 'STUDIO'),
      portfolioSlug: portfolioSlug?.trim() || undefined,
      portfolioTitle: portfolioTitle?.trim() || undefined,
      internalNotes: isAppeal
        ? [`[System]: Appeal ticket submitted by account currently marked as SUSPENDED (${user?.suspendedReason || 'Reason not specified'}).`]
        : [
            targetType === 'STUDIO'
              ? `[System]: Direct inquiry for Studio Portfolio (${portfolioTitle || 'Studio Work'}).`
              : targetType === 'CREATOR'
              ? `[System]: Direct inquiry for Creator Portfolio (@${portfolioSlug || 'creator'}).`
              : `[System]: Direct support ticket created.`,
          ],
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
      if (senderEmail) {
        await sendTicketCreatedEmail(senderEmail, {
          ticketNumber,
          subject: subject.trim(),
          name: senderName || undefined,
          category: ticketCategory,
        });
      }
    } catch (emailErr) {
      console.error('Error dispatching ticket receipt email:', emailErr);
    }

    // In-app notification for logged-in user
    if (user?.id) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'ticket_created',
          title: `Ticket Submitted: ${ticketNumber}`,
          message: `Your ticket regarding "${subject.trim()}" has been queued with our operations and moderation desk.`,
        },
      }).catch(() => {});
    }

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
