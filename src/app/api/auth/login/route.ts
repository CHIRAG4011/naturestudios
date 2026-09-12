import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { createVerificationCode } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // If user registered with Google only and has no password
    if (!user.passwordHash) {
      if (user.accounts.some((a) => a.provider === 'google')) {
        return NextResponse.json(
          { error: 'This account was created with Google. Please use Continue with Google.' },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Send fresh OTP
      const { otp } = await createVerificationCode(user.id);
      if (otp) {
        await sendVerificationEmail(cleanEmail, otp, user.name || undefined);
      }
      return NextResponse.json({
        requiresVerification: true,
        userId: user.id,
        email: user.email,
        message: 'Your email address is not verified yet. We have sent a verification code to your inbox.',
        devOtp: process.env.RESEND_API_KEY ? undefined : otp,
      });
    }

    // User is verified, create session
    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = req.headers.get('x-forwarded-for') || undefined;
    await createSession(user.id, userAgent, ipAddress);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Unable to log in. Please try again.' }, { status: 500 });
  }
}
