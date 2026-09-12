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

    const state = crypto.randomBytes(24).toString('hex');
    const authUrl = getGoogleAuthorizationUrl(state);

    const response = NextResponse.redirect(authUrl);
    // Store state in a short-lived cookie to protect against CSRF
    response.cookies.set('ns_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Google OAuth init error:', error);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'Unable to initiate Google authentication. Please try again.');
    return NextResponse.redirect(loginUrl);
  }
}
