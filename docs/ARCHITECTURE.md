# Cubo Architecture

## Overview

Cubo is a **Next.js App Router monolith** — frontend and REST API in one deployable unit. This keeps Railway ops simple: one service, one PostgreSQL plugin, optional Redis.

```
┌─────────────┐     ┌──────────────────────────────────────┐
│   Browser   │────▶│  Next.js (App Router + API Routes)   │
└─────────────┘     │  ├─ SSR pages (search, listing, etc.) │
                    │  ├─ REST API (/api/*)                │
                    │  └─ NextAuth (JWT + OAuth)           │
                    └──────────┬────────────┬──────────────┘
                               │            │
                    ┌──────────▼──┐  ┌──────▼─────┐
                    │ PostgreSQL  │  │  S3 / R2   │
                    │  (Prisma)   │  │  (images)  │
                    └─────────────┘  └────────────┘
                               │
                    ┌──────────▼──┐
                    │   Stripe    │
                    └─────────────┘
```

## Tech choices

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 16 + React 19 + Tailwind 4 | SSR/SEO, fast dev, Railway-friendly |
| API | Next.js Route Handlers | Same deploy, shared types with UI |
| DB | PostgreSQL + Prisma | Relational data, migrations, full-text search |
| Auth | NextAuth v5 (JWT + Google/Apple) | OAuth + credentials, Prisma adapter |
| Payments | Stripe | Checkout, webhooks, seller payouts later |
| Storage | S3-compatible (AWS / R2 / Railway Bucket) | Presigned uploads |
| Real-time | Socket.io (Phase 2) | Auction bids, messaging |
| Search | PostgreSQL FTS → Elasticsearch (scale) | Start simple, migrate at volume |

## Folder structure

```
cubo/
├── prisma/
│   ├── schema.prisma      # Full marketplace schema
│   └── seed.ts            # Demo users, categories, listings
├── src/
│   ├── app/               # Pages + API routes
│   │   ├── api/           # REST endpoints
│   │   ├── listing/       # Product detail
│   │   ├── search/        # Search & filters
│   │   ├── login|register/
│   │   └── sell/          # Create listing
│   ├── components/        # UI (layout, listing, ui)
│   ├── lib/               # db, auth, services, validators
│   └── types/
├── docs/                  # Architecture, API reference
├── Dockerfile
├── docker-compose.yml     # Local Postgres + Redis
└── railway.toml
```

## Database domains

- **Users** — roles (buyer/seller/admin), 2FA fields, seller verification
- **Listings** — fixed price, auction, variations, media, drafts
- **Auctions & Bids** — reserve, buy-it-now, anti-snipe extension
- **Orders & Payments** — Stripe IDs, tax/shipping breakdown
- **Social** — watchlist, reviews, messages, notifications
- **Admin** — reports, audit logs, coupons, CMS pages

See `prisma/schema.prisma` for the full normalized schema.

## API endpoints (Phase 1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check (Railway) |
| POST | `/api/auth/register` | Email registration |
| * | `/api/auth/[...nextauth]` | NextAuth handlers |
| GET/POST | `/api/listings` | List / create listings |
| GET/PATCH/DELETE | `/api/listings/[slug]` | Single listing CRUD |
| POST | `/api/listings/[slug]/bid` | Place auction bid |
| GET | `/api/categories` | Category tree |
| GET/POST/DELETE | `/api/watchlist` | Favorites |
| POST | `/api/upload` | S3 presigned upload |

## Authentication flow

1. **Register** — `POST /api/auth/register` hashes password, creates user
2. **Login** — NextAuth credentials or OAuth (Google/Apple)
3. **Session** — JWT with `id`, `role`, `username` in token
4. **Protected routes** — middleware + `auth()` in server components/APIs

## Deployment (Railway)

1. Create Railway project from GitHub repo `mariodelcid/cubo`
2. Add **PostgreSQL** plugin → copy `DATABASE_URL`
3. Set env vars from `.env.example`
4. Build uses `Dockerfile` (standalone Next.js output)
5. Run migrations: `npx prisma migrate deploy` (or `db push` for dev)
6. Seed: `npm run db:seed`

### Recommended Railway plugins

- **PostgreSQL** — required
- **Redis** — rate limiting, sessions (Phase 2)
- **Volume or S3** — image storage (use Cloudflare R2 for cost)

## Phased roadmap

### Phase 1 (current)
Auth, listings CRUD, search, categories, watchlist, homepage, Docker/Railway

### Phase 2
Cart, Stripe checkout, orders, seller/buyer dashboards, messaging

### Phase 3
Real-time auctions (Socket.io), admin panel, notifications (email/SMS)

### Phase 4
AI features, Elasticsearch, multi-currency, affiliate program

## Security defaults

- Security headers in `next.config.ts`
- Zod validation on all API inputs
- bcrypt password hashing
- Prisma parameterized queries (SQL injection safe)
- Rate limiting (Redis) — Phase 2
- CSRF via NextAuth + SameSite cookies
