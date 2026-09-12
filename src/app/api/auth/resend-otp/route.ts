import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createVerificationCode } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    if (!userId && !email) {
      return NextResponse.json({ error: 'User ID or email is required' }, { status: 400 });
    }

    const user = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'This email is already verified. You can log in.' }, { status: 400 });
    }

    const { otp, error: otpError } = await createVerificationCode(user.id);
    if (otpError) {
      return NextResponse.json({ error: otpError }, { status: 429 });
    }

    await sendVerificationEmail(user.email, otp, user.name || undefined);

    return NextResponse.json({
      success: true,
      message: 'A new verification code has been dispatched to your email.',
      devOtp: process.env.RESEND_API_KEY ? undefined : otp,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Unable to resend verification code. Please try again.' }, { status: 500 });
  }
}
