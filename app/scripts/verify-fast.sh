#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

echo "== verify:fast =="
echo "1) typecheck"
npm run typecheck
echo "2) lint"
npx eslint \
  eslint.config.mjs \
  scripts/*.sh \
  tests/contracts/core-route-contracts.test.ts \
  tests/e2e/gate-critical-flows.spec.ts \
  src/app/api/visits/[id]/share/route.ts \
  src/app/api/visits/[id]/share/[grantId]/route.ts \
  src/app/visit/[id]/page.tsx
echo "3) critical test suite"
npm run test:critical
echo "4) core API contracts"
npm run test:contracts
echo "verify:fast passed."
