import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserOTP } from '@/lib/otp';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, otp } = body;

    if (!otp || (!userId && !email)) {
      return NextResponse.json({ error: 'Verification code and user details are required' }, { status: 400 });
    }

    let targetUserId = userId;
    if (!targetUserId && email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true },
      });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      targetUserId = user.id;
    }

    const result = await verifyUserOTP(targetUserId, otp);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Verification failed' }, { status: 400 });
    }

    // Success! Fetch verified user
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Auto-create session so user is logged in
    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = req.headers.get('x-forwarded-for') || undefined;
    await createSession(user.id, userAgent, ipAddress);

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified!',
      user,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Unable to verify code. Please try again.' }, { status: 500 });
  }
}
