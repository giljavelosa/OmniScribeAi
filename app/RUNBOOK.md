# Verification Gate Runbook

## Run Gate Locally

1. Install dependencies:
   - `cd app && npm ci`
2. Optional test env setup:
   - `cp .env.test.example .env.test`
3. Fast gate (pre-commit equivalent):
   - `npm run verify:fast`
4. Full gate (pre-push/CI equivalent):
   - `npm run verify:gate`

## If Gate Fails

1. Read failure section in terminal:
   - failed step name
   - exact command output
   - touched files (`git status --short`)
2. Fix the root cause; do not bypass tests.
3. Re-run the failed step command directly.
4. Re-run full gate:
   - `npm run verify:gate`

## Staging Deploy Sequence (by SHA)

1. On staging host, checkout immutable SHA:
   - `git fetch --all --prune`
   - `git checkout <sha>`
2. Install + generate Prisma client:
   - `npm ci`
   - `npx prisma generate`
3. Run full gate before restart:
   - `npm run verify:gate`
4. Restart service only after green gate:
   - `systemctl restart omniscribe-app`
5. Post-deploy smoke:
   - `curl -fsS http://127.0.0.1/login >/dev/null`
   - `curl -fsS http://127.0.0.1/api/auth/session >/dev/null`
