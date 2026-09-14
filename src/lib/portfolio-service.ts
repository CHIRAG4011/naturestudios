import { getMongoDb, isMongoConfigured, ensureMongoIndexes } from './mongodb';
import { prisma } from './prisma';

/**
 * Portfolio Data Types and Configurations
 */

export type PortfolioStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED' | 'SUSPENDED';

export interface PortfolioResolution {
  portfolio: PortfolioData | null;
  state: 'PUBLISHED' | 'SUSPENDED' | 'DRAFT' | 'NOT_FOUND';
  suspendedReason?: string | null;
}

export type PortfolioThemeId =
  | 'editorial'
  | 'cinematic'
  | 'minimal'
  | 'creative-grid'
  | 'immersive'
  | 'esports'
  | 'magazine'
  | 'experimental'
  | 'custom';

export interface PortfolioPersonalInfo {
  fullName: string;
  professionalName?: string;
  username: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  country?: string;
  professionalTitle?: string;
  tagline?: string;
  aboutMe?: string;
  publicEmail?: string;
  phone?: string;
  website?: string;
  availability?: string; // Available for projects, full-time, booked
}

export interface PortfolioProfessionalIdentity {
  jobTitle?: string;
  industry?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  yearsExperience?: number;
  summary?: string;
  careerObjective?: string;
  specialization?: string;
  workType?: string; // Remote, Hybrid, On-site
  freelanceAvailability?: boolean;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  category: string;
  experienceLevel: string; // Beginner, Intermediate, Expert
  years?: number;
  proficiency?: number; // 1-100
}

export interface PortfolioProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  role?: string;
  client?: string;
  category: string;
  tools?: string[];
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  projectUrl?: string;
  thumbnail?: string;
  gallery?: string[];
  videoUrl?: string;
  challenge?: string;
  responsibilities?: string;
  solution?: string;
  outcome?: string;
  results?: string;
  tags?: string[];
  order: number;
}

export interface PortfolioExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentPosition?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface PortfolioCertification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  award?: string;
}

export interface PortfolioServiceItem {
  id: string;
  name: string;
  description: string;
  startingPrice?: string;
  deliveryTime?: string;
}

export interface PortfolioSocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  behance?: string;
  dribbble?: string;
  youtube?: string;
  twitch?: string;
  discord?: string;
  website?: string;
}

export interface PortfolioContactConfig {
  publicEmail?: string;
  contactFormEnabled: boolean;
  location?: string;
  availability?: string;
  preferredContactMethod?: string;
}

export interface PortfolioDesignConfig {
  themeId: PortfolioThemeId;
  fontPair: string; // editorial, brutalist, minimal, esports, modern-sans
  accentColor: string; // burgundy, beige, orange, green, red, custom hex
  backgroundStyle: string; // dark-burgundy, void, wine, warm-beige, midnight, forest
  heroLayout: string; // split, center-bold, full-bleed, minimal
  projectLayout: string; // reel, grid-2, masonry, list
  cardStyle: string; // elevated, bordered, glass, minimal
  sectionOrder: string[]; // ['hero', 'about', 'skills', 'projects', 'experience', 'services', 'contact']
  navigationStyle: string; // fixed-top, minimal-dock, drawer
  animationIntensity: 'subtle' | 'cinematic' | 'reduced';
  imageTreatment: 'monochrome-hover' | 'cinematic-glow' | 'standard';
  templateName?: string;
  customCss?: string;
  visibleSections?: {
    about?: boolean;
    skills?: boolean;
    projects?: boolean;
    experience?: boolean;
    education?: boolean;
    achievements?: boolean;
    services?: boolean;
    contact?: boolean;
  };
}

export interface PortfolioSeoConfig {
  seoTitle?: string;
  seoDescription?: string;
  socialPreviewImage?: string;
}

export interface PortfolioData {
  id: string;
  userId: string;
  slug: string;
  status: PortfolioStatus;
  title: string;
  description?: string;
  themeId: PortfolioThemeId;
  personalInfo: PortfolioPersonalInfo;
  professionalIdentity: PortfolioProfessionalIdentity;
  skills: PortfolioSkill[];
  projects: PortfolioProjectItem[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  certifications: PortfolioCertification[];
  services: PortfolioServiceItem[];
  socialLinks: PortfolioSocialLinks;
  contactConfig: PortfolioContactConfig;
  designConfig: PortfolioDesignConfig;
  seoConfig: PortfolioSeoConfig;
  views?: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reserved subdomains that cannot be claimed by users
 */
export const RESERVED_SUBDOMAINS = new Set([
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

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SUBDOMAINS.has(slug.toLowerCase().trim());
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Default design configuration
 */
export const DEFAULT_DESIGN_CONFIG: PortfolioDesignConfig = {
  themeId: 'editorial',
  fontPair: 'editorial',
  accentColor: '#59171B',
  backgroundStyle: 'dark-burgundy',
  heroLayout: 'center-bold',
  projectLayout: 'reel',
  cardStyle: 'glass',
  sectionOrder: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'services', 'contact'],
  navigationStyle: 'fixed-top',
  animationIntensity: 'cinematic',
  imageTreatment: 'cinematic-glow',
};

/**
 * In-memory / dev fallback cache when MongoDB Atlas is not yet connected
 */
const devPortfolioStore = new Map<string, PortfolioData>();

/**
 * Find portfolio by userId (for dashboard / builder)
 */
export async function getPortfolioByUserId(userId: string): Promise<PortfolioData | null> {
  if (isMongoConfigured()) {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('portfolios').findOne({ userId });
      if (doc) {
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest } as PortfolioData;
      }
      return null;
    }
  }

  // Fallback dev store
  for (const p of Array.from(devPortfolioStore.values())) {
    if (p.userId === userId) return p;
  }
  return null;
}

/**
 * Resolve public portfolio status by slug (for subdomains and /portfolio-render/[slug])
 * Detects whether portfolio is PUBLISHED, SUSPENDED (directly or via owner account), DRAFT, or NOT_FOUND
 */
export async function getPortfolioResolutionBySlug(slug: string): Promise<PortfolioResolution> {
  const cleanSlug = sanitizeSlug(slug);

  if (isMongoConfigured()) {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('portfolios').findOne({ slug: cleanSlug });
      if (doc) {
        const { _id, ...rest } = doc;
        const portfolioData = {
          id: _id.toString(),
          ...rest,
        } as PortfolioData;

        // 1. Check if portfolio itself is marked SUSPENDED
        if (doc.status === 'SUSPENDED') {
          return {
            portfolio: portfolioData,
            state: 'SUSPENDED',
            suspendedReason: doc.suspendedReason || 'Portfolio access has been suspended by platform moderation.',
          };
        }

        // 2. Check if the creator/owner account is marked SUSPENDED
        if (doc.userId) {
          try {
            const ownerStatus = await db.collection('adminUserStatuses').findOne({ userId: doc.userId });
            if (ownerStatus && ownerStatus.status === 'SUSPENDED') {
              return {
                portfolio: portfolioData,
                state: 'SUSPENDED',
                suspendedReason: ownerStatus.reason || 'Creator account is currently suspended.',
              };
            }

            const ownerPrisma = await prisma.user.findUnique({
              where: { id: doc.userId },
              select: { status: true, suspendedReason: true, suspendedAt: true },
            }).catch(() => null);

            if (ownerPrisma && ownerPrisma.status === 'SUSPENDED') {
              return {
                portfolio: portfolioData,
                state: 'SUSPENDED',
                suspendedReason: ownerPrisma.suspendedReason || 'Creator account is currently suspended.',
              };
            }
          } catch (err) {
            console.error('Error checking portfolio owner status:', err);
          }
        }

        // 3. If published and owner is active
        if (doc.status === 'PUBLISHED') {
          return {
            portfolio: portfolioData,
            state: 'PUBLISHED',
          };
        }

        // 4. In draft / unverified
        return {
          portfolio: portfolioData,
          state: 'DRAFT',
        };
      }
      return { portfolio: null, state: 'NOT_FOUND' };
    }
  }

  // Dev fallback
  const cached = devPortfolioStore.get(cleanSlug);
  if (cached) {
    if (cached.status === 'SUSPENDED') {
      return {
        portfolio: cached,
        state: 'SUSPENDED',
        suspendedReason: 'Portfolio suspended.',
      };
    }
    if (cached.status === 'PUBLISHED') {
      return { portfolio: cached, state: 'PUBLISHED' };
    }
    return { portfolio: cached, state: 'DRAFT' };
  }

  return { portfolio: null, state: 'NOT_FOUND' };
}

/**
 * Find public published portfolio by slug (subdomain lookup)
 */
export async function getPublishedPortfolioBySlug(slug: string): Promise<PortfolioData | null> {
  const resolution = await getPortfolioResolutionBySlug(slug);
  if (resolution.state === 'PUBLISHED') {
    return resolution.portfolio;
  }
  return null;
}

/**
 * Check if a slug is available for a given userId
 */
export async function isSlugAvailable(slug: string, currentUserId: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug || cleanSlug.length < 3) return false;
  if (isReservedSlug(cleanSlug)) return false;

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      const existing = await db.collection('portfolios').findOne({ slug: cleanSlug });
      if (!existing) return true;
      return String(existing.userId) === String(currentUserId);
    }
  }

  const cached = devPortfolioStore.get(cleanSlug);
  if (!cached) return true;
  return String(cached.userId) === String(currentUserId);
}

/**
 * Create or save portfolio (Autosave & Full Save)
 * Strict tenant isolation: checks ownership
 */
export async function savePortfolio(userId: string, data: Partial<PortfolioData>): Promise<PortfolioData> {
  const existing = await getPortfolioByUserId(userId);
  const now = new Date().toISOString();

  let slug = data.slug ? sanitizeSlug(data.slug) : existing?.slug;
  if (!slug) {
    slug = `creator-${userId.slice(-6)}`;
  }

  // Ensure slug uniqueness
  const available = await isSlugAvailable(slug, userId);
  if (!available) {
    // Only append random suffix if there is a conflict with ANOTHER user's portfolio
    if (!existing || existing.slug !== slug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  // If slug has changed, remove old slug from memory cache
  if (existing?.slug && existing.slug !== slug) {
    devPortfolioStore.delete(existing.slug);
  }

  const portfolioId = existing?.id || `pf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const updatedData: PortfolioData = {
    id: portfolioId,
    userId,
    slug,
    status: data.status || existing?.status || 'DRAFT',
    title: data.title || existing?.title || data.personalInfo?.fullName || 'My Portfolio',
    description: data.description ?? existing?.description ?? '',
    themeId: data.themeId || existing?.themeId || 'editorial',
    personalInfo: {
      fullName: data.personalInfo?.fullName ?? existing?.personalInfo?.fullName ?? '',
      professionalName: data.personalInfo?.professionalName ?? existing?.personalInfo?.professionalName ?? '',
      username: slug,
      profileImage: data.personalInfo?.profileImage ?? existing?.personalInfo?.profileImage ?? '',
      coverImage: data.personalInfo?.coverImage ?? existing?.personalInfo?.coverImage ?? '',
      location: data.personalInfo?.location ?? existing?.personalInfo?.location ?? '',
      country: data.personalInfo?.country ?? existing?.personalInfo?.country ?? '',
      professionalTitle: data.personalInfo?.professionalTitle ?? existing?.personalInfo?.professionalTitle ?? '',
      tagline: data.personalInfo?.tagline ?? existing?.personalInfo?.tagline ?? '',
      aboutMe: data.personalInfo?.aboutMe ?? existing?.personalInfo?.aboutMe ?? '',
      publicEmail: data.personalInfo?.publicEmail ?? existing?.personalInfo?.publicEmail ?? '',
      phone: data.personalInfo?.phone ?? existing?.personalInfo?.phone ?? '',
      website: data.personalInfo?.website ?? existing?.personalInfo?.website ?? '',
      availability: data.personalInfo?.availability ?? existing?.personalInfo?.availability ?? 'Available for projects',
    },
    professionalIdentity: data.professionalIdentity ?? existing?.professionalIdentity ?? {},
    skills: data.skills ?? existing?.skills ?? [],
    projects: data.projects ?? existing?.projects ?? [],
    experience: data.experience ?? existing?.experience ?? [],
    education: data.education ?? existing?.education ?? [],
    certifications: data.certifications ?? existing?.certifications ?? [],
    services: data.services ?? existing?.services ?? [],
    socialLinks: data.socialLinks ?? existing?.socialLinks ?? {},
    contactConfig: data.contactConfig ?? existing?.contactConfig ?? { contactFormEnabled: true },
    designConfig: data.designConfig ?? existing?.designConfig ?? DEFAULT_DESIGN_CONFIG,
    seoConfig: data.seoConfig ?? existing?.seoConfig ?? {
      seoTitle: `${data.personalInfo?.fullName || 'Creator'} — Portfolio | NatureStudios`,
      seoDescription: data.personalInfo?.aboutMe?.slice(0, 160) || 'Creative portfolio built on NatureStudios.',
    },
    views: existing?.views ?? 0,
    publishedAt: data.status === 'PUBLISHED' ? existing?.publishedAt || now : existing?.publishedAt,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db.collection('portfolios').updateOne(
        { userId },
        { $set: updatedData },
        { upsert: true }
      );
    }
  }

  // Update dev fallback
  devPortfolioStore.set(slug, updatedData);
  return updatedData;
}

/**
 * Record a contact message sent to a portfolio owner
 */
export async function savePortfolioContactMessage(
  portfolioId: string,
  data: { name: string; email: string; company?: string; message: string; projectDetails?: string }
): Promise<boolean> {
  const messageDoc = {
    portfolioId,
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company?.trim() || null,
    message: data.message.trim(),
    projectDetails: data.projectDetails?.trim() || null,
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db.collection('portfolioContacts').insertOne(messageDoc);
      return true;
    }
  }

  return true;
}
