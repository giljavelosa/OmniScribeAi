#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

if [ ! -f "$APP_DIR/package.json" ]; then
  echo "Invalid app path: $APP_DIR/package.json not found"
  exit 1
fi

if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "Dependencies missing in $APP_DIR. Run npm install first."
  exit 1
fi

ensure_pm2_cwd() {
  if ! pm2 describe omniscribe-dev >/dev/null 2>&1; then
    return 1
  fi

  local current_cwd
  current_cwd="$(pm2 show omniscribe-dev | awk -F'│' '/exec cwd/ {gsub(/^[ \t]+|[ \t]+$/, "", $3); print $3; exit}')"
  local script_args
  script_args="$(pm2 show omniscribe-dev | awk -F'│' '/script args/ {gsub(/^[ \t]+|[ \t]+$/, "", $3); print $3; exit}')"

  if [ "$current_cwd" != "$APP_DIR" ] || [ "$script_args" != "run dev:local" ]; then
    echo "PM2 drift detected (cwd='$current_cwd', args='$script_args'). Recreating process with stable local dev command."
    pm2 delete omniscribe-dev >/dev/null 2>&1 || true
    pm2 start npm --name omniscribe-dev --cwd "$APP_DIR" -- run dev:local >/dev/null
    pm2 save >/dev/null || true
    return 0
  fi

  return 0
}

if command -v pm2 >/dev/null 2>&1; then
  if ensure_pm2_cwd; then
    if [ -f "$APP_DIR/.next/dev/lock" ] && ! curl -sf --max-time 2 "http://localhost:3000" >/dev/null 2>&1; then
      rm -f "$APP_DIR/.next/dev/lock"
    fi
    pm2 restart omniscribe-dev --update-env >/dev/null
  else
    if [ -f "$APP_DIR/.next/dev/lock" ] && ! curl -sf --max-time 2 "http://localhost:3000" >/dev/null 2>&1; then
      rm -f "$APP_DIR/.next/dev/lock"
    fi
    pm2 start npm --name omniscribe-dev --cwd "$APP_DIR" -- run dev:local >/dev/null
    pm2 save >/dev/null || true
  fi
else
  # Fallback for environments without PM2.
  if ! curl -sf --max-time 3 "http://localhost:3000" >/dev/null 2>&1; then
    rm -f "$APP_DIR/.next/dev/lock"
    PORT=3000 nohup npm run dev:local >/tmp/omniscribe-dev.log 2>&1 &
  fi
fi

sleep 2
if curl -sf --max-time 5 "http://localhost:3000" >/dev/null 2>&1; then
  echo "Local dev server is active at http://localhost:3000"
  exit 0
fi

if curl -sf --max-time 5 "http://localhost:3001" >/dev/null 2>&1; then
  echo "Local dev server is active at http://localhost:3001 (3000 unavailable)"
  exit 0
fi

echo "Unable to verify local dev server on ports 3000 or 3001"
exit 1
