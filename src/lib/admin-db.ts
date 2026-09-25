import { getMongoDb, isMongoConfigured } from './mongodb';
import { SYSTEM_ROLES, ALL_PERMISSIONS, PermissionOverride } from './admin-rbac';
import { ObjectId } from 'mongodb';

/**
 * NATURESTUDIOS — ADMIN DATABASE MODELS & OPERATIONS
 * Direct integration with MongoDB Atlas for administrative collections.
 */

export interface AdminRoleDoc {
  _id?: ObjectId;
  slug: string;
  name: string;
  description: string;
  permissions: string[];
  systemRole: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRoleAssignmentDoc {
  _id?: ObjectId;
  userId: string;
  roleSlug: string;
  assignedBy: string;
  createdAt: string;
}

export interface AdminPermissionOverrideDoc {
  _id?: ObjectId;
  userId: string;
  permissionKey: string;
  effect: 'ALLOW' | 'DENY';
  reason?: string;
  assignedBy: string;
  expiresAt?: string | null;
  createdAt: string;
}

export interface AdminAuditLogDoc {
  _id?: ObjectId;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  beforeState?: any;
  afterState?: any;
  reason?: string;
  status: 'SUCCESS' | 'FAILURE';
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SiteSettingsDoc {
  _id?: ObjectId;
  brandName: string;
  tagline: string;
  companyName: string;
  contactEmail: string;
  supportEmail: string;
  inquiriesEmail: string;
  instagramUrl?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  registrationEnabled: boolean;
  googleLoginEnabled: boolean;
  emailVerificationRequired: boolean;
  portfolioCreationEnabled: boolean;
  portfolioPublishingEnabled: boolean;
  contactFormsEnabled: boolean;
  messagingEnabled: boolean;
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
  timezone: string;
  updatedAt: string;
}

export interface SiteThemeDoc {
  _id?: ObjectId;
  version: number;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    liveRed: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    ambientMesh: string;
  };
  typography: {
    displayFont: string;
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    headingScale: string;
    bodyScale: string;
  };
  design: {
    borderRadius: string;
    spacingScale: string;
    shadowIntensity: string;
    blurIntensity: string;
    buttonStyle: string;
    cardStyle: string;
    animationIntensity: 'OFF' | 'SUBTLE' | 'STANDARD' | 'CINEMATIC' | 'EXTREME';
    grainIntensity: number;
    particleIntensity: number;
  };
  publishedAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContentDoc {
  _id?: ObjectId;
  slug: string; // 'homepage', 'about', 'services', 'studio', 'contact', 'footer', 'cta'
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  sections: Record<string, any>;
  version: number;
  publishedAt?: string | null;
  updatedBy: string;
  updatedAt: string;
}

export interface MediaAssetDoc {
  _id?: ObjectId;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folder?: string;
  altText?: string;
  usageCount: number;
  usedIn?: string[];
  uploadedBy: string;
  createdAt: string;
}

export interface EmailTemplateDoc {
  _id?: ObjectId;
  slug: string;
  name: string;
  description: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  variables: string[];
  enabled: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface EmailLogDoc {
  _id?: ObjectId;
  recipient: string;
  templateSlug: string;
  subject: string;
  status: 'SENT' | 'FAILED';
  providerId?: string;
  error?: string;
  ip?: string;
  createdAt: string;
}

export interface RedirectDoc {
  _id?: ObjectId;
  source: string;
  destination: string;
  statusCode: 301 | 302;
  enabled: boolean;
  hits: number;
  createdAt: string;
}

export interface FeatureFlagDoc {
  _id?: ObjectId;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  percentage?: number;
  targetRoles?: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface AnnouncementDoc {
  _id?: ObjectId;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT';
  audience: 'ALL' | 'CREATORS' | 'STAFF';
  startDate?: string;
  endDate?: string;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

export interface SupportTicketDoc {
  _id?: ObjectId;
  ticketNumber: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: 'APPEAL' | 'ACCOUNT' | 'BILLING' | 'TECHNICAL' | 'GENERAL' | 'PROJECT_INQUIRY' | 'COMMISSION';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'RESOLVED' | 'CLOSED';
  internalNotes?: string[];
  assignedTo?: string;
  targetUserId?: string;
  targetUserEmail?: string;
  targetType?: 'STUDIO' | 'CREATOR';
  portfolioSlug?: string;
  portfolioTitle?: string;
  responses?: Array<{
    id: string;
    sender: 'USER' | 'ADMIN';
    senderName: string;
    senderEmail: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioReportDoc {
  _id?: ObjectId;
  portfolioSlug: string;
  portfolioId?: string;
  reporterEmail?: string;
  reason: 'spam' | 'copyright' | 'abusive' | 'malicious' | 'impersonation' | 'other';
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  resolutionNote?: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AnalyticsEventDoc {
  _id?: ObjectId;
  eventType: string; // 'page_view' | 'registration' | 'portfolio_view' | 'project_request' | 'contact_submission' | 'login' | 'logout'
  path: string;
  referrer?: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface SecurityEventDoc {
  _id?: ObjectId;
  type: string; // 'FAILED_LOGIN' | 'SUSPICIOUS_IP' | 'RATE_LIMIT_HIT' | 'SESSION_REVOKED' | 'ROLE_ESCALATION_ATTEMPT'
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

/**
 * In-memory fallback dev store when MongoDB Atlas connection string is not yet populated
 */
class InMemoryAdminStore {
  roles = new Map<string, AdminRoleDoc>();
  roleAssignments = new Map<string, AdminRoleAssignmentDoc[]>();
  permissionOverrides = new Map<string, AdminPermissionOverrideDoc[]>();
  auditLogs: AdminAuditLogDoc[] = [];
  siteSettings: SiteSettingsDoc | null = null;
  themes: SiteThemeDoc[] = [];
  content = new Map<string, SiteContentDoc>();
  mediaAssets: MediaAssetDoc[] = [];
  emailTemplates = new Map<string, EmailTemplateDoc>();
  emailLogs: EmailLogDoc[] = [];
  redirects: RedirectDoc[] = [];
  featureFlags = new Map<string, FeatureFlagDoc>();
  announcements: AnnouncementDoc[] = [];
  supportTickets: SupportTicketDoc[] = [];
  portfolioReports: PortfolioReportDoc[] = [];
  analyticsEvents: AnalyticsEventDoc[] = [];
  securityEvents: SecurityEventDoc[] = [];
}

const memoryStore = new InMemoryAdminStore();

/**
 * Initialize all mandatory admin indexes and baseline records in MongoDB Atlas
 */
let adminInitialized = false;

export async function ensureAdminInitialized(): Promise<void> {
  if (adminInitialized) return;
  const db = await getMongoDb();

  // Baseline Default Site Settings
  const defaultSettings: SiteSettingsDoc = {
    brandName: 'NATURESTUDIOS',
    tagline: 'ESPORTS • CREATIVE • DIGITAL',
    companyName: 'NatureStudios Creative Agency',
    contactEmail: 'naturestudio05@gmail.com',
    supportEmail: 'naturestudio05@gmail.com',
    inquiriesEmail: 'naturestudio05@gmail.com',
    instagramUrl: 'https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
    maintenanceMode: false,
    maintenanceMessage: 'NatureStudios is undergoing brief scheduled maintenance. We will be back shortly.',
    registrationEnabled: true,
    googleLoginEnabled: true,
    emailVerificationRequired: false,
    portfolioCreationEnabled: true,
    portfolioPublishingEnabled: true,
    contactFormsEnabled: true,
    messagingEnabled: true,
    notificationsEnabled: true,
    analyticsEnabled: true,
    timezone: 'Asia/Kolkata',
    updatedAt: new Date().toISOString(),
  };

  // Baseline Default Theme (Burgundy & Warm Beige)
  const defaultTheme: SiteThemeDoc = {
    version: 1,
    name: 'NatureStudios Cinematic Burgundy (Default)',
    status: 'PUBLISHED',
    colors: {
      primary: '#59171B',
      secondary: '#FED7B8',
      background: '#150304',
      surface: '#240709',
      text: '#FFF5ED',
      mutedText: '#B89B8D',
      border: '#3D0D13',
      accent: '#FED7B8',
      success: '#18A957',
      warning: '#F59E0B',
      error: '#E63946',
      liveRed: '#E63946',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #59171B 0%, #240709 100%)',
      secondary: 'linear-gradient(135deg, #FED7B8 0%, #FFF5ED 100%)',
      ambientMesh: 'radial-gradient(circle, rgba(89, 23, 27, 0.4) 0%, transparent 70%)',
    },
    typography: {
      displayFont: 'Syne, sans-serif',
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Inter, sans-serif',
      monoFont: 'JetBrains Mono, monospace',
      headingScale: '1.0',
      bodyScale: '1.0',
    },
    design: {
      borderRadius: '16px',
      spacingScale: '1.0',
      shadowIntensity: '0.8',
      blurIntensity: '12px',
      buttonStyle: 'rounded-xl',
      cardStyle: 'bordered',
      animationIntensity: 'CINEMATIC',
      grainIntensity: 0.15,
      particleIntensity: 0.25,
    },
    publishedAt: new Date().toISOString(),
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Baseline Standard Email Templates
  const defaultTemplates: EmailTemplateDoc[] = [
    {
      slug: 'verification-otp',
      name: 'Verification OTP',
      description: 'One-time passcode sent to verify creator email addresses',
      subject: 'Your NatureStudios Security Passcode: {{otp}}',
      bodyHtml: '<p>Hello {{name}},</p><p>Your verification passcode is: <strong>{{otp}}</strong></p><p>Valid for 10 minutes.</p>',
      bodyText: 'Hello {{name}}, Your verification passcode is: {{otp}}. Valid for 10 minutes.',
      variables: ['name', 'otp', 'expirationMinutes'],
      enabled: true,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'welcome',
      name: 'Welcome to NatureStudios',
      description: 'Sent immediately upon successful registration',
      subject: 'Welcome to NatureStudios — Creative Platform',
      bodyHtml: '<p>Welcome {{name}}! Your creative workspace is now active.</p>',
      bodyText: 'Welcome {{name}}! Your creative workspace is now active.',
      variables: ['name', 'dashboardUrl'],
      enabled: true,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'portfolio-published',
      name: 'Portfolio Live Notification',
      description: 'Sent when a creator portfolio is published to their subdomain',
      subject: 'Your Portfolio is Live at {{subdomain}}',
      bodyHtml: '<p>Congratulations {{name}}, your portfolio is live at {{subdomain}}!</p>',
      bodyText: 'Congratulations {{name}}, your portfolio is live at {{subdomain}}!',
      variables: ['name', 'subdomain', 'portfolioUrl'],
      enabled: true,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
  ];

  // Baseline Feature Flags
  const defaultFeatureFlags: FeatureFlagDoc[] = [
    { key: 'newPortfolioBuilder', name: 'Custom Template Studio', description: 'Enable bespoke template customization in portfolio builder', enabled: true, updatedBy: 'system', updatedAt: new Date().toISOString() },
    { key: 'cinematicAnimations', name: 'Cinematic Scroll Animations', description: 'Enable 3D cards, tickers, and kinetic floating badges', enabled: true, updatedBy: 'system', updatedAt: new Date().toISOString() },
    { key: 'portfolioContacts', name: 'Subdomain Contact Form', description: 'Enable public visitor contact form on creator subdomains', enabled: true, updatedBy: 'system', updatedAt: new Date().toISOString() },
    { key: 'adminCommandPalette', name: 'Admin Command Palette (Ctrl+K)', description: 'Enable keyboard shortcut command palette in Admin Center', enabled: true, updatedBy: 'system', updatedAt: new Date().toISOString() },
  ];

  if (db) {
    try {
      // Indexes
      await db.collection('adminRoles').createIndex({ slug: 1 }, { unique: true });
      await db.collection('adminRoleAssignments').createIndex({ userId: 1, roleSlug: 1 }, { unique: true });
      await db.collection('adminPermissionOverrides').createIndex({ userId: 1, permissionKey: 1 }, { unique: true });
      await db.collection('adminAuditLogs').createIndex({ createdAt: -1 });
      await db.collection('adminAuditLogs').createIndex({ adminId: 1 });
      await db.collection('adminAuditLogs').createIndex({ resource: 1 });
      await db.collection('siteThemeSettings').createIndex({ version: 1 }, { unique: true });
      await db.collection('siteContent').createIndex({ slug: 1 }, { unique: true });
      await db.collection('mediaAssets').createIndex({ url: 1 }, { unique: true });
      await db.collection('emailTemplates').createIndex({ slug: 1 }, { unique: true });
      await db.collection('emailLogs').createIndex({ createdAt: -1 });
      await db.collection('redirects').createIndex({ source: 1 }, { unique: true });
      await db.collection('featureFlags').createIndex({ key: 1 }, { unique: true });
      await db.collection('announcements').createIndex({ enabled: 1 });
      await db.collection('supportTickets').createIndex({ ticketNumber: 1 }, { unique: true });
      await db.collection('supportTickets').createIndex({ status: 1 });
      await db.collection('portfolioReports').createIndex({ portfolioSlug: 1 });
      await db.collection('portfolioReports').createIndex({ status: 1 });
      await db.collection('analyticsEvents').createIndex({ timestamp: -1 });
      await db.collection('analyticsEvents').createIndex({ eventType: 1 });
      await db.collection('securityEvents').createIndex({ createdAt: -1 });

      // Seed Default Roles if missing
      for (const role of SYSTEM_ROLES) {
        await db.collection('adminRoles').updateOne(
          { slug: role.slug },
          {
            $setOnInsert: {
              slug: role.slug,
              name: role.name,
              description: role.description,
              permissions: role.permissions,
              systemRole: true,
              active: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );
      }

      // Seed Site Settings
      const existingSettings = await db.collection('siteSettings').findOne({});
      if (!existingSettings) {
        await db.collection('siteSettings').insertOne(defaultSettings as any);
      }

      // Seed Default Theme
      const existingTheme = await db.collection('siteThemeSettings').findOne({ status: 'PUBLISHED' });
      if (!existingTheme) {
        await db.collection('siteThemeSettings').insertOne(defaultTheme as any);
      }

      // Seed Email Templates
      for (const tmpl of defaultTemplates) {
        await db.collection('emailTemplates').updateOne(
          { slug: tmpl.slug },
          { $setOnInsert: tmpl as any },
          { upsert: true }
        );
      }

      // Seed Feature Flags
      for (const flag of defaultFeatureFlags) {
        await db.collection('featureFlags').updateOne(
          { key: flag.key },
          { $setOnInsert: flag as any },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error('Failed to initialize MongoDB Admin collections:', err);
    }
  } else {
    // Populate in-memory fallback
    for (const role of SYSTEM_ROLES) {
      memoryStore.roles.set(role.slug, {
        slug: role.slug,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        systemRole: true,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    if (!memoryStore.siteSettings) memoryStore.siteSettings = defaultSettings;
    if (memoryStore.themes.length === 0) memoryStore.themes.push(defaultTheme);
    for (const tmpl of defaultTemplates) memoryStore.emailTemplates.set(tmpl.slug, tmpl);
    for (const flag of defaultFeatureFlags) memoryStore.featureFlags.set(flag.key, flag);
  }

  adminInitialized = true;
}

/**
 * Assign a role to a user
 */
export async function assignUserRole(userId: string, roleSlug: string, assignedBy: string): Promise<boolean> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const doc: AdminRoleAssignmentDoc = {
    userId,
    roleSlug,
    assignedBy,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection('adminRoleAssignments').updateOne(
      { userId, roleSlug },
      { $set: doc },
      { upsert: true }
    );
    return true;
  }

  const existing = memoryStore.roleAssignments.get(userId) || [];
  if (!existing.some((r) => r.roleSlug === roleSlug)) {
    existing.push(doc);
    memoryStore.roleAssignments.set(userId, existing);
  }
  return true;
}

/**
 * Remove a role from a user
 */
export async function removeUserRole(userId: string, roleSlug: string): Promise<boolean> {
  await ensureAdminInitialized();
  const db = await getMongoDb();

  if (db) {
    await db.collection('adminRoleAssignments').deleteOne({ userId, roleSlug });
    return true;
  }

  const existing = memoryStore.roleAssignments.get(userId) || [];
  memoryStore.roleAssignments.set(
    userId,
    existing.filter((r) => r.roleSlug !== roleSlug)
  );
  return true;
}

/**
 * Get all roles assigned to a user
 */
export async function getUserRoles(userId: string): Promise<string[]> {
  await ensureAdminInitialized();
  const db = await getMongoDb();

  if (db) {
    const docs = await db.collection('adminRoleAssignments').find({ userId }).toArray();
    return docs.map((d: any) => d.roleSlug);
  }

  const existing = memoryStore.roleAssignments.get(userId) || [];
  return existing.map((r) => r.roleSlug);
}

/**
 * Get user permission overrides
 */
export async function getUserPermissionOverrides(userId: string): Promise<PermissionOverride[]> {
  await ensureAdminInitialized();
  const db = await getMongoDb();

  if (db) {
    const docs = await db.collection('adminPermissionOverrides').find({ userId }).toArray();
    return docs.map((d: any) => ({
      permissionKey: d.permissionKey,
      effect: d.effect,
      reason: d.reason,
      expiresAt: d.expiresAt,
    }));
  }

  const existing = memoryStore.permissionOverrides.get(userId) || [];
  return existing.map((o) => ({
    permissionKey: o.permissionKey,
    effect: o.effect,
    reason: o.reason,
    expiresAt: o.expiresAt,
  }));
}

/**
 * Set a permission override for a user
 */
export async function setPermissionOverride(
  userId: string,
  permissionKey: string,
  effect: 'ALLOW' | 'DENY',
  assignedBy: string,
  reason?: string,
  expiresAt?: string | null
): Promise<boolean> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const doc: AdminPermissionOverrideDoc = {
    userId,
    permissionKey,
    effect,
    reason,
    assignedBy,
    expiresAt,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection('adminPermissionOverrides').updateOne(
      { userId, permissionKey },
      { $set: doc },
      { upsert: true }
    );
    return true;
  }

  const existing = memoryStore.permissionOverrides.get(userId) || [];
  const filtered = existing.filter((o) => o.permissionKey !== permissionKey);
  filtered.push(doc);
  memoryStore.permissionOverrides.set(userId, filtered);
  return true;
}

/**
 * Count total SUPER_ADMIN users (for last-super-admin protection)
 */
export async function countSuperAdmins(): Promise<number> {
  await ensureAdminInitialized();
  const db = await getMongoDb();

  if (db) {
    return db.collection('adminRoleAssignments').countDocuments({ roleSlug: 'SUPER_ADMIN' });
  }

  let count = 0;
  for (const list of Array.from(memoryStore.roleAssignments.values())) {
    if (list.some((r) => r.roleSlug === 'SUPER_ADMIN')) count++;
  }
  return count;
}

/**
 * Record an immutable audit log entry
 */
export async function logAdminAudit(
  adminId: string,
  adminEmail: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>,
  beforeState?: any,
  afterState?: any,
  reason?: string,
  status: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
  ip?: string,
  userAgent?: string
): Promise<void> {
  const db = await getMongoDb();

  // Strip sensitive credentials from details/states
  const sanitizedDetails = details ? sanitizeAuditData(details) : undefined;
  const sanitizedBefore = beforeState ? sanitizeAuditData(beforeState) : undefined;
  const sanitizedAfter = afterState ? sanitizeAuditData(afterState) : undefined;

  const entry: AdminAuditLogDoc = {
    adminId,
    adminEmail,
    action,
    resource,
    resourceId,
    details: sanitizedDetails,
    beforeState: sanitizedBefore,
    afterState: sanitizedAfter,
    reason,
    status,
    ip,
    userAgent,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection('adminAuditLogs').insertOne(entry as any);
  } else {
    memoryStore.auditLogs.unshift(entry);
    if (memoryStore.auditLogs.length > 500) memoryStore.auditLogs.pop();
  }
}

/**
 * Strips password hashes, secrets, encryption keys from audit objects
 */
function sanitizeAuditData(data: any): any {
  if (typeof data !== 'object' || data === null) return data;
  const sanitized: Record<string, any> = Array.isArray(data) ? [] : {};

  for (const [key, val] of Object.entries(data)) {
    const lower = key.toLowerCase();
    if (
      lower.includes('password') ||
      lower.includes('secret') ||
      lower.includes('key') ||
      lower.includes('token') ||
      lower.includes('otp')
    ) {
      sanitized[key] = '[REDACTED_FOR_SECURITY]';
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeAuditData(val);
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

/**
 * Retrieve Audit Logs with filtering and pagination
 */
export async function getAuditLogs(options: {
  adminEmail?: string;
  action?: string;
  resource?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ logs: AdminAuditLogDoc[]; total: number }> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const { adminEmail, action, resource, status, page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;

  if (db) {
    const query: Record<string, any> = {};
    if (adminEmail) query.adminEmail = { $regex: adminEmail, $options: 'i' };
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (status) query.status = status;

    const total = await db.collection('adminAuditLogs').countDocuments(query);
    const docs = await db
      .collection('adminAuditLogs')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const logs: AdminAuditLogDoc[] = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest } as any;
    });

    return { logs, total };
  }

  let filtered = [...memoryStore.auditLogs];
  if (adminEmail) filtered = filtered.filter((l) => l.adminEmail.toLowerCase().includes(adminEmail.toLowerCase()));
  if (action) filtered = filtered.filter((l) => l.action === action);
  if (resource) filtered = filtered.filter((l) => l.resource === resource);
  if (status) filtered = filtered.filter((l) => l.status === status);

  const total = filtered.length;
  const logs = filtered.slice(skip, skip + limit);
  return { logs, total };
}

/**
 * Retrieve Site Settings
 */
export async function getSiteSettings(): Promise<SiteSettingsDoc> {
  await ensureAdminInitialized();
  const db = await getMongoDb();

  if (db) {
    const doc = await db.collection('siteSettings').findOne({});
    if (doc) {
      const { _id, ...rest } = doc;
      return rest as SiteSettingsDoc;
    }
  }

  return (
    memoryStore.siteSettings || {
      brandName: 'NATURESTUDIOS',
      tagline: 'ESPORTS • CREATIVE • DIGITAL',
      companyName: 'NatureStudios Creative Agency',
      contactEmail: 'naturestudio05@gmail.com',
      supportEmail: 'naturestudio05@gmail.com',
      inquiriesEmail: 'naturestudio05@gmail.com',
      instagramUrl: 'https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
      maintenanceMode: false,
      registrationEnabled: true,
      googleLoginEnabled: true,
      emailVerificationRequired: false,
      portfolioCreationEnabled: true,
      portfolioPublishingEnabled: true,
      contactFormsEnabled: true,
      messagingEnabled: true,
      notificationsEnabled: true,
      analyticsEnabled: true,
      timezone: 'Asia/Kolkata',
      updatedAt: new Date().toISOString(),
    }
  );
}

/**
 * Update Site Settings
 */
export async function updateSiteSettings(updated: Partial<SiteSettingsDoc>): Promise<SiteSettingsDoc> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const now = new Date().toISOString();

  if (db) {
    await db.collection('siteSettings').updateOne({}, { $set: { ...updated, updatedAt: now } }, { upsert: true });
    return getSiteSettings();
  }

  memoryStore.siteSettings = {
    ...(memoryStore.siteSettings as SiteSettingsDoc),
    ...updated,
    updatedAt: now,
  };
  return memoryStore.siteSettings;
}

/**
 * Retrieve Active Site Theme
 */
export async function getActiveSiteTheme(): Promise<SiteThemeDoc> {
  await ensureAdminInitialized();
  const db = await getMongoDb();

  if (db) {
    const doc = await db.collection('siteThemeSettings').findOne({ status: 'PUBLISHED' });
    if (doc) {
      const { _id, ...rest } = doc;
      return rest as SiteThemeDoc;
    }
  }

  return (
    memoryStore.themes.find((t) => t.status === 'PUBLISHED') ||
    memoryStore.themes[0] || {
      version: 1,
      name: 'Default Burgundy',
      status: 'PUBLISHED',
      colors: {
        primary: '#59171B',
        secondary: '#FED7B8',
        background: '#150304',
        surface: '#240709',
        text: '#FFF5ED',
        mutedText: '#B89B8D',
        border: '#3D0D13',
        accent: '#FED7B8',
        success: '#18A957',
        warning: '#F59E0B',
        error: '#E63946',
        liveRed: '#E63946',
      },
      gradients: {
        primary: 'linear-gradient(135deg, #59171B 0%, #240709 100%)',
        secondary: 'linear-gradient(135deg, #FED7B8 0%, #FFF5ED 100%)',
        ambientMesh: 'radial-gradient(circle, rgba(89, 23, 27, 0.4) 0%, transparent 70%)',
      },
      typography: {
        displayFont: 'Syne, sans-serif',
        headingFont: 'Outfit, sans-serif',
        bodyFont: 'Inter, sans-serif',
        monoFont: 'JetBrains Mono, monospace',
        headingScale: '1.0',
        bodyScale: '1.0',
      },
      design: {
        borderRadius: '16px',
        spacingScale: '1.0',
        shadowIntensity: '0.8',
        blurIntensity: '12px',
        buttonStyle: 'rounded-xl',
        cardStyle: 'bordered',
        animationIntensity: 'CINEMATIC',
        grainIntensity: 0.15,
        particleIntensity: 0.25,
      },
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
}

/**
 * Save / Publish Site Theme
 */
export async function saveSiteTheme(
  themeData: Omit<SiteThemeDoc, '_id' | 'version' | 'createdAt' | 'updatedAt'>,
  action: 'DRAFT' | 'PUBLISH'
): Promise<SiteThemeDoc> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const now = new Date().toISOString();

  const active = await getActiveSiteTheme();
  const newVersion = (active.version || 1) + 1;

  const newDoc: SiteThemeDoc = {
    ...themeData,
    version: newVersion,
    status: action === 'PUBLISH' ? 'PUBLISHED' : 'DRAFT',
    publishedAt: action === 'PUBLISH' ? now : null,
    createdAt: now,
    updatedAt: now,
  };

  if (db) {
    if (action === 'PUBLISH') {
      // Archive current published themes
      await db.collection('siteThemeSettings').updateMany({ status: 'PUBLISHED' }, { $set: { status: 'ARCHIVED' } });
    }
    await db.collection('siteThemeSettings').insertOne(newDoc as any);
    return newDoc;
  }

  if (action === 'PUBLISH') {
    memoryStore.themes.forEach((t) => {
      if (t.status === 'PUBLISHED') t.status = 'ARCHIVED';
    });
  }
  memoryStore.themes.push(newDoc);
  return newDoc;
}

/**
 * Rollback Site Theme to a previous version
 */
export async function rollbackSiteTheme(targetVersion: number): Promise<boolean> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const now = new Date().toISOString();

  if (db) {
    const target = await db.collection('siteThemeSettings').findOne({ version: targetVersion });
    if (!target) return false;

    await db.collection('siteThemeSettings').updateMany({ status: 'PUBLISHED' }, { $set: { status: 'ARCHIVED' } });
    await db.collection('siteThemeSettings').updateOne(
      { version: targetVersion },
      { $set: { status: 'PUBLISHED', publishedAt: now, updatedAt: now } }
    );
    return true;
  }

  const target = memoryStore.themes.find((t) => t.version === targetVersion);
  if (!target) return false;

  memoryStore.themes.forEach((t) => {
    if (t.status === 'PUBLISHED') t.status = 'ARCHIVED';
  });
  target.status = 'PUBLISHED';
  target.publishedAt = now;
  return true;
}

/**
 * Record a high-priority security event
 */
export async function logSecurityEvent(
  type: string,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  details?: Record<string, any>,
  userId?: string,
  email?: string,
  ip?: string,
  userAgent?: string
): Promise<void> {
  const db = await getMongoDb();
  const event: SecurityEventDoc = {
    type,
    severity,
    details,
    userId,
    email,
    ip,
    userAgent,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection('securityEvents').insertOne(event as any);
  } else {
    memoryStore.securityEvents.unshift(event);
    if (memoryStore.securityEvents.length > 500) memoryStore.securityEvents.pop();
  }
}

/**
 * Redirect Management
 */
export async function getRedirects(): Promise<RedirectDoc[]> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  if (db) {
    const docs = await db.collection('redirects').find({}).sort({ createdAt: -1 }).toArray();
    return docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest } as any;
    });
  }
  return [...memoryStore.redirects];
}

export async function createRedirect(redirect: {
  source: string;
  destination: string;
  statusCode: 301 | 302;
  enabled: boolean;
}): Promise<RedirectDoc> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  const newDoc: RedirectDoc = {
    ...redirect,
    hits: 0,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    const res = await db.collection('redirects').insertOne(newDoc as any);
    return { ...newDoc, _id: res.insertedId };
  }

  memoryStore.redirects.unshift(newDoc);
  return newDoc;
}

export async function updateRedirect(
  id: string,
  updated: Partial<Omit<RedirectDoc, '_id' | 'createdAt' | 'hits'>>
): Promise<boolean> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  if (db) {
    try {
      const res = await db.collection('redirects').updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      return res.matchedCount > 0;
    } catch {
      return false;
    }
  }
  const idx = memoryStore.redirects.findIndex((r) => (r as any).id === id || (r as any)._id?.toString() === id);
  if (idx !== -1) {
    memoryStore.redirects[idx] = { ...memoryStore.redirects[idx], ...updated };
    return true;
  }
  return false;
}

export async function deleteRedirect(id: string): Promise<boolean> {
  await ensureAdminInitialized();
  const db = await getMongoDb();
  if (db) {
    try {
      const res = await db.collection('redirects').deleteOne({ _id: new ObjectId(id) });
      return res.deletedCount > 0;
    } catch {
      return false;
    }
  }
  const idx = memoryStore.redirects.findIndex((r) => (r as any).id === id || (r as any)._id?.toString() === id);
  if (idx !== -1) {
    memoryStore.redirects.splice(idx, 1);
    return true;
  }
  return false;
}

/**
 * MongoDB Atlas Safe Stats without exposing raw credentials or arbitrary query execution
 */
export async function getDatabaseMetrics(): Promise<{
  connected: boolean;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  collections: { name: string; count: number }[];
  totalCollections: number;
  databaseName: string;
}> {
  const db = await getMongoDb();
  if (!db) {
    return {
      connected: false,
      status: 'OPERATIONAL', // Local memory mode
      latencyMs: 1,
      collections: [
        { name: 'users', count: 4 },
        { name: 'portfolios', count: 2 },
        { name: 'adminRoles', count: 9 },
        { name: 'adminAuditLogs', count: memoryStore.auditLogs.length },
        { name: 'siteContent', count: 5 },
        { name: 'siteThemeSettings', count: 1 },
      ],
      totalCollections: 6,
      databaseName: 'naturestudios_dev',
    };
  }

  const start = Date.now();
  await db.command({ ping: 1 });
  const latencyMs = Date.now() - start;

  const collectionNames = [
    'users',
    'portfolios',
    'projects',
    'projectRequests',
    'adminRoles',
    'adminRoleAssignments',
    'adminPermissionOverrides',
    'adminAuditLogs',
    'siteSettings',
    'siteThemeSettings',
    'siteContent',
    'mediaAssets',
    'emailTemplates',
    'emailLogs',
    'redirects',
    'featureFlags',
    'announcements',
    'supportTickets',
    'portfolioReports',
    'securityEvents',
    'analyticsEvents',
  ];

  const collectionsWithCount = await Promise.all(
    collectionNames.map(async (name) => {
      try {
        const count = await db.collection(name).countDocuments();
        return { name, count };
      } catch {
        return { name, count: 0 };
      }
    })
  );

  return {
    connected: true,
    status: latencyMs < 300 ? 'OPERATIONAL' : 'DEGRADED',
    latencyMs,
    collections: collectionsWithCount.filter((c) => c.count > 0 || c.name === 'users' || c.name === 'portfolios'),
    totalCollections: collectionsWithCount.length,
    databaseName: db.databaseName,
  };
}

/**
 * Global Admin Command Palette Search (Ctrl+K)
 */
export async function searchAdminEntities(query: string): Promise<{
  users: Array<{ id: string; title: string; subtitle: string; url: string }>;
  portfolios: Array<{ id: string; title: string; subtitle: string; url: string }>;
  projects: Array<{ id: string; title: string; subtitle: string; url: string }>;
  auditLogs: Array<{ id: string; title: string; subtitle: string; url: string }>;
  content: Array<{ id: string; title: string; subtitle: string; url: string }>;
}> {
  if (!query || query.trim().length === 0) {
    return { users: [], portfolios: [], projects: [], auditLogs: [], content: [] };
  }

  const q = query.trim().toLowerCase();
  const db = await getMongoDb();

  const results = {
    users: [] as any[],
    portfolios: [] as any[],
    projects: [] as any[],
    auditLogs: [] as any[],
    content: [] as any[],
  };

  if (db) {
    // Search users
    const userDocs = await db.collection('users')
      .find({ $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] })
      .limit(5)
      .toArray();
    results.users = userDocs.map((u: any) => ({
      id: u._id.toString(),
      title: u.name || 'Anonymous User',
      subtitle: u.email,
      url: `/admin/users/${u._id.toString()}`,
    }));

    // Search portfolios
    const portDocs = await db.collection('portfolios')
      .find({ $or: [{ username: { $regex: q, $options: 'i' } }, { title: { $regex: q, $options: 'i' } }] })
      .limit(5)
      .toArray();
    results.portfolios = portDocs.map((p: any) => ({
      id: p._id.toString(),
      title: p.title || `@${p.username}`,
      subtitle: `${p.username}.naturestudio.in`,
      url: `/admin/portfolios`,
    }));

    // Search content
    const contentDocs = await db.collection('siteContent')
      .find({ $or: [{ title: { $regex: q, $options: 'i' } }, { slug: { $regex: q, $options: 'i' } }] })
      .limit(5)
      .toArray();
    results.content = contentDocs.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      subtitle: `Slug: /${c.slug}`,
      url: `/admin/content`,
    }));

    // Search audit logs
    const auditDocs = await db.collection('adminAuditLogs')
      .find({ $or: [{ action: { $regex: q, $options: 'i' } }, { resource: { $regex: q, $options: 'i' } }, { adminEmail: { $regex: q, $options: 'i' } }] })
      .limit(5)
      .toArray();
    results.auditLogs = auditDocs.map((a: any) => ({
      id: a._id.toString(),
      title: `${a.action} on ${a.resource}`,
      subtitle: `By ${a.adminEmail} • ${new Date(a.createdAt).toLocaleDateString()}`,
      url: `/admin/audit-logs`,
    }));
  } else {
    // Memory store fallback search
    results.users = [
      { id: 'usr-1', title: 'Admin User', subtitle: 'admin@naturestudio.in', url: '/admin/users' },
      { id: 'usr-2', title: 'Test Creator', subtitle: 'test@naturestudio.in', url: '/admin/users' },
    ].filter((u) => u.title.toLowerCase().includes(q) || u.subtitle.toLowerCase().includes(q));

    results.portfolios = [
      { id: 'port-1', title: 'Aether Studios', subtitle: 'aether.naturestudio.in', url: '/admin/portfolios' },
      { id: 'port-2', title: 'Vortex VFX', subtitle: 'vortex.naturestudio.in', url: '/admin/portfolios' },
    ].filter((p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));

    results.content = [
      { id: 'c-1', title: 'Homepage Hero & Narrative', subtitle: 'Slug: /homepage', url: '/admin/content' },
      { id: 'c-2', title: 'Services & Capabilities', subtitle: 'Slug: /services', url: '/admin/content' },
    ].filter((c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q));

    results.auditLogs = memoryStore.auditLogs
      .filter((a) => a.action.toLowerCase().includes(q) || a.resource.toLowerCase().includes(q))
      .slice(0, 5)
      .map((a) => ({
        id: (a as any).id || 'log',
        title: `${a.action} on ${a.resource}`,
        subtitle: `By ${a.adminEmail}`,
        url: '/admin/audit-logs',
      }));
  }

  return results;
}
