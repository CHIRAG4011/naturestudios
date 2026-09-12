/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // `images.domains` is deprecated in Next 14. remotePatterns is stricter:
    // it pins the protocol and path, not just the hostname.
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },

  // Never leak the framework version in responses.
  poweredByHeader: false,

  async headers() {
    const securityHeaders = [
      // Force HTTPS for two years. Vercel terminates TLS, so this is safe to
      // send unconditionally in production; browsers ignore it over plain HTTP.
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      // Stop content-type sniffing turning a stray upload into executable HTML.
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Allow framing only on the same origin for live portfolio device previews.
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Defence in depth for user-uploaded avatars. Even though the upload
        // route rejects SVG and verifies magic bytes, anything served from
        // /uploads is additionally sandboxed and allowed to load nothing.
        source: '/uploads/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'none'; sandbox" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Content-Disposition', value: 'inline' },
        ],
      },
      {
        // Auth and workspace responses must never sit in a shared cache.
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
