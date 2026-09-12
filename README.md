# NatureStudios — The Digital Wild

A cinematic web platform for a creative studio working at the intersection of
esports, broadcast, and the natural world. Built as a full application rather
than a marketing page: public site, custom authentication, and a client
workspace for briefs, projects, messages, and notifications.

**Stack** — Next.js 14 (App Router) · React 18 · TypeScript (strict) ·
Tailwind CSS 3 · Framer Motion 11 · Prisma 5 · SQLite locally, PostgreSQL in
production.

---

## Quick start

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000. With `RESEND_API_KEY` left blank, verification
codes and password-reset links print to the terminal instead of being emailed,
so the full auth flow is testable offline.

---

## Design system

The whole visual language is midnight-first. Backgrounds run from near-black
through deep navy and indigo; type is warm cream rather than pure white. Two
accents carry meaning rather than decoration:

**Forest green is nature** — environmental light, hover states, progress,
selection, the occasional glow. Life growing inside darkness.

**Ember orange is energy** — sunlight cutting through a dark canopy. Reserved
for primary calls to action and portfolio emphasis.

**Live red is rare** — match status, alerts, destructive confirmation. Nothing
else.

Sections are never alternately tinted green and orange. Both accents appear as
light sources inside one continuous dark environment.

Every colour, type scale, shadow, and radius lives in `tailwind.config.ts` with
a parallel set of CSS custom properties in `src/styles/globals.css`. Components
consume tokens (`bg-surface`, `text-cream-dim`, `border-edge`, `shadow-glow-forest`),
never raw hex.

Motion is scroll-driven rather than decorative: pinned sequences with transform
interpolation, clipping, parallax, and blur, all built on Framer Motion motion
values. Every animated surface honours `prefers-reduced-motion` — the hooks
return static layouts rather than merely shortening durations.

---

## Layout

```
src/
  app/                     App Router — routes, layouts, API handlers
    (auth)/                login · register · verify · forgot/reset password
    api/                   auth, projects, project-requests, messages,
                           notifications, user profile & account
    dashboard/             client workspace (noindex)
    work/[slug]/           case studies
    sitemap.ts robots.ts   generated from APP_URL at build time
  components/
    chrome/                cursor, page transitions, scroll progress,
                           command palette, loading sequence
    dashboard/             workspace shell, modals, cards, threads
    auth/                  auth shell and forms
  context/                 auth, dashboard, toast, command palette
  lib/                     auth, otp, email, google, prisma, seo, utils
  data/site.ts             navigation, services, projects, studio copy
prisma/schema.prisma       9 models
```

Client pages cannot export `metadata`, so most routes pair a client `page.tsx`
with a thin server `layout.tsx` that calls `pageMetadata()` from `src/lib/seo.ts`.
That helper is the single source of canonical URLs, Open Graph tags, Twitter
cards, and robots directives.

---

## Routes

Public: `/` `/about` `/work` `/work/:slug` `/services` `/studio` `/contact`
`/privacy` `/terms`, plus a custom `not-found`.

Auth: `/login` `/register` `/verify` `/forgot-password` `/reset-password` —
all `noindex`.

Workspace: `/dashboard` and `/dashboard/{projects,requests,messages,notifications,settings}`
— all `noindex`, all guarded server-side at the API layer.

---

## Authentication

Email and password with bcrypt at cost 12, plus Google OAuth 2.0 with `state`
validation.

Sessions are not JWTs. `createSession()` mints a 256-bit random token, stores it
in the `Session` table, and sets it as an HTTP-only `ns_session` cookie
(`sameSite: 'lax'`, `secure` in production, 30-day expiry). Every request looks
the row up server-side, which means signing out actually revokes the session
instead of waiting for a token to expire.

Registration issues a six-digit code, stored only as a SHA-256 hash. It expires
in ten minutes, allows five attempts before being destroyed, and can be resent
once a minute. Password reset uses a 32-byte token under the same hashing rule,
valid for an hour and single-use. `/api/auth/forgot-password` returns an
identical response whether or not the address exists.

Authorization lives in the API routes. Every protected handler calls
`getCurrentUser()` and returns `401` before touching data; the redirect in the
dashboard layout is a convenience for the user, not a security boundary.

---

## Scripts

```bash
npm run dev             # development server
npm run build           # prisma generate && next build
npm run start           # serve the production build
npm run typecheck       # tsc --noEmit
npm run lint            # next lint
npm run verify          # typecheck + lint
npm run prisma:push     # sync schema to the database
npm run prisma:studio   # browse the database
npm run db:seed         # sample workspace data
```

---

## Content status

Project case studies, statistics, and studio copy in `src/data/site.ts` are
sample content for a portfolio build. They are labelled as such in the UI and
should be replaced with real work before the site is presented as a live
commercial claim. No real client names, partnerships, awards, or performance
figures are asserted anywhere in the codebase.

---

## Deploying

See [DEPLOYMENT.md](./DEPLOYMENT.md). The short version: switch
`prisma/schema.prisma` to `provider = "postgresql"`, provision a database, set
the environment variables from `.env.example`, and connect the repository to
Vercel. One known limitation — avatar *file* upload writes to disk and therefore
returns a clear `503` on read-only serverless hosts; the URL and preset avatar
paths work everywhere.
