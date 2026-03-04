#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <commit-sha>"
  exit 1
fi

SHA="$1"
APP_DIR="${APP_DIR:-/home/omniscribe/omniscribeai/app}"
SERVICE_NAME="${SERVICE_NAME:-omniscribe-app}"
SMOKE_BASE_URL="${SMOKE_BASE_URL:-http://127.0.0.1}"

echo "==> Deploy preflight starting for SHA: ${SHA}"
cd "${APP_DIR}"

echo "==> Fetching repository state"
git fetch --all --prune
git checkout "${SHA}"

echo "==> Installing dependencies"
npm ci --no-audit --no-fund

echo "==> Generating Prisma client"
npx prisma generate

if git show --name-only --pretty=format: "${SHA}" | rg -q '^prisma/'; then
  echo "==> Prisma changes detected. Checking migration status"
  npx prisma migrate status
else
  echo "==> No Prisma migration changes in this SHA"
fi

echo "==> Running build and critical test gates"
npm run build
npm run test:critical

echo "==> Restarting service: ${SERVICE_NAME}"
if systemctl restart "${SERVICE_NAME}" 2>/dev/null; then
  true
elif command -v sudo >/dev/null 2>&1; then
  sudo systemctl restart "${SERVICE_NAME}"
else
  echo "Unable to restart ${SERVICE_NAME}. Run restart manually."
  exit 1
fi

echo "==> Running smoke checks"
curl -fsS "${SMOKE_BASE_URL}/" >/dev/null
curl -fsS "${SMOKE_BASE_URL}/api/auth/session" >/dev/null
curl -fsS "${SMOKE_BASE_URL}/login" >/dev/null

echo "==> Deploy preflight completed successfully for ${SHA}"

