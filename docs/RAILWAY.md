# Deploy Cubo on Railway (production)

Everything runs on Railway — **no local server or database required**.

## Architecture on Railway

```
┌──────────────── Railway Project ────────────────┐
│                                                  │
│  ┌─────────────┐      ┌──────────────────┐      │
│  │  Cubo Web   │──────│   PostgreSQL     │      │
│  │  (Docker)   │      │   (plugin)       │      │
│  └─────────────┘      └──────────────────┘      │
│        │                                         │
│        │  optional                               │
│        └──────────► Redis (plugin)               │
└──────────────────────────────────────────────────┘
```

## Step 1 — Create services

1. Open your Railway project (connected to `mariodelcid/cubo`)
2. Click **+ New** → **Database** → **PostgreSQL**
3. Wait for Postgres to finish provisioning

## Step 2 — Link database to web service

1. Click your **Cubo web service** (not Postgres)
2. Go to **Variables**
3. Click **+ New Variable** → **Add Reference**
4. Select the PostgreSQL service → choose `DATABASE_URL`
5. Save

Railway injects the connection string automatically. **Do not use localhost.**

## Step 3 — Set required variables (web service)

| Variable | Value |
|----------|-------|
| `AUTH_SECRET` | Random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your Railway URL, e.g. `https://cubo-production.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | Same as `NEXTAUTH_URL` |
| `RUN_SEED` | `true` — **only for first deploy**, then delete |

`RAILWAY_PUBLIC_DOMAIN` is set automatically when you enable a public domain.

## Step 4 — Enable public URL

1. Web service → **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy the URL into `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`
4. Redeploy if you added variables after the first deploy

## Step 5 — Deploy

Push to GitHub `main` — Railway rebuilds automatically.

On each deploy the container:
1. Runs `prisma db push` (creates/updates tables in Railway Postgres)
2. Optionally seeds demo data if `RUN_SEED=true`
3. Starts the Next.js server

## Verify deployment

- **App:** `https://YOUR-DOMAIN.up.railway.app`
- **Health:** `https://YOUR-DOMAIN.up.railway.app/api/health`

Health check should return:
```json
{
  "status": "ok",
  "checks": { "service": "ok", "database": "ok" }
}
```

If `database: "error"`, Postgres is not linked — repeat Step 2.

## Demo accounts (after seed)

| Email | Password |
|-------|----------|
| seller@cubo.market | password123 |
| buyer@cubo.market | password123 |

## Optional: Redis

For caching and real-time features (Phase 2+):

1. **+ New** → **Database** → **Redis**
2. Add Reference: `REDIS_URL` from Redis service → web service

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails | Check Railway build logs; Dockerfile builds on Linux |
| `DATABASE_URL is not set` | Link Postgres variable reference to web service |
| App loads but no listings | Set `RUN_SEED=true`, redeploy, then remove it |
| Auth login fails | Ensure `AUTH_SECRET` and `NEXTAUTH_URL` match your Railway domain |
| 503 on `/api/health` | Postgres not reachable — check DATABASE_URL reference |

## Local dev (optional)

Local development is optional. Production runs entirely on Railway.
Use `docker compose up` only if you want a local copy for testing.
