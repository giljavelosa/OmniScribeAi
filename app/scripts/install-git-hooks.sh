#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$APP_DIR/.." && pwd)"
HOOK_SRC_DIR="$REPO_ROOT/.githooks"
HOOK_DST_DIR="$REPO_ROOT/.git/hooks"

if [[ ! -d "$REPO_ROOT/.git" ]]; then
  echo "No .git directory found. Skipping hook install."
  exit 0
fi

mkdir -p "$HOOK_DST_DIR"

for hook in pre-commit pre-push; do
  if [[ -f "$HOOK_SRC_DIR/$hook" ]]; then
    cp "$HOOK_SRC_DIR/$hook" "$HOOK_DST_DIR/$hook"
    chmod +x "$HOOK_DST_DIR/$hook"
  fi
done

echo "Installed git hooks from .githooks/"
