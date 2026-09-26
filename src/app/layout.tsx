import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CommandPaletteProvider } from '@/context/CommandPaletteContext';
import { AuthSqueezeModal } from '@/components/auth/AuthSqueezeModal';
import { SiteChrome } from '@/components/chrome/SiteChrome';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { SITE_URL, SITE_NAME, PRIMARY_KEYWORDS, getWebSiteJsonLd, getOrganizationJsonLd, getFaqJsonLd } from '@/lib/seo';
import { getGlobalThemeCss } from '@/lib/site-theme';

/**
 * Self-hosted at build time by next/font — no runtime request to Google, no
 * layout shift. Both faces are variable fonts, so omitting `weight` ships one
 * file per family covering the whole range the design uses (400 → 900).
 * The CSS variables here are what `tailwind.config.ts` resolves
 * `font-sans` / `font-display` / `font-mono` against.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology',
    template: '%s | Nature Studios',
  },
  description:
    'Nature Studios is a premier creative technology and production studio for global esports. We engineer championship tournament broadcast packages, biophilic stage architecture, real-time Unreal Engine 3D visuals, and interactive spectator platforms.',
  applicationName: 'Nature Studios',
  keywords: PRIMARY_KEYWORDS,
  authors: [{ name: 'Nature Studios', url: SITE_URL }],
  creator: 'Nature Studios',
  publisher: 'Nature Studios',
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology',
    description:
      'We create the nature of esports. Championship tournament packages, arena stage architectures, real-time 3D motion design, and a client portal for live production.',
    url: SITE_URL,
    siteName: 'Nature Studios',
    images: [
      {
        url: '/media/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Nature Studios — Esports Stage Design and Broadcast Production',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nature Studios — Esports Broadcast, Stage Architecture & Creative Technology',
    description:
      'Organic worldbuilding meets competitive spectacle. Live broadcast packages, tournament stage architecture, and creative technology.',
    images: ['/media/og-default.jpg'],
    site: '@naturestudios',
    creator: '@naturestudios',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#030712',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

import { LoadingProvider } from '@/context/LoadingContext';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const themeCss = await getGlobalThemeCss();

  const websiteJsonLd = getWebSiteJsonLd();
  const organizationJsonLd = getOrganizationJsonLd();
  const faqJsonLd = getFaqJsonLd();

  return (
    <html lang="en" className={`dark ${archivo.variable} ${jetbrainsMono.variable}`}>
      <head>
        <style
          id="naturestudios-theme-tokens"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
        {/* WebSite Schema with SearchAction & alternate names for Google Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Organization & ProfessionalService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* FAQPage Schema for Rich SERP snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4577894393539149"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen bg-[#030712] font-sans text-cream antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <AuthProvider>
          <ToastProvider>
            <CommandPaletteProvider>
              <LoadingProvider>
                <SmoothScroll>
                  {children}
                </SmoothScroll>
                {/* Global cinematic authentication squeeze modal */}
                <AuthSqueezeModal />
                {/* Cursor, scroll progress, route curtain, ⌘K palette, intro plate */}
                <SiteChrome />
              </LoadingProvider>
            </CommandPaletteProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
