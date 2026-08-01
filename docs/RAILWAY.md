# Deploy Cubo on Railway (GitHub → Railway)

**Flow:** Push to GitHub `main` → Railway auto-builds and deploys.  
No local server or CLI uploads required.

## Railway project

**Dashboard:** https://railway.com/project/d49e152f-da57-4ae0-b2c4-405f18ba4856  
**Live URL:** https://cubo-production-c3c5.up.railway.app

## Services (keep only these)

| Service | Purpose |
|---------|---------|
| **cubo** | Web app — connected to GitHub `mariodelcid/cubo` |
| **Postgres** | Database — provides `DATABASE_URL` |

> Delete the **cubo-web** service if it exists — that was a mistaken CLI upload and is not needed.

## Required variables (on `cubo` service)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Reference from **Postgres** service |
| `AUTH_SECRET` | Random string |
| `NEXTAUTH_URL` | `https://cubo-production-c3c5.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | Same as above |
| `RUN_SEED` | `true` on first deploy only, then remove |

## How deploy works

1. You push to GitHub (`git push origin main`)
2. Railway detects the change on the `cubo` service
3. Railpack runs `npm ci`, `prisma generate`, `next build`
4. Container starts → `prisma db push` → optional seed → `next start`

## Verify

```
https://cubo-production-c3c5.up.railway.app/api/health
```

Expected: `{ "status": "ok", "checks": { "database": "ok" } }`

## Demo accounts (after seed)

| Email | Password |
|-------|----------|
| seller@cubo.market | password123 |
| buyer@cubo.market | password123 |
