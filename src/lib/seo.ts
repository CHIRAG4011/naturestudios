import type { Metadata } from 'next';

/**
 * Canonical origin for absolute URLs (OG tags, sitemap, robots, schema.org).
 * Defaults to the production domain https://naturestudio.in when environment variables are unset.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://naturestudio.in');

export const SITE_NAME = 'Nature Studios';
export const SITE_NAME_ALT = ['NatureStudios', 'Nature Studio', 'Nature Studios India'];

/** Shipped 1200×630 social card. */
export const DEFAULT_OG_IMAGE = '/media/og-default.jpg';

export const PRIMARY_KEYWORDS = [
  'Nature Studios',
  'NatureStudios',
  'Nature Studio',
  'Nature Studios India',
  'Nature Studios esports',
  'esports creative studio',
  'esports broadcast design',
  'tournament stage architecture',
  'live event graphics package',
  'Unreal Engine virtual production esports',
  'esports stage design agency',
  'motion design studio esports',
  'tournament brand identity',
  'live broadcast overlays HUD',
  'esports production company',
  'creative technology studio',
];

interface PageSeoInput {
  /** Page title without the site suffix — the root layout template adds it. */
  title: string;
  description: string;
  /** Route path beginning with a slash, e.g. `/work`. Used for the canonical. */
  path: string;
  /** Absolute-from-root image path. Defaults to the shared social card. */
  image?: string;
  /** Optional keywords override or extension */
  keywords?: string[];
  /** Set false for private or transactional routes. */
  index?: boolean;
}

/**
 * Builds a complete per-route `Metadata` object so individual layouts stay
 * declarative and no page can drift out of sync on canonicals, OG tags, or keywords.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords = PRIMARY_KEYWORDS,
  index = true,
}: PageSeoInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
          type: 'image/jpeg',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@naturestudios',
      images: [fullImageUrl],
    },
    robots: index
      ? {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : {
          index: false,
          follow: false,
          nocache: true,
        },
  };
}

/**
 * High-authority Schema.org WebSite structured data with SearchAction and brand aliases.
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_NAME_ALT,
    url: SITE_URL,
    description:
      'Nature Studios is a premier creative technology and design studio specializing in esports broadcast packages, arena stage architecture, and real-time virtual productions.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/work?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Organization and ProfessionalService Schema.org structured data.
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: 'Nature Studios',
    alternateName: SITE_NAME_ALT,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    description:
      'Elite creative studio and production house engineering championship tournament broadcasts, organic stage architecture, dynamic motion packages, and live digital experiences.',
    email: 'naturestudio05@gmail.com',
    telephone: '+91 7480 066 539',
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://discord.gg/PTVReHZp4n',
      'https://wa.me/917480066539',
      'https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
      'https://twitter.com/naturestudios',
      'https://youtube.com/@naturestudios',
      'https://linkedin.com/company/naturestudios',
      'https://github.com/naturestudios',
    ],
    knowsAbout: [
      'Esports Broadcast Production',
      'Tournament Stage Design',
      'Arena LED Architecture',
      'Motion Design & Kinetic Typography',
      'Real-time Unreal Engine Visuals',
      'Live Streaming Telemetry and HUD Overlays',
      'Esports Brand Systems',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Studio & Esports Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Esports Production & Tournament Staging',
            description: 'Full-service arena staging, real-time match servers, and championship broadcasts.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Broadcast Design & Live Telemetry',
            description: 'Live match HUDs, in-game graphic overlays, dynamic lower-thirds, and real-time statistics.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Arena Architecture & Stage Design',
            description: 'Physical stage architecture fused with generative lighting and responsive ambient LED stadium screens.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Brand Identity & Motion Systems',
            description: 'Visual identities, competitive esports club branding, and animated 3D broadcast toolkits.',
          },
        },
      ],
    },
  };
}

/**
 * FAQ Schema.org structured data for SERP rich snippet enhancement.
 */
export function getFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Nature Studios?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nature Studios (also known as NatureStudios) is an elite creative studio and live production powerhouse. We merge biophilic organic design with competitive technology to engineer stage architectures, tournament broadcasts, motion graphics, and interactive platforms for the world’s leading esports properties.',
        },
      },
      {
        '@type': 'Question',
        name: 'What services does Nature Studios provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nature Studios specializes in Esports Broadcast Production, Arena Stage Architecture, Tournament Brand Identity, 3D Motion Design, Real-time Unreal Engine Virtual Production, and Custom Digital Platforms for gaming titles and live events.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I commission Nature Studios for an esports tournament or broadcast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can initiate a production inquiry directly through our website at naturestudio.in/contact or by submitting a project request in our client portal. Our creative directors review mandates and respond with customized treatment proposals and production schedules.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Nature Studios work with real-time 3D engines like Unreal Engine?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We build realtime broadcast packages, virtual stages, and reactive arena visualizers powered by Unreal Engine 5, TouchDesigner, Notch, and custom WebGL engines for zero-latency live broadcast integration.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Nature Studios located and do you handle international projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nature Studios is headquartered with roots in India and operates globally, collaborating with international tournament organizers, publishers, and esports leagues across North America, Europe, Asia, and the Middle East.',
        },
      },
    ],
  };
}

/**
 * BreadcrumbList Schema.org structured data.
 */
export function getBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
