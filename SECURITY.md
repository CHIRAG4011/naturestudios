# NATURESTUDIOS — SECURITY ARCHITECTURE & POLICY (SECURITY.MD)

## 1. Authentication & Session Security
- **Password Hashing**: Industry-standard Argon2id / Bcrypt with salted rounds. Plaintext passwords and hashes are never exposed in administrative APIs.
- **Session Tokens**: Cryptographically signed JSON Web Tokens (JWT) using `jose` with HS256/RS256 algorithms and standard expiration windows.
- **Force Logout**: Authorized administrators (`users.force_logout`) can invalidate active user sessions server-side.
- **Federated Authentication**: Google OAuth 2.0 with validated client secrets and server-to-server token verification.

---

## 2. Multi-Tier RBAC & Authorization
- **Server-Side Enforcement**: All administrative endpoints (`/api/admin/*`) strictly enforce permissions using `requireAdminPermission(req, key)`. Client-side hiding of buttons is treated purely as UX, never as a security boundary.
- **Explicit Deny Policy**: An explicit user-specific `DENY` record unconditionally overrides inherited role permissions.
- **Zero-Trust Defaults**: Any route without explicit grants defaults to `DENY` (HTTP 403 Forbidden).

---

## 3. Cryptography & Data Protection
- **Encryption-at-Rest**: MongoDB Atlas continuous volume encryption compliant with FIPS 140-2 standards.
- **Encryption-in-Transit**: Strict Transport Security (HSTS) with TLS 1.3 enforced across `naturestudio.in` and `*.naturestudio.in`.
- **Envelope Encryption**: Application-level AES-256-GCM architecture for non-queryable sensitive configuration fields.
- **Secret Redaction**: Passwords, tokens, API keys, and session secrets are automatically scrubbed from all system logs, audit trails, and client responses via `sanitizeAuditData()`.

---

## 4. Multi-Tenant Isolation
- Every portfolio document is linked by strict database relationship (`userId`).
- Requests to modify drafts, custom templates, assets, or settings verify ownership server-side. User A cannot view or alter User B's unverified draft or private assets.
- Public subdomains (`username.naturestudio.in`) only serve portfolios with status `PUBLISHED`. Non-existent or draft subdomains return a secure 404.

---

## 5. Threat Mitigation & Rate Limiting
- **Rate Limiting**: Critical endpoints (login, OTP verification, password reset, contact forms, administrative actions) enforce IP-based rate limiting to prevent brute-force attacks.
- **Media Upload Safety**: The media library verifies MIME types and extensions, strictly rejecting dangerous executables (`.exe`, `.sh`, `.bat`, `.js`, `.html`, `.php`, `.dll`).
- **Audit Logging**: Every sensitive action (`ROLE_CHANGED`, `USER_SUSPENDED`, `PORTFOLIO_UNPUBLISHED`, `THEME_PUBLISHED`, `MAINTENANCE_ENABLED`) is permanently recorded with timestamp, actor email, IP address, and before/after summaries.
