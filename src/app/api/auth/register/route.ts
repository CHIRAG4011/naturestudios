import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { createVerificationCode } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { accounts: true },
    });

    if (existing) {
      if (existing.passwordHash) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.' },
          { status: 409 }
        );
      } else if (existing.accounts.length > 0) {
        return NextResponse.json(
          { error: 'This email is registered with Google. Please use Google Sign In.' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        passwordHash,
        emailVerified: false,
        notifications: {
          create: {
            type: 'welcome',
            title: 'Welcome to NatureStudios',
            message: 'Your account was created. Please verify your email to unlock all features.',
          },
        },
      },
    });

    // Generate 6-digit OTP
    const { otp, error: otpError } = await createVerificationCode(user.id);
    if (otpError) {
      return NextResponse.json({ error: otpError }, { status: 429 });
    }

    // Send email
    await sendVerificationEmail(cleanEmail, otp, user.name || undefined);

    return NextResponse.json({
      success: true,
      message: 'Account created! Please enter the 6-digit verification code sent to your email.',
      userId: user.id,
      email: cleanEmail,
      requiresVerification: true,
      // For effortless local testing, return devOtp when no Resend key is set
      devOtp: process.env.RESEND_API_KEY ? undefined : otp,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Unable to complete registration. Please try again.' }, { status: 500 });
  }
}
