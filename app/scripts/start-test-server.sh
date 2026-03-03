#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$APP_DIR/.tmp/test-server.pid"
LOG_FILE="$APP_DIR/.tmp/test-server.log"
TEST_PORT="${TEST_PORT:-3301}"
BASE_URL="http://127.0.0.1:${TEST_PORT}"

mkdir -p "$APP_DIR/.tmp"

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${OLD_PID}" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Test server already running (pid=${OLD_PID}) at ${BASE_URL}"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

cd "$APP_DIR"

if [[ ! -f "$APP_DIR/.next/BUILD_ID" ]]; then
  echo "Build output missing; running npm run build first"
  npm run build >"$LOG_FILE" 2>&1
fi

echo "Starting test server on ${BASE_URL}"
PORT="$TEST_PORT" NODE_ENV=test npm run start >>"$LOG_FILE" 2>&1 &
PID="$!"
echo "$PID" > "$PID_FILE"

for _ in {1..40}; do
  if curl -fsS --max-time 2 "$BASE_URL/login" >/dev/null 2>&1; then
    echo "Test server ready at ${BASE_URL} (pid=${PID})"
    exit 0
  fi
  sleep 1
done

echo "Failed to start test server. Last logs:"
tail -n 120 "$LOG_FILE" || true
exit 1
