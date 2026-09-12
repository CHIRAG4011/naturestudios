# NatureStudios Production Deployment Guide
**Production Domain**: [https://naturestudio.in](https://naturestudio.in)  
**Database**: MongoDB Atlas  
**Hosting**: Vercel (Edge & Serverless Node.js)  
**Email Infrastructure**: Resend (`@naturestudio.in`)  
**Wildcard Subdomain Architecture**: `*.naturestudio.in`  

---

## 1. MongoDB Atlas Setup & Configuration

MongoDB Atlas is the single production source of truth for NatureStudios.

### Step-by-Step Atlas Provisioning:
1. **Create MongoDB Atlas Cluster**:
   - Log into [MongoDB Cloud](https://cloud.mongodb.com).
   - Create a new project named `NatureStudios`.
   - Provision a M10+ (or shared tier) cluster in your preferred regional cloud (e.g. AWS `us-east-1` or `ap-south-1` to match Vercel deployment region).
   - Confirm Encryption at Rest is active (default on Atlas M10+).

2. **Database User Credentials**:
   - Navigate to **Security → Database Access → Add New Database User**.
   - Select **Password Authentication**.
   - Create user `naturestudios_prod` with a high-entropy 32+ character random password.
   - Assign database user privileges: `Read and write to any database` (or scope specifically to `naturestudios`).

3. **Network Access**:
   - Navigate to **Security → Network Access → Add IP Address**.
   - For Vercel Serverless Functions, add `0.0.0.0/0` (Allow Access from Anywhere).
   - Security Note: Access remains strictly protected by SCRAM-SHA-256 database authentication and TLS 1.3 encryption in transit.

4. **Retrieve Connection String**:
   - Click **Connect → Drivers → Node.js (Version 5.5 or later)**.
   - Copy the SRV URI:
     ```
     mongodb+srv://naturestudios_prod:<password>@cluster0.xxxxx.mongodb.net/naturestudios?retryWrites=true&w=majority
     ```
   - Store this value in Vercel as `MONGODB_URI`.

5. **Automatic Index Provisioning**:
   - NatureStudios automatically runs `ensureMongoIndexes()` on initial connection, establishing:
     - `users.email` (UNIQUE)
     - `portfolios.slug` (UNIQUE)
     - `portfolioDomains.hostname` (UNIQUE)
     - `sessions.sessionToken` (UNIQUE)
     - TTL indexes on `sessions`, `verificationCodes`, and `passwordResetTokens`.

---

## 2. Resend Email Setup (`@naturestudio.in`)

NatureStudios utilizes a multi-mailbox routing architecture over the verified domain `naturestudio.in`.

### Domain Verification (DNS Records):
In your domain DNS manager (Cloudflare, Namecheap, Route53), configure the exact records provided in the Resend Dashboard for `naturestudio.in`:

1. **SPF Record (TXT)**:
   - Host: `bounces.naturestudio.in` (or root depending on Resend prompt)
   - Value: `v=spf1 include:amazonses.com ~all`
2. **DKIM Records (CNAME / TXT)**:
   - Add the 3 DKIM tokens provided by Resend to authorize cryptographic email signing.
3. **DMARC Record (TXT)**:
   - Host: `_dmarc.naturestudio.in`
   - Value: `v=DMARC1; p=none; rua=mailto:admin@naturestudio.in`

### Configurable Mailboxes:
Set the following environment variables in Vercel:
- `RESEND_API_KEY`: Your live key (`re_...`)
- `RESEND_FROM_EMAIL`: `noreply@naturestudio.in`
- `RESEND_INQUIRIES_EMAIL`: `inquiries@naturestudio.in`
- `RESEND_ADMIN_EMAIL`: `admin@naturestudio.in`
- `RESEND_SUPPORT_EMAIL`: `support@naturestudio.in`
- `RESEND_NOREPLY_EMAIL`: `noreply@naturestudio.in`
- `RESEND_PORTFOLIO_EMAIL`: `portfolio@naturestudio.in`

---

## 3. Google OAuth 2.0 (Branded as NatureStudios)

The Google consent screen is configured directly in Google Cloud Console.

### Branding Configuration:
1. Open [Google Cloud Console](https://console.cloud.google.com).
2. Navigate to **APIs & Services → OAuth consent screen**.
3. Set user-facing details:
   - **App name**: `NatureStudios`
   - **User support email**: `inquiries@naturestudio.in` (or project owner)
   - **App logo**: Upload NatureStudios square mark (120x120px)
   - **Application home page**: `https://naturestudio.in`
   - **Application privacy policy link**: `https://naturestudio.in/privacy`
   - **Application terms of service link**: `https://naturestudio.in/terms`
   - **Authorized domains**: `naturestudio.in`
4. Navigate to **APIs & Services → Credentials**:
   - Edit your Web Application OAuth Client.
   - **Authorized JavaScript origins**:
     - `https://naturestudio.in`
     - `http://localhost:3000` (for local development)
   - **Authorized redirect URIs**:
     - `https://naturestudio.in/api/auth/google/callback`
     - `http://localhost:3000/api/auth/google/callback`
5. Note your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## 4. Vercel Deployment & Wildcard Subdomain Routing

NatureStudios uses a single Next.js application that handles both `naturestudio.in` and all creator portfolios (`username.naturestudio.in`).

### Vercel Project Setup:
1. Push this repository to your Git provider (GitHub / GitLab).
2. Import the project into Vercel.
3. Framework: **Next.js**
4. Build Command: `prisma generate && next build`
5. Node.js Version: 18.x or 20.x

### Domain & Wildcard DNS Configuration:
In Vercel **Project Settings → Domains**:
1. Add `naturestudio.in` (Primary Production Domain).
2. Add `www.naturestudio.in` (Redirect to `naturestudio.in`).
3. Add `*.naturestudio.in` (Wildcard Domain for creator portfolios).

In your DNS Registrar:
- **A Record**: `@` → `76.76.21.21` (Vercel IP)
- **CNAME Record**: `www` → `cname.vercel-dns.com`
- **CNAME Record**: `*` → `cname.vercel-dns.com` (Enables wildcard routing)

Next.js `src/middleware.ts` automatically parses the incoming Host header:
- `naturestudio.in` → Serves main studio website.
- `alex.naturestudio.in` → Rewrites internally to `/portfolio-render/alex` with sub-second execution.
- If the portfolio does not exist or is in draft mode, renders "PORTFOLIO NOT FOUND".

---

## 5. Complete Production Environment Variables

Set the following in Vercel **Settings → Environment Variables** (Environment: Production & Preview):

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0...` | MongoDB Atlas cluster connection string with TLS |
| `AUTH_SECRET` | `a7b93c8e...` (64 chars) | High-entropy session cookie secret |
| `ENCRYPTION_KEY` | `f3e21a08...` (32 bytes hex) | 256-bit AES-GCM application encryption key |
| `APP_URL` | `https://naturestudio.in` | Canonical production URL |
| `RESEND_API_KEY` | `re_...` | Transactional email provider key |
| `RESEND_FROM_EMAIL` | `noreply@naturestudio.in` | Default sender |
| `RESEND_INQUIRIES_EMAIL` | `inquiries@naturestudio.in` | Client brief recipient |
| `RESEND_ADMIN_EMAIL` | `admin@naturestudio.in` | Internal studio notification recipient |
| `RESEND_SUPPORT_EMAIL` | `support@naturestudio.in` | Security and reset reply-to |
| `RESEND_NOREPLY_EMAIL` | `noreply@naturestudio.in` | Automated delivery mailbox |
| `RESEND_PORTFOLIO_EMAIL` | `portfolio@naturestudio.in` | Creator platform notifications |
| `GOOGLE_CLIENT_ID` | `100529...apps.googleusercontent.com` | Google Cloud OAuth ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Google Cloud OAuth Secret |
| `GOOGLE_REDIRECT_URI` | `https://naturestudio.in/api/auth/google/callback` | OAuth Callback endpoint |

---

## 6. Post-Deployment Verification Checklist

1. **Root Domain**: Visit `https://naturestudio.in` — verify cinematic 5-phase hero, smooth scroll story, work reel, and burgundy/warm beige styling.
2. **Database Verification**: Register a new user, log in, submit a project request — verify records in MongoDB Atlas collections.
3. **Email Dispatch**: Trigger OTP and password reset — verify arrival from `@naturestudio.in` with branded templates.
4. **Google Sign-In**: Click "Continue with Google" — verify consent screen displays "NatureStudios", and user redirects to `/dashboard` with profile name and picture.
5. **Portfolio Creation**: Complete the 13-step wizard, choose a theme (e.g. `Cinematic` or `Esports`), verify autosave, and click "Publish".
6. **Wildcard Test**: Visit `https://yourname.naturestudio.in` (or simulate with `x-subdomain: yourname`) — verify public portfolio renders.
7. **Security Isolation**: Log in as User B — verify User B cannot edit or unpublish User A's portfolio.
8. **Admin Control Center Verification**:
   - Access `https://naturestudio.in/admin` with a standard user account — verify `403 — ADMIN ACCESS REQUIRED` screen is rendered.
   - Access with a verified administrator account (`admin@naturestudio.in`) — verify instant clearance to the Mission Control dashboard.
   - Test Command Palette (`Ctrl + K`), Role Assignment, 50+ Permissions Matrix, Site Content CMS editing, Theme Studio live preview/publish/rollback, and immutable audit logs.
