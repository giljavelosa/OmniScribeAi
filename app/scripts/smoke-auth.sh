#!/usr/bin/env bash
set -euo pipefail

TEST_PORT="${TEST_PORT:-3301}"
BASE_URL="${BASE_URL:-http://127.0.0.1:${TEST_PORT}}"

echo "Smoke: ${BASE_URL}/login"
curl -fsS --max-time 8 "${BASE_URL}/login" >/dev/null

echo "Smoke: ${BASE_URL}/api/auth/session"
SESSION_RAW="$(curl -fsS --max-time 8 "${BASE_URL}/api/auth/session")"
if [[ ! "$SESSION_RAW" =~ ^\{ ]] && [[ ! "$SESSION_RAW" =~ ^\[ ]] && [[ "$SESSION_RAW" != "null" ]]; then
  echo "Auth session response is not valid JSON/null payload"
  exit 1
fi

echo "Smoke checks passed."
