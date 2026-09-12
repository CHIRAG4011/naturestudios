import crypto from 'crypto';
import { prisma } from './prisma';
import { hashToken } from './auth';

export const OTP_EXPIRATION_MINUTES = 10;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Generate a 6-digit numeric OTP.
 */
export function generateNumericOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }
  return otp;
}

/**
 * Create or replace a verification code for a user.
 * Returns the raw 6-digit OTP to be sent via email (never stored in plaintext).
 */
export async function createVerificationCode(userId: string): Promise<{ otp: string; error?: string }> {
  // Check rate limit: if an active code was created less than 60s ago, throttle
  const latestCode = await prisma.verificationCode.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (latestCode) {
    const timeSinceLastCode = (Date.now() - latestCode.createdAt.getTime()) / 1000;
    if (timeSinceLastCode < RESEND_COOLDOWN_SECONDS) {
      const waitTime = Math.ceil(RESEND_COOLDOWN_SECONDS - timeSinceLastCode);
      return { otp: '', error: `Please wait ${waitTime} seconds before requesting a new code.` };
    }
  }

  // Generate 6-digit OTP
  const rawOtp = generateNumericOTP(6);
  const codeHash = hashToken(rawOtp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  // Invalidate previous codes for this user
  await prisma.verificationCode.deleteMany({
    where: { userId },
  });

  // Store hashed code
  await prisma.verificationCode.create({
    data: {
      userId,
      codeHash,
      expiresAt,
      attemptCount: 0,
    },
  });

  return { otp: rawOtp };
}

/**
 * Verify a 6-digit OTP for a user.
 */
export async function verifyUserOTP(userId: string, enteredOtp: string): Promise<{ success: boolean; error?: string }> {
  const record = await prisma.verificationCode.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    return { success: false, error: 'No verification code requested. Please request a new one.' };
  }

  // Check expiration
  if (record.expiresAt < new Date()) {
    await prisma.verificationCode.delete({ where: { id: record.id } }).catch(() => {});
    return { success: false, error: 'This verification code has expired. Please request a new code.' };
  }

  // Check attempt limit
  if (record.attemptCount >= MAX_ATTEMPTS) {
    await prisma.verificationCode.delete({ where: { id: record.id } }).catch(() => {});
    return { success: false, error: 'Too many failed attempts. Please request a new verification code.' };
  }

  // Check code match
  const enteredHash = hashToken(enteredOtp.trim());
  if (record.codeHash !== enteredHash) {
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { attemptCount: record.attemptCount + 1 },
    });
    const remaining = MAX_ATTEMPTS - (record.attemptCount + 1);
    return {
      success: false,
      error: `Invalid verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code revoked.'}`,
    };
  }

  // Success: mark user verified and delete code
  await prisma.verificationCode.delete({ where: { id: record.id } });
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'email_verified',
      title: 'Email Verified',
      message: 'Your NatureStudios account email has been successfully verified.',
    },
  });

  return { success: true };
}
