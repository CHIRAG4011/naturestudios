# NATURESTUDIOS — ADMINISTRATIVE CONTROL CENTER (ADMIN.MD)

## 1. Overview
The NatureStudios Admin Control Center is a separate, high-security operational tier embedded inside the NatureStudios platform. It provides role-based access control (RBAC) across 50+ granular permissions, content management (CMS), real-time cluster telemetry, dynamic CSS theme customization, creator portfolio moderation, and immutable audit logging.

Protected entrypoint:
```
https://naturestudio.in/admin
```
Unauthorized visitors (non-staff or ordinary creators) receive `403 — ADMIN ACCESS REQUIRED` with zero internal state disclosure.

---

## 2. RBAC & 50+ Granular Permissions

### Built-in System Roles
1. **SUPER_ADMIN**: Absolute system clearance (`*`), break-glass root authorization, protected from casual deletion or accidental lockout.
2. **ADMIN**: Full operational leadership over studio projects, portfolios, themes, and staff management.
3. **CONTENT_ADMIN**: CMS publishing authority for homepage hero, about, services, studio narratives, and public copy.
4. **USER_ADMIN**: Account lifecycle management, user verification, suspension/unsuspension, and role assignment.
5. **PROJECT_MANAGER**: Pipeline control over incoming client inquiries, budget quotes, and production status.
6. **SUPPORT**: Creator ticket queue management, portfolio troubleshooting, and internal notes.
7. **ANALYTICS**: Export and telemetry analysis of site visitors, funnel conversions, and platform growth.
8. **EDITOR**: Public site draft editing, portfolio proofing, and asset tag management.
9. **MODERATOR**: Content moderation, abuse report review, and portfolio unpublishing.

### Granular Permission Keys (50+)
- **Users**: `users.view`, `users.create`, `users.edit`, `users.delete`, `users.suspend`, `users.unsuspend`, `users.verify`, `users.force_logout`, `users.change_role`
- **Roles & Permissions**: `roles.view`, `roles.create`, `roles.edit`, `roles.delete`, `roles.assign`, `permissions.view`, `permissions.assign`
- **Projects & Requests**: `projects.view`, `projects.create`, `projects.edit`, `projects.delete`, `projects.publish`, `projects.archive`, `requests.view`, `requests.create`, `requests.edit`, `requests.delete`, `requests.assign`, `requests.change_status`
- **Portfolios & Moderation**: `portfolios.view`, `portfolios.create`, `portfolios.edit`, `portfolios.delete`, `portfolios.publish`, `portfolios.unpublish`, `portfolios.moderate`, `portfolio_reports.view`, `portfolio_reports.resolve`
- **CMS & Content**: `content.view`, `content.create`, `content.edit`, `content.delete`, `content.publish`, `pages.view`, `pages.create`, `pages.edit`, `pages.delete`, `pages.publish`, `navigation.view`, `navigation.edit`
- **Themes & Design**: `theme.view`, `theme.edit`, `theme.publish`, `design.view`, `design.edit`
- **Media**: `media.view`, `media.upload`, `media.edit`, `media.delete`
- **Email Infrastructure**: `email.view`, `email.send`, `email.templates.edit`, `email.logs.view`, `email.settings.edit`
- **Domains**: `domains.view`, `domains.create`, `domains.edit`, `domains.delete`, `subdomains.view`, `subdomains.manage`
- **Security & Sessions**: `security.view`, `security.manage`, `sessions.view`, `sessions.revoke`, `audit.view`, `audit.export`
- **System & Infrastructure**: `system.view`, `system.manage`, `database.view`, `database.manage`, `backups.view`, `backups.create`, `backups.restore`, `integrations.view`, `integrations.manage`, `api.view`, `api.manage`, `feature_flags.view`, `feature_flags.manage`, `announcements.view`, `announcements.create`, `announcements.edit`, `announcements.delete`, `announcements.publish`, `maintenance.view`, `maintenance.manage`, `settings.view`, `settings.edit`, `logs.view`, `logs.export`, `support.view`, `support.manage`, `seo.view`, `seo.edit`, `analytics.view`, `analytics.export`

### Permission Evaluation Precedence
Every request is evaluated with deterministic precedence:
```
1. SUPER_ADMIN check (unrestricted wildcard clearance)
2. Explicit User-Specific DENY override (Strictly overrides inherited role permissions)
3. Explicit User-Specific ALLOW override
4. Aggregated Role Permissions (Set union across all active assigned roles)
5. Default DENY (Zero trust)
```

---

## 3. Administrative Routes
- `/admin` & `/admin/overview`: Mission Control overview with live cluster latency, KPI cards, and recent audit activity.
- `/admin/analytics`: Real-time telemetry, filterable by `today`, `7d`, `30d`, `90d`, `12m` with conversion funnels. Displays "No data available yet" when metrics have not accumulated.
- `/admin/users`: Searchable directory with role filters, status filters, account suspension, force logout, and break-glass user deletion.
- `/admin/users/:id`: Individual user audit profile, security classification, role assignments, and sessions.
- `/admin/roles`: RBAC role creation, description, and permission assignment.
- `/admin/permissions`: 50+ permission matrix with interactive ALLOW/DENIED toggle buttons.
- `/admin/projects`: Studio portfolio showcase manager with categories and featured flags.
- `/admin/project-requests`: Client inquiry management with lifecycle states (`RECEIVED` → `REVIEWING` → `IN_DISCUSSION` → `IN_PRODUCTION` → `COMPLETED`).
- `/admin/content` & `/admin/pages`: Site copy CMS for homepage headlines, mission statements, ticker manifestos, and CTA buttons.
- `/admin/theme` & `/admin/design`: Global Theme Studio for color palettes (Deep Burgundy `#59171B`, Warm Beige `#FED7B8`), gradients, typography, design tokens, and instant rollback.
- `/admin/portfolios` & `/admin/subdomains`: Creator subdomain oversight (`username.naturestudio.in`), publishing toggles, and moderation.
- `/admin/portfolio-reports`: Community report queue (spam, copyright, abuse) with resolve/dismiss flows.
- `/admin/email`: Resend mailboxes, transactional templates editor with safe variable substitution (`{{name}}`, `{{projectType}}`), and delivery logs.
- `/admin/domains`: Production apex, www, and wildcard DNS verification status.
- `/admin/security`: Threat detection telemetry, TLS status, Atlas FIPS 140-2 encryption verification, and failed login monitors.
- `/admin/audit-logs` & `/admin/activity`: Tamper-resistant audit ledger with CSV export.
- `/admin/system` & `/admin/health`: Real-time ping latency for MongoDB Atlas, Next.js application server, Resend, and Google OAuth.
- `/admin/database`: Atlas collections and document metrics without arbitrary query console exposure.
- `/admin/backups`: Continuous point-in-time cloud backup status (managed externally via MongoDB Atlas).
- `/admin/feature-flags`: Runtime feature flags for canary deployments.
- `/admin/announcements`: Broadcast banner manager with audience targeting (`ALL`, `CREATORS`, `STAFF`).
- `/admin/maintenance`: Public maintenance mode toggle with administrative enclave preservation.
- `/admin/settings`: Global brand name, contact routing, and operational toggles.
- `/admin/redirects` & `/admin/seo`: Loop-protected 301/302 URL redirect manager.
- `/admin/media`: Secure asset upload library rejecting executables and scripts.
- `/admin/support`: Creator support ticket queue with resolution controls.
- `/admin/logs`: Filterable system event stream with automated secret redaction.

---

## 4. Break-Glass Security & Dangerous Operations
Destructive operations (e.g. permanent user account deletion) require typed confirmation phrases:
- Required typed phrase: `DELETE USER`
- Super-Admin protection: The system prevents deleting the final remaining Super Admin to prevent administrative lockout.
- Immutability: Audit log entries cannot be modified or casually deleted.
