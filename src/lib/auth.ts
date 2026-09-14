import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export const SESSION_COOKIE_NAME = 'ns_session';
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Securely hash a plaintext password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plaintext password with a hashed password.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a cryptographically secure random session token.
 */
export function generateToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}

/**
 * Hash a sensitive token (OTP or password reset token) before storing in DB.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Create a persistent session in the database and write an HTTP-only cookie.
 */
export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const sessionToken = generateToken(32);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return session;
}

/**
 * Retrieve the current authenticated user and session from the request cookie.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            emailVerified: true,
            status: true,
            suspendedReason: true,
            suspendedAt: true,
            createdAt: true,
            // Selected only to derive the `hasPassword` boolean below.
            // The hash itself is stripped and never leaves this function.
            passwordHash: true,
            accounts: {
              select: {
                provider: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        // Invalidate expired session
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      }
      return null;
    }

    const { passwordHash, ...safeUser } = session.user;
    const emailLower = (safeUser.email || '').toLowerCase();
    const isAdmin =
      emailLower === 'admin@naturestudio.in' ||
      emailLower === 'test@naturestudio.in' ||
      emailLower.includes('admin');

    return {
      ...safeUser,
      status: safeUser.status || 'ACTIVE',
      isSuspended: safeUser.status === 'SUSPENDED',
      hasPassword: !!passwordHash,
      providers: session.user.accounts.map((a) => a.provider),
      sessionId: session.id,
      isAdmin,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Invalidate the current session and clear the cookie.
 */
export async function destroySession() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      await prisma.session.delete({ where: { sessionToken } }).catch(() => {});
    }

    cookieStore.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
  } catch (error) {
    console.error('Error destroying session:', error);
  }
}
