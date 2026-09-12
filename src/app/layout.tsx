import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CommandPaletteProvider } from '@/context/CommandPaletteContext';
import { AuthSqueezeModal } from '@/components/auth/AuthSqueezeModal';
import { SiteChrome } from '@/components/chrome/SiteChrome';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
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
    default: 'NatureStudios — The Creative Studio for Esports & Live Broadcast',
    template: '%s — NatureStudios',
  },
  description:
    'NatureStudios merges organic architecture, biophilic illumination, and hyper-kinetic motion systems for championship esports stages and tournament broadcasts.',
  applicationName: 'NatureStudios',
  keywords: [
    'Esports',
    'Live Broadcast',
    'Creative Studio',
    'Stage Design',
    'Motion Graphics',
    'Broadcast Package',
    'Tournament Identity',
    'NatureStudios',
  ],
  authors: [{ name: 'NatureStudios' }],
  creator: 'NatureStudios',
  publisher: 'NatureStudios',
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'NatureStudios — Creative Technology & Esports Broadcast',
    description:
      'We create the nature of esports. Tournament packages, stage architectures, and a client portal for live production.',
    url: SITE_URL,
    siteName: 'NatureStudios',
    images: [
      {
        url: '/media/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'NatureStudios — esports stage design and broadcast production',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NatureStudios — Creative Technology & Esports Broadcast',
    description:
      'Organic worldbuilding meets competitive spectacle. Broadcast, stage, and digital production.',
    images: ['/media/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#090C16',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Organization schema. Deliberately limited to facts the site itself states —
 * no awards, ratings, client lists, or founding claims are asserted here.
 */
const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/media/og-default.jpg`,
  description:
    'A creative studio working across esports broadcast, brand systems, cinematic content, interactive platforms, and stage design.',
} as const;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const themeCss = await getGlobalThemeCss();

  return (
    <html lang="en" className={`dark ${archivo.variable} ${jetbrainsMono.variable}`}>
      <head>
        <style
          id="naturestudios-theme-tokens"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      </head>
      <body className="min-h-screen bg-midnight font-sans text-cream antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <script
          type="application/ld+json"
          // Serialised from a literal defined above — no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />

        <AuthProvider>
          <ToastProvider>
            <CommandPaletteProvider>
              {children}
              {/* Global cinematic authentication squeeze modal */}
              <AuthSqueezeModal />
              {/* Cursor, scroll progress, route curtain, ⌘K palette, intro plate */}
              <SiteChrome />
            </CommandPaletteProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
