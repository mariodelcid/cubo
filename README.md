# Cubo — Modern Marketplace

Buy and sell anything. Auctions, fixed-price listings, trusted sellers.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · PostgreSQL · Prisma · NextAuth · Stripe · S3

## Quick start (local)

### Prerequisites

- Node.js 20+
- Docker (optional, for Postgres/Redis)

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

**Windows:** If `npm install` fails with `ENOTEMPTY` or corrupted tarball errors, try one of these:

- **WSL2 (recommended):** Run the project inside Ubuntu (`npm install --legacy-peer-deps`)
- **Docker:** `docker compose up --build` — builds in Linux, avoids Windows file-lock issues
- **Retry:** Close other Node/IDE processes, then delete `node_modules` and reinstall

Railway/Docker builds are unaffected — this is a local Windows npm quirk.

### 2. Environment

```bash
cp .env.example .env
# Edit DATABASE_URL and AUTH_SECRET
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Database

**Option A — Docker:**

```bash
docker compose up -d postgres redis
```

**Option B — Local Postgres:** point `DATABASE_URL` at your instance.

Then:

```bash
npm run db:push
npm run db:seed
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo accounts** (after seed):

| Email | Password |
|-------|----------|
| seller@cubo.market | password123 |
| buyer@cubo.market | password123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Create migration |
| `npm run db:push` | Push schema (dev) |
| `npm run db:seed` | Seed demo data |
| `npm test` | Run Vitest tests |

## Deploy to Railway (production)

**Everything runs on Railway** — app server and PostgreSQL database. No local machine needed.

See **[docs/RAILWAY.md](docs/RAILWAY.md)** for the full setup guide.

Quick checklist:

1. Railway project connected to `mariodelcid/cubo` on GitHub
2. Add **PostgreSQL** plugin in the same project
3. Link `DATABASE_URL` from Postgres → web service (Variable Reference)
4. Set `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` on web service
5. Set `RUN_SEED=true` for first deploy only (demo data)
6. Generate a public domain under **Networking**

Health check: `https://YOUR-DOMAIN.up.railway.app/api/health`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architecture, API reference, and roadmap.

## Project structure

```
src/app/          Pages + API routes
src/components/   React UI components
src/lib/          Database, auth, services
prisma/           Schema + migrations + seed
docs/             Architecture documentation
```

## License

Private — mariodelcid/cubo
