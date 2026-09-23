import { getMongoDb, isMongoConfigured, ensureMongoIndexes } from './mongodb';
import { prisma } from './prisma';

export * from './portfolio-shared';
import type {
  PortfolioData,
  PortfolioResolution,
  StudioPortfolioItem,
  StudioWorkType,
  GfxSubsection,
} from './portfolio-shared';
import {
  sanitizeSlug,
  isReservedSlug,
  DEFAULT_DESIGN_CONFIG,
  DEFAULT_STUDIO_PORTFOLIO_ITEMS,
  DEFAULT_COMMUNITY_PORTFOLIO_ITEMS,
} from './portfolio-shared';


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

  // Check default community creators
  const defaultCommunity = DEFAULT_COMMUNITY_PORTFOLIO_ITEMS.find((c) => c.slug === cleanSlug);
  if (defaultCommunity) {
    return { portfolio: defaultCommunity, state: 'PUBLISHED' };
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
    portfolioSource: 'user',
    category: data.category ?? existing?.category ?? 'GFX',
    gfxSubcategory: data.gfxSubcategory ?? existing?.gfxSubcategory ?? 'Tournament',
    customCategory: data.customCategory ?? existing?.customCategory ?? '',
    mediaType: data.mediaType ?? existing?.mediaType ?? (data.category === 'VFX' ? 'video' : 'image'),
    mediaUrl: data.mediaUrl ?? existing?.mediaUrl ?? '',
    mediaGallery: data.mediaGallery ?? existing?.mediaGallery ?? [],
    videoThumbnailUrl: data.videoThumbnailUrl ?? existing?.videoThumbnailUrl ?? '',
    duration: data.duration ?? existing?.duration ?? '',
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

/**
 * Fetch all published creator portfolios for public showcase / directory
 */
export async function getPublishedPortfolios(): Promise<PortfolioData[]> {
  const results: PortfolioData[] = [];

  if (isMongoConfigured()) {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    if (db) {
      // Find all portfolios with status 'PUBLISHED'
      const docs = await db
        .collection('portfolios')
        .find({ status: 'PUBLISHED' })
        .sort({ updatedAt: -1 })
        .limit(50)
        .toArray();

      for (const doc of docs) {
        // Verify owner is not suspended
        let isSuspended = false;
        try {
          const userDoc = await db.collection('users').findOne({
            $or: [{ id: doc.userId }, { _id: doc.userId }],
          });
          if (userDoc && (userDoc.isSuspended || userDoc.status === 'SUSPENDED')) {
            isSuspended = true;
          }
        } catch {
          // ignore user lookup error
        }

        if (!isSuspended) {
          const { _id, ...rest } = doc;
          results.push({ id: _id.toString(), ...rest } as PortfolioData);
        }
      }
      return results;
    }
  }

  // Fallback to dev store if MongoDB is not available
  for (const p of Array.from(devPortfolioStore.values())) {
    if (p.status === 'PUBLISHED') {
      results.push(p);
    }
  }

  return results;
}

export interface GlobalPortfolioFilter {
  category?: string;
  subcategory?: string;
  search?: string;
  limit?: number;
}

/**
 * Fetch published user portfolios strictly for Global Portfolio directory
 * Strictly excludes any studio-created portfolios
 */
export async function getGlobalPortfolios(filter?: GlobalPortfolioFilter): Promise<PortfolioData[]> {
  const results: PortfolioData[] = [];

  const normCategory = filter?.category?.toUpperCase().trim();
  const normSubcategory = filter?.subcategory?.toLowerCase().trim();
  const search = filter?.search?.toLowerCase().trim();

  if (isMongoConfigured()) {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    if (db) {
      const query: any = {
        status: 'PUBLISHED',
        portfolioSource: { $ne: 'studio' },
      };

      if (normCategory && ['GFX', 'VFX', 'OTHER'].includes(normCategory)) {
        query.category = normCategory;
      }

      if (normSubcategory) {
        // Match subcategory case-insensitively
        query.$or = [
          { gfxSubcategory: { $regex: normSubcategory.replace('-', '[ /-]'), $options: 'i' } },
          { 'projects.gfxCategory': { $regex: normSubcategory.replace('-', '[ /-]'), $options: 'i' } },
        ];
      }

      if (search) {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
            { 'personalInfo.tagline': { $regex: search, $options: 'i' } },
            { 'skills.name': { $regex: search, $options: 'i' } },
          ],
        });
      }

      const docs = await db
        .collection('portfolios')
        .find(query)
        .sort({ publishedAt: -1, updatedAt: -1 })
        .limit(filter?.limit || 100)
        .toArray();

      for (const doc of docs) {
        // Verify owner is not suspended
        let isSuspended = false;
        try {
          const userDoc = await db.collection('users').findOne({
            $or: [{ id: doc.userId }, { _id: doc.userId }],
          });
          if (userDoc && (userDoc.isSuspended || userDoc.status === 'SUSPENDED')) {
            isSuspended = true;
          }
        } catch {
          // ignore error
        }

        if (!isSuspended) {
          const { _id, ...rest } = doc;
          results.push({
            id: _id.toString(),
            portfolioSource: 'user',
            ...rest,
          } as PortfolioData);
        }
      }
      
      // Supplement MongoDB results with default community items if any categories are empty
      const existingSlugs = new Set(results.map((r) => r.slug));
      for (const p of DEFAULT_COMMUNITY_PORTFOLIO_ITEMS) {
        if (!existingSlugs.has(p.slug)) {
          if (normCategory && p.category?.toUpperCase() !== normCategory) continue;
          if (normSubcategory && p.gfxSubcategory?.toLowerCase().replace(/[^a-z]/g, '') !== normSubcategory.replace(/[^a-z]/g, '')) continue;
          if (search) {
            const text = `${p.title} ${p.personalInfo?.fullName} ${p.personalInfo?.tagline} ${(p.skills || []).map((s) => s.name).join(' ')}`.toLowerCase();
            if (!text.includes(search)) continue;
          }
          results.push(p);
        }
      }
      return results;
    }
  }

  // In-memory fallback
  for (const p of Array.from(devPortfolioStore.values())) {
    if (p.status === 'PUBLISHED' && p.portfolioSource !== 'studio') {
      if (normCategory && p.category?.toUpperCase() !== normCategory) continue;
      if (normSubcategory && p.gfxSubcategory?.toLowerCase().replace(/[^a-z]/g, '') !== normSubcategory.replace(/[^a-z]/g, '')) continue;
      if (search) {
        const text = `${p.title} ${p.personalInfo?.fullName} ${p.personalInfo?.tagline} ${(p.skills || []).map((s) => s.name).join(' ')}`.toLowerCase();
        if (!text.includes(search)) continue;
      }
      results.push(p);
    }
  }

  // Supplement in-memory fallback
  const existingDevSlugs = new Set(results.map((r) => r.slug));
  for (const p of DEFAULT_COMMUNITY_PORTFOLIO_ITEMS) {
    if (!existingDevSlugs.has(p.slug)) {
      if (normCategory && p.category?.toUpperCase() !== normCategory) continue;
      if (normSubcategory && p.gfxSubcategory?.toLowerCase().replace(/[^a-z]/g, '') !== normSubcategory.replace(/[^a-z]/g, '')) continue;
      if (search) {
        const text = `${p.title} ${p.personalInfo?.fullName} ${p.personalInfo?.tagline} ${(p.skills || []).map((s) => s.name).join(' ')}`.toLowerCase();
        if (!text.includes(search)) continue;
      }
      results.push(p);
    }
  }

  return results;
}

// In-memory fallback for studio portfolio items
const devStudioItemsStore = new Map<string, StudioPortfolioItem>(
  DEFAULT_STUDIO_PORTFOLIO_ITEMS.map((item) => [item.id, { ...item, portfolioSource: 'studio' }])
);

/**
 * Fetch studio portfolio items (GFX & VFX)
 */
export async function getStudioPortfolioItems(filter?: {
  type?: StudioWorkType;
  category?: GfxSubsection;
  status?: string;
}): Promise<StudioPortfolioItem[]> {
  if (isMongoConfigured()) {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    if (db) {
      const col = db.collection('studio_portfolio_items');
      const count = await col.countDocuments();
      if (count === 0) {
        // Seed default items with portfolioSource = 'studio'
        const seeded = DEFAULT_STUDIO_PORTFOLIO_ITEMS.map((i) => ({ ...i, portfolioSource: 'studio' }));
        await col.insertMany(seeded as any[]);
      }

      const query: any = {
        portfolioSource: 'studio',
      };
      if (filter?.status) {
        query.status = filter.status;
      } else {
        query.status = 'PUBLISHED';
      }

      if (filter?.type) {
        query.type = filter.type;
      }
      if (filter?.category) {
        const cat = filter.category;
        query.$or = [
          { gfxCategory: cat },
          ...(cat === 'Logo/Banner' ? [{ gfxCategory: 'Logo/Banners' }] : []),
          ...(cat === 'Logo/Banners' ? [{ gfxCategory: 'Logo/Banner' }] : []),
        ];
      }

      const docs = await col.find(query).sort({ order: 1, createdAt: -1 }).toArray();
      return docs.map((doc) => {
        const { _id, ...rest } = doc;
        return { id: _id.toString(), portfolioSource: 'studio', ...rest } as StudioPortfolioItem;
      });
    }
  }

  // In-memory fallback
  let items = Array.from(devStudioItemsStore.values());
  if (filter?.status) {
    items = items.filter((i) => i.status === filter.status);
  } else {
    items = items.filter((i) => i.status === 'PUBLISHED');
  }

  if (filter?.type) {
    items = items.filter((i) => i.type === filter.type);
  }
  if (filter?.category) {
    const cat = filter.category;
    items = items.filter((i) => i.gfxCategory === cat || (cat.startsWith('Logo') && i.gfxCategory?.startsWith('Logo')));
  }

  return items.sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Get single Studio Portfolio item by ID
 */
export async function getStudioPortfolioItemById(id: string): Promise<StudioPortfolioItem | null> {
  if (isMongoConfigured()) {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    if (db) {
      const col = db.collection('studio_portfolio_items');
      let doc: any = null;
      try {
        const { ObjectId } = await import('mongodb');
        if (ObjectId.isValid(id)) {
          doc = await col.findOne({ _id: new ObjectId(id) });
        }
      } catch (e) {}

      if (!doc) {
        doc = await col.findOne({ id });
      }

      if (doc) {
        const { _id, ...rest } = doc;
        return { id: _id.toString(), portfolioSource: 'studio', ...rest } as StudioPortfolioItem;
      }
    }
  }

  // Fallback in-memory / default items
  const found = devStudioItemsStore.get(id) || DEFAULT_STUDIO_PORTFOLIO_ITEMS.find((i) => i.id === id);
  return found || null;
}

/**
 * Create a new Studio Portfolio item (Admin)
 */
export async function createStudioPortfolioItem(
  data: Omit<StudioPortfolioItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<StudioPortfolioItem> {
  const now = new Date().toISOString();
  const id = `studio-${data.type.toLowerCase()}-${Date.now()}`;
  const newItem: StudioPortfolioItem = {
    ...data,
    images: Array.isArray(data.images) && data.images.length > 0 ? data.images : data.imageUrl ? [data.imageUrl] : [],
    id,
    portfolioSource: 'studio',
    createdAt: now,
    updatedAt: now,
  };

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db.collection('studio_portfolio_items').insertOne(newItem as any);
      return newItem;
    }
  }

  devStudioItemsStore.set(id, newItem);
  return newItem;
}

/**
 * Update an existing Studio Portfolio item (Admin)
 */
export async function updateStudioPortfolioItem(
  id: string,
  updates: Partial<StudioPortfolioItem>
): Promise<StudioPortfolioItem | null> {
  const now = new Date().toISOString();
  const updateData = { ...updates, updatedAt: now };

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db
        .collection('studio_portfolio_items')
        .updateOne({ $or: [{ id }, { _id: id } as any] }, { $set: updateData });

      const updated = await db
        .collection('studio_portfolio_items')
        .findOne({ $or: [{ id }, { _id: id } as any] });
      if (updated) {
        const { _id, ...rest } = updated;
        return { id: _id.toString(), ...rest } as StudioPortfolioItem;
      }
    }
  }

  const existing = devStudioItemsStore.get(id);
  if (existing) {
    const merged = { ...existing, ...updateData };
    devStudioItemsStore.set(id, merged);
    return merged;
  }
  return null;
}

/**
 * Delete a Studio Portfolio item (Admin)
 */
export async function deleteStudioPortfolioItem(id: string): Promise<boolean> {
  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db
        .collection('studio_portfolio_items')
        .deleteOne({ $or: [{ id }, { _id: id } as any] });
      return true;
    }
  }

  devStudioItemsStore.delete(id);
  return true;
}

