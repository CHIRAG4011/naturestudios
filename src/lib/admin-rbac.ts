/**
 * NATURESTUDIOS — RBAC & 50+ GRANULAR PERMISSIONS ENGINE
 *
 * Implements strict role-based access control with explicit ALLOW / DENY
 * precedence model, break-glass protections, and super-admin safety.
 */

export type PermissionCategory =
  | 'users'
  | 'roles'
  | 'permissions'
  | 'projects'
  | 'requests'
  | 'messages'
  | 'notifications'
  | 'portfolios'
  | 'portfolio_reports'
  | 'content'
  | 'pages'
  | 'navigation'
  | 'media'
  | 'theme'
  | 'design'
  | 'email'
  | 'domains'
  | 'subdomains'
  | 'seo'
  | 'analytics'
  | 'audit'
  | 'security'
  | 'sessions'
  | 'system'
  | 'database'
  | 'backups'
  | 'integrations'
  | 'api'
  | 'feature_flags'
  | 'announcements'
  | 'maintenance'
  | 'settings'
  | 'logs'
  | 'support';

export interface PermissionDefinition {
  key: string;
  name: string;
  description: string;
  category: PermissionCategory;
  dangerous?: boolean;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // 1. Users
  { key: 'users.view', name: 'View Users', description: 'View user accounts, profiles, and directory', category: 'users' },
  { key: 'users.create', name: 'Create Users', description: 'Create new user accounts directly', category: 'users' },
  { key: 'users.edit', name: 'Edit Users', description: 'Modify user profile data and basic account info', category: 'users' },
  { key: 'users.delete', name: 'Delete Users', description: 'Permanently remove user accounts and related records', category: 'users', dangerous: true },
  { key: 'users.suspend', name: 'Suspend Users', description: 'Suspend user accounts and prevent platform login', category: 'users', dangerous: true },
  { key: 'users.unsuspend', name: 'Unsuspend Users', description: 'Restore suspended user accounts to active status', category: 'users' },
  { key: 'users.verify', name: 'Verify Email', description: 'Manually verify user email addresses', category: 'users' },
  { key: 'users.force_logout', name: 'Force Logout', description: 'Revoke user sessions and force logout', category: 'users', dangerous: true },
  { key: 'users.change_role', name: 'Change Roles', description: 'Assign or remove roles for user accounts', category: 'users', dangerous: true },

  // 2. Roles
  { key: 'roles.view', name: 'View Roles', description: 'Inspect available roles and their permission assignments', category: 'roles' },
  { key: 'roles.create', name: 'Create Roles', description: 'Define new custom roles and initial permissions', category: 'roles' },
  { key: 'roles.edit', name: 'Edit Roles', description: 'Modify role names, descriptions, and assigned permissions', category: 'roles' },
  { key: 'roles.delete', name: 'Delete Roles', description: 'Delete non-system roles that have zero active users', category: 'roles', dangerous: true },
  { key: 'roles.assign', name: 'Assign Roles', description: 'Assign existing roles to users', category: 'roles', dangerous: true },

  // 3. Permissions
  { key: 'permissions.view', name: 'View Permissions', description: 'View the complete permission directory and matrix', category: 'permissions' },
  { key: 'permissions.assign', name: 'Assign Permissions', description: 'Set explicit user-level permission overrides', category: 'permissions', dangerous: true },

  // 4. Projects
  { key: 'projects.view', name: 'View Projects', description: 'View all studio creative projects', category: 'projects' },
  { key: 'projects.create', name: 'Create Projects', description: 'Create and publish new studio projects', category: 'projects' },
  { key: 'projects.edit', name: 'Edit Projects', description: 'Update project titles, media, credits, and narratives', category: 'projects' },
  { key: 'projects.delete', name: 'Delete Projects', description: 'Delete studio projects and associated media', category: 'projects', dangerous: true },
  { key: 'projects.publish', name: 'Publish Projects', description: 'Toggle project public visibility on naturestudio.in', category: 'projects' },
  { key: 'projects.archive', name: 'Archive Projects', description: 'Archive legacy studio projects', category: 'projects' },

  // 5. Requests
  { key: 'requests.view', name: 'View Requests', description: 'Review incoming client project requests and briefs', category: 'requests' },
  { key: 'requests.create', name: 'Create Requests', description: 'Manually create project inquiries on behalf of clients', category: 'requests' },
  { key: 'requests.edit', name: 'Edit Requests', description: 'Modify project inquiry details, budgets, and milestones', category: 'requests' },
  { key: 'requests.delete', name: 'Delete Requests', description: 'Remove project request records', category: 'requests', dangerous: true },
  { key: 'requests.assign', name: 'Assign Requests', description: 'Assign project requests to creative directors or staff', category: 'requests' },
  { key: 'requests.change_status', name: 'Change Status', description: 'Progress requests from Received to Production or Completed', category: 'requests' },

  // 6. Messages
  { key: 'messages.view', name: 'View Messages', description: 'Read project correspondence and client chats', category: 'messages' },
  { key: 'messages.send', name: 'Send Messages', description: 'Send direct messages and updates to clients', category: 'messages' },
  { key: 'messages.delete', name: 'Delete Messages', description: 'Remove individual message transmissions', category: 'messages', dangerous: true },
  { key: 'messages.moderate', name: 'Moderate Messages', description: 'Flag or redact inappropriate communication', category: 'messages' },

  // 7. Notifications
  { key: 'notifications.view', name: 'View Notifications', description: 'Inspect notification dispatch logs and recipient counts', category: 'notifications' },
  { key: 'notifications.create', name: 'Create Notifications', description: 'Draft individual, group, or platform notices', category: 'notifications' },
  { key: 'notifications.send', name: 'Send Notifications', description: 'Broadcast in-app and email notifications to users', category: 'notifications' },
  { key: 'notifications.delete', name: 'Delete Notifications', description: 'Revoke or delete published notifications', category: 'notifications' },

  // 8. Portfolios
  { key: 'portfolios.view', name: 'View Portfolios', description: 'Review all creator portfolios, drafts, and published subdomains', category: 'portfolios' },
  { key: 'portfolios.create', name: 'Create Portfolios', description: 'Provision portfolio spaces for users', category: 'portfolios' },
  { key: 'portfolios.edit', name: 'Edit Portfolios', description: 'Edit portfolio content when authorized by moderation', category: 'portfolios' },
  { key: 'portfolios.delete', name: 'Delete Portfolios', description: 'Permanently remove a creator portfolio and subdomain', category: 'portfolios', dangerous: true },
  { key: 'portfolios.publish', name: 'Publish Portfolios', description: 'Approve and publish portfolios to live subdomains', category: 'portfolios' },
  { key: 'portfolios.unpublish', name: 'Unpublish Portfolios', description: 'Revoke public subdomain resolution for a portfolio', category: 'portfolios', dangerous: true },
  { key: 'portfolios.moderate', name: 'Moderate Portfolios', description: 'Review creator content for brand safety and legal compliance', category: 'portfolios' },

  // 9. Portfolio Reports
  { key: 'portfolio_reports.view', name: 'View Reports', description: 'Review user-submitted abuse or copyright reports against portfolios', category: 'portfolio_reports' },
  { key: 'portfolio_reports.resolve', name: 'Resolve Reports', description: 'Take action on portfolio violation reports and close tickets', category: 'portfolio_reports' },

  // 10. Content (CMS)
  { key: 'content.view', name: 'View Content', description: 'Review site copy, headlines, and draft CMS pages', category: 'content' },
  { key: 'content.create', name: 'Create Content', description: 'Add new content sections, testimonial blocks, or stats', category: 'content' },
  { key: 'content.edit', name: 'Edit Content', description: 'Modify homepage, about, studio, services, and footer copy', category: 'content' },
  { key: 'content.delete', name: 'Delete Content', description: 'Remove CMS content entries', category: 'content', dangerous: true },
  { key: 'content.publish', name: 'Publish Content', description: 'Promote draft copy to production naturestudio.in', category: 'content' },

  // 11. Pages
  { key: 'pages.view', name: 'View Pages', description: 'View registered website pages and section hierarchies', category: 'pages' },
  { key: 'pages.create', name: 'Create Pages', description: 'Build and register new static or dynamic content pages', category: 'pages' },
  { key: 'pages.edit', name: 'Edit Pages', description: 'Reorder sections and update page architecture', category: 'pages' },
  { key: 'pages.delete', name: 'Delete Pages', description: 'Deactivate website pages', category: 'pages', dangerous: true },
  { key: 'pages.publish', name: 'Publish Pages', description: 'Publish page updates live', category: 'pages' },

  // 12. Navigation
  { key: 'navigation.view', name: 'View Navigation', description: 'Review header and footer navigation links and menus', category: 'navigation' },
  { key: 'navigation.edit', name: 'Edit Navigation', description: 'Reorder, rename, or link header items and mobile menus', category: 'navigation' },

  // 13. Media
  { key: 'media.view', name: 'View Media', description: 'Access the media asset library, dimensions, and usage', category: 'media' },
  { key: 'media.upload', name: 'Upload Media', description: 'Upload verified imagery, video loops, and graphic plates', category: 'media' },
  { key: 'media.edit', name: 'Edit Media', description: 'Update image alt tags, focal points, and filenames', category: 'media' },
  { key: 'media.delete', name: 'Delete Media', description: 'Delete unused media assets from cloud storage', category: 'media', dangerous: true },

  // 14. Theme
  { key: 'theme.view', name: 'View Theme', description: 'Inspect site colors, gradients, typography, and CSS tokens', category: 'theme' },
  { key: 'theme.edit', name: 'Edit Theme', description: 'Adjust primary burgundy, warm beige, accents, and gradients', category: 'theme' },
  { key: 'theme.publish', name: 'Publish Theme', description: 'Promote theme draft tokens to live production', category: 'theme', dangerous: true },

  // 15. Design
  { key: 'design.view', name: 'View Design', description: 'View spacing scales, border radiuses, and shadow profiles', category: 'design' },
  { key: 'design.edit', name: 'Edit Design', description: 'Modify global component spacing, button styles, and corner rads', category: 'design' },

  // 16. Email
  { key: 'email.view', name: 'View Email', description: 'View Resend mailboxes, delivery statuses, and routing config', category: 'email' },
  { key: 'email.send', name: 'Send Email', description: 'Trigger transactional or announcement emails', category: 'email' },
  { key: 'email.templates.edit', name: 'Edit Email Templates', description: 'Edit HTML/Text email templates and dynamic tags', category: 'email' },
  { key: 'email.logs.view', name: 'View Email Logs', description: 'Inspect delivery receipts, bounces, and timestamps', category: 'email' },
  { key: 'email.settings.edit', name: 'Edit Email Settings', description: 'Configure sender addresses and multi-mailbox routing', category: 'email', dangerous: true },

  // 17. Domains & Subdomains
  { key: 'domains.view', name: 'View Domains', description: 'Check root domain, www, wildcard, and SSL certificate health', category: 'domains' },
  { key: 'domains.create', name: 'Add Domains', description: 'Bind custom domains to portfolios or studio mirrors', category: 'domains' },
  { key: 'domains.edit', name: 'Edit Domains', description: 'Update DNS verification records and routing flags', category: 'domains' },
  { key: 'domains.delete', name: 'Delete Domains', description: 'Unbind domain routing rules', category: 'domains', dangerous: true },
  { key: 'subdomains.view', name: 'View Subdomains', description: 'List all reserved and claimed *.naturestudio.in subdomains', category: 'subdomains' },
  { key: 'subdomains.manage', name: 'Manage Subdomains', description: 'Reserve, release, or disable subdomains', category: 'subdomains', dangerous: true },

  // 18. SEO
  { key: 'seo.view', name: 'View SEO', description: 'Review site meta tags, OpenGraph previews, and sitemap settings', category: 'seo' },
  { key: 'seo.edit', name: 'Edit SEO', description: 'Update page titles, descriptions, canonicals, and robots.txt', category: 'seo' },

  // 19. Analytics & Audit
  { key: 'analytics.view', name: 'View Analytics', description: 'Access aggregate page views, registrations, and conversions', category: 'analytics' },
  { key: 'analytics.export', name: 'Export Analytics', description: 'Download CSV reports of aggregate platform events', category: 'analytics' },
  { key: 'audit.view', name: 'View Audit Logs', description: 'Review chronological admin actions, timestamps, and actor IDs', category: 'audit' },
  { key: 'audit.export', name: 'Export Audit Logs', description: 'Export tamper-evident security audit logs', category: 'audit' },

  // 20. Security & Sessions
  { key: 'security.view', name: 'View Security', description: 'Inspect failed login attempts, rate limits, and security alerts', category: 'security' },
  { key: 'security.manage', name: 'Manage Security', description: 'Adjust rate limit thresholds and lockout policies', category: 'security', dangerous: true },
  { key: 'sessions.view', name: 'View Sessions', description: 'Inspect active admin and user sessions with user-agent data', category: 'sessions' },
  { key: 'sessions.revoke', name: 'Revoke Sessions', description: 'Terminate active session tokens across devices', category: 'sessions', dangerous: true },

  // 21. System, Database & Backups
  { key: 'system.view', name: 'View System', description: 'Review real-time health for Atlas, Resend, OAuth, and API', category: 'system' },
  { key: 'system.manage', name: 'Manage System', description: 'Trigger maintenance mode or system diagnostic routines', category: 'system', dangerous: true },
  { key: 'database.view', name: 'View Database', description: 'Inspect MongoDB connection latency, collection stats, and indexes', category: 'database' },
  { key: 'database.manage', name: 'Manage Database', description: 'Re-index collections or optimize storage', category: 'database', dangerous: true },
  { key: 'backups.view', name: 'View Backups', description: 'Verify automated Atlas backup schedules and recovery points', category: 'backups' },
  { key: 'backups.create', name: 'Create Backups', description: 'Trigger point-in-time snapshot backup', category: 'backups', dangerous: true },
  { key: 'backups.restore', name: 'Restore Backups', description: 'Initiate snapshot restoration flow', category: 'backups', dangerous: true },

  // 22. Integrations & API
  { key: 'integrations.view', name: 'View Integrations', description: 'Check Resend, Google Cloud, and MongoDB connectivity', category: 'integrations' },
  { key: 'integrations.manage', name: 'Manage Integrations', description: 'Update external provider configs without exposing secrets', category: 'integrations', dangerous: true },
  { key: 'api.view', name: 'View API', description: 'Inspect REST API route specifications, methods, and rate tiers', category: 'api' },
  { key: 'api.manage', name: 'Manage API', description: 'Rotate server tokens or modify API route authorization flags', category: 'api', dangerous: true },

  // 23. Feature Flags & Announcements
  { key: 'feature_flags.view', name: 'View Feature Flags', description: 'Review experimental feature toggles and rollouts', category: 'feature_flags' },
  { key: 'feature_flags.manage', name: 'Manage Feature Flags', description: 'Toggle feature flags across platform modules', category: 'feature_flags', dangerous: true },
  { key: 'announcements.view', name: 'View Announcements', description: 'Review active site banner notices', category: 'announcements' },
  { key: 'announcements.create', name: 'Create Announcements', description: 'Draft announcement banners with severity levels', category: 'announcements' },
  { key: 'announcements.edit', name: 'Edit Announcements', description: 'Modify banner text, links, and target audiences', category: 'announcements' },
  { key: 'announcements.delete', name: 'Delete Announcements', description: 'Dismiss or delete banner notices', category: 'announcements' },
  { key: 'announcements.publish', name: 'Publish Announcements', description: 'Display banner notices on the live website', category: 'announcements' },

  // 24. Maintenance, Settings, Logs & Support
  { key: 'maintenance.view', name: 'View Maintenance', description: 'Inspect maintenance status and scheduled downtime windows', category: 'maintenance' },
  { key: 'maintenance.manage', name: 'Manage Maintenance', description: 'Toggle global site maintenance mode with admin bypass', category: 'maintenance', dangerous: true },
  { key: 'settings.view', name: 'View Settings', description: 'Inspect general platform settings and company parameters', category: 'settings' },
  { key: 'settings.edit', name: 'Edit Settings', description: 'Modify platform brand name, registration flags, and timezone', category: 'settings', dangerous: true },
  { key: 'logs.view', name: 'View Logs', description: 'Read application, auth, and email delivery event logs', category: 'logs' },
  { key: 'logs.export', name: 'Export Logs', description: 'Export log files for compliance and diagnostics', category: 'logs' },
  { key: 'support.view', name: 'View Support', description: 'Read incoming creator support requests', category: 'support' },
  { key: 'support.manage', name: 'Manage Support', description: 'Assign tickets, add internal notes, and resolve issues', category: 'support' },
];

/**
 * Machine-readable index of all permission keys
 */
export const PERMISSION_KEYS = new Set(ALL_PERMISSIONS.map((p) => p.key));

/**
 * Standard System Roles & Pre-Seeded Permissions
 */
export interface SystemRoleDefinition {
  slug: string;
  name: string;
  description: string;
  permissions: string[];
  systemRole: boolean;
}

export const SYSTEM_ROLES: SystemRoleDefinition[] = [
  {
    slug: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Highest-tier platform executive with unrestricted access and break-glass capabilities.',
    permissions: Array.from(PERMISSION_KEYS),
    systemRole: true,
  },
  {
    slug: 'ADMIN',
    name: 'Administrator',
    description: 'Full administrative access to manage users, content, portfolios, and studio operations.',
    permissions: Array.from(PERMISSION_KEYS).filter(
      (k) => !['database.manage', 'backups.restore', 'system.manage'].includes(k)
    ),
    systemRole: true,
  },
  {
    slug: 'CONTENT_ADMIN',
    name: 'Content Administrator',
    description: 'Manages website copy, pages, visual themes, media library, and announcements.',
    permissions: [
      'content.view', 'content.create', 'content.edit', 'content.publish',
      'pages.view', 'pages.create', 'pages.edit', 'pages.publish',
      'navigation.view', 'navigation.edit',
      'media.view', 'media.upload', 'media.edit', 'media.delete',
      'theme.view', 'theme.edit', 'theme.publish',
      'design.view', 'design.edit',
      'seo.view', 'seo.edit',
      'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.publish',
      'analytics.view',
    ],
    systemRole: true,
  },
  {
    slug: 'USER_ADMIN',
    name: 'User Administrator',
    description: 'Handles user directory, account verification, role assignments, and session controls.',
    permissions: [
      'users.view', 'users.create', 'users.edit', 'users.suspend', 'users.unsuspend',
      'users.verify', 'users.force_logout', 'users.change_role',
      'roles.view', 'roles.assign',
      'permissions.view',
      'sessions.view', 'sessions.revoke',
      'security.view',
      'audit.view',
      'notifications.create', 'notifications.send',
    ],
    systemRole: true,
  },
  {
    slug: 'PROJECT_MANAGER',
    name: 'Project Manager',
    description: 'Supervises studio project deliverables, incoming client briefs, and client messages.',
    permissions: [
      'projects.view', 'projects.create', 'projects.edit', 'projects.publish', 'projects.archive',
      'requests.view', 'requests.edit', 'requests.assign', 'requests.change_status',
      'messages.view', 'messages.send',
      'notifications.view', 'notifications.send',
      'media.view', 'media.upload',
      'users.view',
    ],
    systemRole: true,
  },
  {
    slug: 'SUPPORT',
    name: 'Support Specialist',
    description: 'Assists platform creators, handles tickets, and communicates with clients.',
    permissions: [
      'support.view', 'support.manage',
      'users.view',
      'portfolios.view',
      'portfolio_reports.view',
      'messages.view', 'messages.send',
      'notifications.send',
    ],
    systemRole: true,
  },
  {
    slug: 'ANALYTICS',
    name: 'Analytics Specialist',
    description: 'Monitors site traffic, conversion funnels, email delivery metrics, and audit feeds.',
    permissions: [
      'analytics.view', 'analytics.export',
      'audit.view',
      'email.logs.view',
      'system.view',
      'logs.view',
      'projects.view',
      'portfolios.view',
    ],
    systemRole: true,
  },
  {
    slug: 'EDITOR',
    name: 'Editorial Specialist',
    description: 'Drafts and proofreads studio case studies, creative articles, and portfolio spotlights.',
    permissions: [
      'content.view', 'content.edit',
      'pages.view', 'pages.edit',
      'media.view', 'media.upload',
      'projects.view', 'projects.edit',
      'seo.view',
    ],
    systemRole: true,
  },
  {
    slug: 'MODERATOR',
    name: 'Content Moderator',
    description: 'Investigates flagged portfolios, resolves copyright reports, and moderates client chats.',
    permissions: [
      'portfolios.view', 'portfolios.moderate', 'portfolios.unpublish',
      'portfolio_reports.view', 'portfolio_reports.resolve',
      'messages.view', 'messages.moderate',
      'users.view',
    ],
    systemRole: true,
  },
];

/**
 * Permission Override Model
 */
export interface PermissionOverride {
  permissionKey: string;
  effect: 'ALLOW' | 'DENY';
  reason?: string;
  expiresAt?: string | null;
}

/**
 * Evaluates whether a user is authorized for a specific permission key.
 *
 * Precedence Model:
 * 1. Super Admin Break-Glass: If user has SUPER_ADMIN role and breakGlass is active, ALLOW.
 * 2. Explicit User DENY: If an active DENY override matches, REJECT (DENY always wins).
 * 3. Explicit User ALLOW: If an active ALLOW override matches, ALLOW.
 * 4. Inherited Role Permissions: If any assigned role includes the key, ALLOW.
 * 5. Default Fallback: DENY.
 */
export function evaluateUserPermission(
  roles: string[],
  overrides: PermissionOverride[] = [],
  requiredPermission: string,
  isBreakGlass = false
): { authorized: boolean; reason: string } {
  // 1. Super Admin Break-Glass
  if (roles.includes('SUPER_ADMIN')) {
    // Check if there is an explicit DENY on Super Admin for that specific permission
    const denyOverride = overrides.find(
      (o) => o.permissionKey === requiredPermission && o.effect === 'DENY'
    );
    if (denyOverride && !isBreakGlass) {
      return { authorized: false, reason: `Explicit DENY override applied (${denyOverride.reason || 'Restricted'})` };
    }
    return { authorized: true, reason: 'SUPER_ADMIN role grant' };
  }

  // 2. Explicit User DENY (takes priority over role grants)
  const explicitDeny = overrides.find((o) => {
    if (o.permissionKey !== requiredPermission || o.effect !== 'DENY') return false;
    if (o.expiresAt && new Date(o.expiresAt) < new Date()) return false;
    return true;
  });

  if (explicitDeny) {
    return { authorized: false, reason: `Explicit DENY override: ${explicitDeny.reason || 'Restricted'}` };
  }

  // 3. Explicit User ALLOW
  const explicitAllow = overrides.find((o) => {
    if (o.permissionKey !== requiredPermission || o.effect !== 'ALLOW') return false;
    if (o.expiresAt && new Date(o.expiresAt) < new Date()) return false;
    return true;
  });

  if (explicitAllow) {
    return { authorized: true, reason: `Explicit ALLOW override: ${explicitAllow.reason || 'Granted'}` };
  }

  // 4. Role Evaluation
  for (const roleSlug of roles) {
    const roleDef = SYSTEM_ROLES.find((r) => r.slug === roleSlug);
    if (roleDef && roleDef.permissions.includes(requiredPermission)) {
      return { authorized: true, reason: `Inherited via role ${roleDef.name}` };
    }
  }

  // 5. Default Deny
  return { authorized: false, reason: 'Missing required permission' };
}

/**
 * Computes the full effective permission map for a user (combining roles and overrides).
 */
export function computeEffectivePermissions(
  roles: string[],
  overrides: PermissionOverride[] = []
): Record<string, boolean> {
  const effective: Record<string, boolean> = {};

  for (const perm of ALL_PERMISSIONS) {
    const res = evaluateUserPermission(roles, overrides, perm.key);
    effective[perm.key] = res.authorized;
  }

  return effective;
}
