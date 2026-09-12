import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyPassword, destroySession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Permanently delete the authenticated user's account.
 *
 * Destructive, so it is gated twice:
 *   1. The caller must hold a valid session (authentication).
 *   2. The caller must re-confirm — with their password if they have one, or by
 *      typing their exact email address if the account is OAuth-only.
 *
 * Prisma cascades remove sessions, accounts, verification codes, reset tokens,
 * projects, messages and notifications. ProjectRequest rows are intentionally
 * SetNull so the studio keeps a record of inbound inquiries.
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { password?: unknown; confirmEmail?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const password = typeof body.password === 'string' ? body.password : '';
    const confirmEmail = typeof body.confirmEmail === 'string' ? body.confirmEmail : '';

    const record = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!record) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    if (record.passwordHash) {
      if (!password) {
        return NextResponse.json(
          { error: 'Your password is required to delete this account.' },
          { status: 400 }
        );
      }
      const valid = await verifyPassword(password, record.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
      }
    } else {
      // OAuth-only account: confirm by typing the exact account email.
      if (confirmEmail.trim().toLowerCase() !== record.email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Type your account email exactly to confirm deletion.' },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({ where: { id: record.id } });
    await destroySession();

    return NextResponse.json({ success: true, message: 'Your account has been deleted.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 });
  }
}
