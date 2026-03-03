#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

LOG_DIR="$APP_DIR/.tmp/verify-gate"
mkdir -p "$LOG_DIR"

LAST_STEP=""
LAST_LOG=""

cleanup() {
  npm run server:test:stop >/dev/null 2>&1 || true
}
trap cleanup EXIT

run_step() {
  local name="$1"
  local cmd="$2"
  local safe_name
  safe_name="$(echo "$name" | tr ' /:' '___')"
  local logfile="$LOG_DIR/${safe_name}.log"
  LAST_STEP="$name"
  LAST_LOG="$logfile"

  echo ""
  echo "==> STEP: $name"
  echo "CMD: $cmd"
  if bash -lc "$cmd" >"$logfile" 2>&1; then
    echo "PASS: $name"
  else
    echo "FAIL: $name"
    echo "---- command output ----"
    cat "$logfile"
    echo "---- touched files ----"
    git status --short || true
    echo "---- end failure report ----"
    exit 1
  fi
}

run_step "typecheck + lint" "npm run typecheck && npx eslint eslint.config.mjs scripts/*.sh tests/contracts/core-route-contracts.test.ts tests/e2e/gate-critical-flows.spec.ts src/app/api/visits/[id]/share/route.ts src/app/api/visits/[id]/share/[grantId]/route.ts src/app/visit/[id]/page.tsx"
run_step "unit/integration fast" "npm run test:critical"
run_step "core api contracts" "npm run test:contracts && npx vitest run -c vitest.critical.config.ts ./tests/contracts/core-route-contracts.test.ts"
run_step "security middleware regressions" "npx vitest run -c vitest.critical.config.ts ./tests/unit/middleware-security.test.ts"
run_step "billing gate + boundary tests" "npx vitest run -c vitest.critical.config.ts ./tests/unit/billing-entitlements.test.ts ./tests/unit/billing-route-enforcement.test.ts"
run_step "visit immutability + amendment safety" "npx vitest run -c vitest.critical.config.ts ./tests/unit/visit-finalization-guards.test.ts"
run_step "start test app server" "npm run server:test:start"
run_step "runtime auth/login smoke" "npm run smoke:auth"
run_step "playwright e2e core flows" "TEST_PORT=\${TEST_PORT:-3301} BASE_URL=http://127.0.0.1:\${TEST_PORT:-3301} npm run test:e2e -- --grep @gate"
run_step "stop test app server" "npm run server:test:stop"

echo ""
echo "verify:gate passed."
