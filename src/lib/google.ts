import crypto from 'crypto';
import { prisma } from './prisma';
import { createSession } from './auth';

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

/**
 * Construct Google OAuth 2.0 authorization URL.
 */
export function getGoogleAuthorizationUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent select_account',
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Google authorization code for tokens and fetch profile.
 */
export async function exchangeGoogleCode(code: string): Promise<{ profile: GoogleUserProfile; accessToken: string; refreshToken?: string; expiresIn?: number }> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    console.error('Failed to exchange Google OAuth code:', errorBody);
    throw new Error('Unable to authenticate with Google');
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in;

  // Fetch user profile from userinfo endpoint
  const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userinfoResponse.ok) {
    throw new Error('Unable to fetch Google profile');
  }

  const profile: GoogleUserProfile = await userinfoResponse.json();
  return { profile, accessToken, refreshToken, expiresIn };
}

import { sendGoogleWelcomeEmail } from './email';

/**
 * Find or create user from Google profile and link accounts cleanly.
 */
export async function handleGoogleUser(
  profile: GoogleUserProfile,
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
  userAgent?: string,
  ipAddress?: string
) {
  const email = profile.email.toLowerCase().trim();
  const providerAccountId = profile.sub;

  // Resolve real display name from Google profile (never fallback to raw email)
  const googleName =
    profile.name?.trim() ||
    [profile.given_name, profile.family_name].filter(Boolean).join(' ').trim() ||
    'NatureStudios Member';

  const avatarUrl = profile.picture || null;

  // 1. Check if an account already exists for this Google providerAccountId
  let existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId,
      },
    },
    include: { user: true },
  });

  if (existingAccount) {
    // Update tokens
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: {
        accessToken,
        refreshToken: refreshToken || existingAccount.refreshToken,
        expiresAt: expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : existingAccount.expiresAt,
      },
    });

    // Update user profile with real Google name & picture if missing or currently an email
    const updatedUser = await prisma.user.update({
      where: { id: existingAccount.userId },
      data: {
        name: googleName,
        avatarUrl: avatarUrl || existingAccount.user.avatarUrl,
        emailVerified: true,
      },
    });

    // Dispatch confirmation email
    await sendGoogleWelcomeEmail(email, googleName).catch((err) => {
      console.error('Failed to send Google sign-in email:', err);
    });

    // Create session
    const session = await createSession(existingAccount.userId, userAgent, ipAddress);
    return { user: updatedUser, session };
  }

  // 2. Check if a user with this email already exists (Account Linking)
  let existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Link Google account to existing user
    await prisma.account.create({
      data: {
        userId: existingUser.id,
        provider: 'google',
        providerAccountId,
        accessToken,
        refreshToken: refreshToken || null,
        expiresAt: expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : null,
      },
    });

    // Mark verified and update name to Google name
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: googleName,
        emailVerified: true,
        avatarUrl: avatarUrl || existingUser.avatarUrl,
      },
    });

    await prisma.notification.create({
      data: {
        userId: existingUser.id,
        type: 'account_linked',
        title: 'Google Account Connected',
        message: `Your Google identity (${email}) has been connected to your NatureStudios account.`,
      },
    });

    // Dispatch confirmation email
    await sendGoogleWelcomeEmail(email, googleName).catch((err) => {
      console.error('Failed to send Google sign-in email:', err);
    });

    const session = await createSession(existingUser.id, userAgent, ipAddress);
    return { user: updatedUser, session };
  }

  // 3. Create new user + Google account
  const newUser = await prisma.user.create({
    data: {
      email,
      name: googleName,
      avatarUrl,
      emailVerified: true, // Google verifies emails
      accounts: {
        create: {
          provider: 'google',
          providerAccountId,
          accessToken,
          refreshToken: refreshToken || null,
          expiresAt: expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : null,
        },
      },
      notifications: {
        create: {
          type: 'welcome',
          title: 'Welcome to NatureStudios',
          message: 'Your account is ready. Explore our creative technology projects and start a collaboration.',
        },
      },
    },
  });

  // Dispatch welcome email upon registration with Google
  await sendGoogleWelcomeEmail(email, googleName).catch((err) => {
    console.error('Failed to send Google sign-in email:', err);
  });

  const session = await createSession(newUser.id, userAgent, ipAddress);
  return { user: newUser, session };
}
