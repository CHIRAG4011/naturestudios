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

    // Resolve matching redirectUri from cookie, env, or request origin
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
    const proto = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol.replace(':', '')) || 'https';
    const dynamicOrigin = `${proto}://${host}`;
    const redirectUri = req.cookies.get('ns_oauth_redirect_uri')?.value || process.env.GOOGLE_REDIRECT_URI || `${dynamicOrigin}/api/auth/google/callback`;

    // Exchange code for tokens and fetch user profile
    const { profile, accessToken, refreshToken, expiresIn } = await exchangeGoogleCode(code, redirectUri);

    // Create or link user account and set session
    await handleGoogleUser(profile, accessToken, refreshToken, expiresIn, userAgent, ipAddress);

    // Redirect to dashboard on success
    const dashboardUrl = new URL('/dashboard', req.url);
    const response = NextResponse.redirect(dashboardUrl);

    // Clear state and redirect URI cookies
    response.cookies.delete('ns_oauth_state');
    response.cookies.delete('ns_oauth_redirect_uri');

    return response;
  } catch (err) {
    console.error('Google OAuth callback processing error:', err);
    loginUrl.searchParams.set('error', 'Unable to complete Google authentication. Please try again.');
    return NextResponse.redirect(loginUrl);
  }
}
