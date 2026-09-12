import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, hashToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const tokenHash = hashToken(token);

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired password reset link' }, { status: 400 });
    }

    if (resetRecord.usedAt) {
      return NextResponse.json(
        { error: 'This password reset link has already been used' },
        { status: 400 }
      );
    }

    if (resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This password reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(password);

    // Update user password and mark reset token as used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash: newPasswordHash,
          emailVerified: true,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate existing sessions for security
      prisma.session.deleteMany({
        where: { userId: resetRecord.userId },
      }),
      // Add notification
      prisma.notification.create({
        data: {
          userId: resetRecord.userId,
          type: 'security',
          title: 'Password Updated',
          message: 'Your account password was successfully changed.',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully reset. You may now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
