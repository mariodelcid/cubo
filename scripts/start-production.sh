#!/bin/sh
set -e

echo "==> Cubo production start"

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "Add a PostgreSQL plugin in Railway and link DATABASE_URL to this service."
  exit 1
fi

echo "==> Applying database schema..."
./node_modules/.bin/prisma db push --skip-generate

if [ "$RUN_SEED" = "true" ]; then
  echo "==> Seeding database..."
  ./node_modules/.bin/tsx prisma/seed.ts
fi

echo "==> Starting Next.js server on port ${PORT:-3000}..."
exec node server.js
