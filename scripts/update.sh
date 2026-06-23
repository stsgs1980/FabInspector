#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSPECTOR_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(cd "$INSPECTOR_DIR/../../../.." && pwd)"

echo "[UPDATE] Select Element Inspector v3.1"
echo "[UPDATE] Project root: $PROJECT_ROOT"

# --- 1. Проверить что это submodule ---
echo ""
echo "[UPDATE] Step 1/3: Checking submodule status..."

if ! git -C "$PROJECT_ROOT" submodule status "src/components/inspector" &>/dev/null; then
  echo "[FAIL] src/components/inspector is not a git submodule."
  echo "       For manual update, run:"
  echo "         git submodule add https://github.com/stsgs1980/FabInspector.git src/components/inspector"
  exit 1
fi

# --- 2. Обновить submodule ---
echo ""
echo "[UPDATE] Step 2/3: Pulling latest version..."

cd "$INSPECTOR_DIR"
BEFORE=$(git rev-parse --short HEAD)
git fetch origin
git checkout origin/main
AFTER=$(git rev-parse --short HEAD)
cd "$PROJECT_ROOT"

if [ "$BEFORE" = "$AFTER" ]; then
  echo "[OK] Already up to date ($BEFORE)"
else
  echo "[OK] Updated: $BEFORE -> $AFTER"
fi

# --- 3. Обновить зависимости ---
echo ""
echo "[UPDATE] Step 3/3: Checking dependencies..."

if ! grep -q '"framer-motion"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
  echo "[UPDATE] Installing framer-motion..."
  cd "$PROJECT_ROOT" && bun add framer-motion
  echo "[OK] framer-motion installed"
else
  echo "[OK] Dependencies OK"
fi

# Зафиксировать новую версию submodule в проекте
git -C "$PROJECT_ROOT" add "src/components/inspector"

echo ""
echo "============================================"
echo " Inspector updated to $AFTER"
echo "============================================"
echo ""
echo " Changes are staged. Commit when ready:"
echo "   git commit -m 'chore: update FabInspector to $AFTER'"
echo "============================================"