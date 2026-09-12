import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getGoogleAuthorizationUrl } from '@/lib/google';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId || clientId.trim() === '') {
      // Return safely to login with informative error
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in your .env file.');
      return NextResponse.redirect(loginUrl);
    }

    // Determine redirect URI: use GOOGLE_REDIRECT_URI if set, otherwise fallback to current origin
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
    const proto = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol.replace(':', '')) || 'https';
    const dynamicOrigin = `${proto}://${host}`;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${dynamicOrigin}/api/auth/google/callback`;

    const state = crypto.randomBytes(24).toString('hex');
    const authUrl = getGoogleAuthorizationUrl(state, redirectUri);

    const response = NextResponse.redirect(authUrl);
    // Store state and redirectUri in short-lived cookies to protect against CSRF and domain mismatches
    response.cookies.set('ns_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    });
    response.cookies.set('ns_oauth_redirect_uri', redirectUri, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });

    return response;
  } catch (error) {
    console.error('Google OAuth init error:', error);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'Unable to initiate Google authentication. Please try again.');
    return NextResponse.redirect(loginUrl);
  }
}
