#!/bin/sh
set -e

echo "==> Cubo production start"

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "Link the Postgres DATABASE_URL variable to this service in Railway."
  exit 1
fi

echo "==> Applying database schema..."
npx prisma db push --skip-generate

if [ "$RUN_SEED" = "true" ]; then
  echo "==> Seeding database..."
  npx tsx prisma/seed.ts
fi

echo "==> Starting Next.js on port ${PORT:-3000}..."
exec next start -p "${PORT:-3000}"
