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
  // 1. URL query param (?subdomain=xyz) for local/preview testing
  // 2. Custom header (x-subdomain: xyz)
  // 3. Production domain (*.naturestudio.in, *.naturestudios.art)
  // 4. Local testing (*.localhost)
  let subdomain: string | null = null;

  if (url.searchParams.has('subdomain')) {
    subdomain = url.searchParams.get('subdomain');
  } else if (req.headers.get('x-subdomain')) {
    subdomain = req.headers.get('x-subdomain');
  } else if (hostname.endsWith('.naturestudio.in')) {
    const prefix = hostname.replace('.naturestudio.in', '');
    if (prefix && prefix !== 'www') {
      const parts = prefix.split('.');
      subdomain = parts[parts.length - 1];
    }
  } else if (hostname.endsWith('.naturestudios.art')) {
    const prefix = hostname.replace('.naturestudios.art', '');
    if (prefix && prefix !== 'www') {
      const parts = prefix.split('.');
      subdomain = parts[parts.length - 1];
    }
  } else if (hostname.endsWith('.localhost')) {
    const prefix = hostname.replace('.localhost', '');
    if (prefix && prefix !== 'www') {
      const parts = prefix.split('.');
      subdomain = parts[parts.length - 1];
    }
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
