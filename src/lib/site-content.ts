import { getMongoDb } from './mongodb';
import { SiteContentDoc } from './admin-db';

/**
 * NATURESTUDIOS — DATABASE-BACKED CMS CONTENT
 * Provides dynamic site copy with instant fallbacks to prevent site crashes.
 */

export const DEFAULT_PAGE_CONTENT: Record<string, any> = {
  homepage: {
    heroTagline: 'ESPORTS • CREATIVE • DIGITAL',
    heroHeadline: 'WE CREATE THE NEXT LEVEL OF ESPORTS.',
    heroSubhead: 'NatureStudios is an elite creative studio for esports organizations, game publishers, tournament broadcasts, and digital creators.',
    heroPrimaryCta: 'EXPLORE OUR WORK',
    heroSecondaryCta: 'START A PROJECT',
    stats: [
      { label: 'Broadcasts Produced', value: '200+' },
      { label: 'Tournament Stages', value: '40+' },
      { label: 'Cumulative Views', value: '50M+' },
      { label: 'Production Uptime', value: '99.99%' },
    ],
    manifestoHeadline: 'WHERE BIOLOGICAL INSTINCT MEETS STADIUM SCALE.',
    manifestoBody: 'We believe esports broadcasts should not merely be technical feeds. They are modern digital colosseums of human adrenaline.',
  },
  about: {
    title: 'ABOUT NATURESTUDIOS',
    subtitle: 'THE BIOLOGY OF DIGITAL ESPORTS',
    mission: 'To construct monumental digital identities, cinematic stage visuals, and zero-latency broadcast systems that elevate competitive gaming to stadium art.',
  },
  services: {
    title: 'STUDIO CAPABILITIES',
    subtitle: 'BROADCAST • MOTION • IDENTITY • PLATFORMS',
  },
  contact: {
    title: 'START A COLLABORATION',
    subtitle: 'DIRECT LINE TO OUR CREATIVE DIRECTORS',
    publicEmail: 'naturestudio05@gmail.com',
    whatsapp: '+91 7480 066 539',
    whatsappUrl: 'https://wa.me/917480066539',
    discordUrl: 'https://discord.gg/PTVReHZp4n',
    instagram: 'https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
  },
};

/**
 * Retrieve database-backed content for a specific page slug with fallback
 */
export async function getPageContent(slug: string): Promise<Record<string, any>> {
  const db = await getMongoDb();

  if (db) {
    try {
      const doc = await db.collection('siteContent').findOne({ slug, status: 'PUBLISHED' });
      if (doc && doc.sections) {
        return {
          ...DEFAULT_PAGE_CONTENT[slug],
          ...doc.sections,
        };
      }
    } catch (e) {
      console.error(`Failed to load site content for ${slug}:`, e);
    }
  }

  return DEFAULT_PAGE_CONTENT[slug] || {};
}

/**
 * Save draft or publish content for a page
 */
export async function savePageContent(
  slug: string,
  title: string,
  sections: Record<string, any>,
  action: 'DRAFT' | 'PUBLISH',
  updatedBy: string
): Promise<SiteContentDoc> {
  const db = await getMongoDb();
  const now = new Date().toISOString();

  const doc: SiteContentDoc = {
    slug,
    title,
    status: action === 'PUBLISH' ? 'PUBLISHED' : 'DRAFT',
    sections,
    version: 1,
    publishedAt: action === 'PUBLISH' ? now : null,
    updatedBy,
    updatedAt: now,
  };

  if (db) {
    await db.collection('siteContent').updateOne(
      { slug },
      { $set: doc },
      { upsert: true }
    );
  }

  return doc;
}
