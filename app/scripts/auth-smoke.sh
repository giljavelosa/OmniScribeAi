#!/usr/bin/env bash
# Auth smoke test — verifies credentials login returns a session cookie.
# Usage:   HOST=https://143.198.131.243 ADMIN_EMAIL=admin@omniscribe.ai ADMIN_PASSWORD='...' ./scripts/auth-smoke.sh
# Outputs: PASS or FAIL + HTTP status code.  Never prints secrets/PHI.
set +H          # disable history expansion so ! in passwords is safe
set -euo pipefail

: "${HOST:?HOST env var required (e.g. https://143.198.131.243)}"
: "${ADMIN_EMAIL:?ADMIN_EMAIL env var required}"
: "${ADMIN_PASSWORD:?ADMIN_PASSWORD env var required}"

JAR=$(mktemp)
trap 'rm -f "$JAR"' EXIT

# 1. Fetch CSRF token
CSRF=$(curl -sk -c "$JAR" "${HOST}/api/auth/csrf" | python3 -c 'import sys,json; print(json.load(sys.stdin)["csrfToken"])')
if [ -z "$CSRF" ]; then
  echo "FAIL: could not fetch CSRF token"
  exit 1
fi
echo "CSRF token obtained"

# 2. POST credentials — use --data-urlencode to safely encode special chars
HTTP_CODE=$(curl -sk \
  -b "$JAR" -c "$JAR" \
  -o /dev/null -w '%{http_code}' \
  -X POST "${HOST}/api/auth/callback/credentials" \
  -H Content-Type:application/x-www-form-urlencoded \
  -H "Origin:${HOST}" \
  --data-urlencode "email=${ADMIN_EMAIL}" \
  --data-urlencode "password=${ADMIN_PASSWORD}" \
  --data-urlencode "csrfToken=${CSRF}")

echo "Login HTTP status: ${HTTP_CODE}"

# 3. Check for session cookie
if grep -q 'authjs.session-token' "$JAR" 2>/dev/null; then
  echo "PASS: session cookie set"
  exit 0
else
  # 302 to /dashboard (or callbackUrl) with a session cookie = success
  # 302 to /login?error=CredentialsSignin = failure
  echo "FAIL: no session cookie (HTTP ${HTTP_CODE})"
  exit 1
fi
