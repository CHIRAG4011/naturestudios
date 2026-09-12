import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCode, handleGoogleUser } from '@/lib/google';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const loginUrl = new URL('/login', req.url);

  // If user declined or Google returned error
  if (error) {
    console.warn('Google OAuth returned error:', error);
    loginUrl.searchParams.set(
      'error',
      error === 'access_denied'
        ? 'Google sign-in was cancelled.'
        : 'Unable to authenticate with Google. Please try again.'
    );
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    loginUrl.searchParams.set('error', 'Missing authorization code from Google.');
    return NextResponse.redirect(loginUrl);
  }

  // Validate state against cookie
  const storedState = req.cookies.get('ns_oauth_state')?.value;
  if (!storedState || storedState !== state) {
    loginUrl.searchParams.set('error', 'Security verification failed (state mismatch). Please try again.');
    return NextResponse.redirect(loginUrl);
  }

  try {
    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = req.headers.get('x-forwarded-for') || undefined;

    // Exchange code for tokens and fetch user profile
    const { profile, accessToken, refreshToken, expiresIn } = await exchangeGoogleCode(code);

    // Create or link user account and set session
    await handleGoogleUser(profile, accessToken, refreshToken, expiresIn, userAgent, ipAddress);

    // Redirect to dashboard on success
    const dashboardUrl = new URL('/dashboard', req.url);
    const response = NextResponse.redirect(dashboardUrl);

    // Clear state cookie
    response.cookies.delete('ns_oauth_state');

    return response;
  } catch (err) {
    console.error('Google OAuth callback processing error:', err);
    loginUrl.searchParams.set('error', 'Unable to complete Google authentication. Please try again.');
    return NextResponse.redirect(loginUrl);
  }
}
