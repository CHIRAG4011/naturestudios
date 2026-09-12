import { NextRequest, NextResponse } from 'next/server';

const RESERVED_SUBDOMAINS = new Set([
  'www',
  'admin',
  'api',
  'app',
  'dashboard',
  'mail',
  'smtp',
  'ftp',
  'support',
  'help',
  'blog',
  'status',
  'cdn',
  'assets',
  'static',
  'dev',
  'staging',
  'test',
  'login',
  'auth',
  'portfolio',
  'work',
  'services',
  'about',
  'studio',
  'contact',
  'terms',
  'privacy',
  'register',
  'verify',
  'settings',
  'naturestudio',
  'naturestudios',
]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Extract hostname without port
  const hostname = host.split(':')[0].toLowerCase();

  // Allow static assets and system internal requests to pass directly
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/media') ||
    pathname.includes('.') ||
    pathname.startsWith('/portfolio-render')
  ) {
    return NextResponse.next();
  }

  // Determine potential subdomain:
  // 1. In production: [subdomain].naturestudio.in
  // 2. In local testing: [subdomain].localhost, or test query / header ?subdomain=xyz
  let subdomain: string | null = null;

  if (hostname.endsWith('.naturestudio.in')) {
    const parts = hostname.replace('.naturestudio.in', '').split('.');
    subdomain = parts[parts.length - 1];
  } else if (hostname.endsWith('.localhost')) {
    const parts = hostname.replace('.localhost', '').split('.');
    subdomain = parts[parts.length - 1];
  } else if (req.headers.get('x-subdomain')) {
    subdomain = req.headers.get('x-subdomain');
  }

  // If a valid, non-reserved subdomain is detected, rewrite internally to /portfolio-render/[slug]
  if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain)) {
    url.pathname = `/portfolio-render/${subdomain}${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-portfolio-subdomain', subdomain);
    return addSecurityHeaders(response);
  }

  return addSecurityHeaders(NextResponse.next());
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
