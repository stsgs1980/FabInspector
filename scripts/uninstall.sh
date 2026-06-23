#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSPECTOR_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(cd "$INSPECTOR_DIR/../../../.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
APP_DIR="$SRC_DIR/app"

echo "[UNINSTALL] Select Element Inspector v3.1"
echo "[UNINSTALL] Project root: $PROJECT_ROOT"

# --- 1. Удалить импорт из layout.tsx и page.tsx ---
echo ""
echo "[UNINSTALL] Step 1/4: Removing imports..."

for FILE in "$APP_DIR/layout.tsx" "$APP_DIR/page.tsx"; do
  if [ -f "$FILE" ] && grep -q "SelectElementFab" "$FILE" 2>/dev/null; then
    # Удалить строку импорта
    sed -i "/import.*SelectElementFab.*from.*inspector/d" "$FILE"
    # Удалить JSX-тег (с отступами или без)
    sed -i '/<SelectElementFab/d' "$FILE"
    echo "[OK] Removed from $(basename "$FILE")"
  fi
done

# --- 2. Удалить API-роут ---
echo ""
echo "[UNINSTALL] Step 2/4: Removing API route..."

API_DIR="$APP_DIR/api/source"
if [ -d "$API_DIR" ]; then
  rm -rf "$API_DIR"
  echo "[OK] Removed src/app/api/source/"
else
  echo "[OK] API route not found, skipping"
fi

# Удалить пустой родительский api/source
if [ -d "$APP_DIR/api" ] && [ -z "$(ls -A "$APP_DIR/api" 2>/dev/null)" ]; then
  rmdir "$APP_DIR/api"
  echo "[OK] Removed empty src/app/api/"
fi

# --- 3. Удалить submodule ---
echo ""
echo "[UNINSTALL] Step 3/4: Removing submodule..."

if git -C "$PROJECT_ROOT" submodule status "$INSPECTOR_DIR" &>/dev/null; then
  git -C "$PROJECT_ROOT" submodule deinit -f "src/components/inspector"
  git -C "$PROJECT_ROOT" rm -f "src/components/inspector"
  git -C "$PROJECT_ROOT" rm -f ".gitmodules" 2>/dev/null || true
  rm -rf "$PROJECT_ROOT/.git/modules/src/components/inspector"
  echo "[OK] Submodule removed"
else
  echo "[OK] Not a submodule, removing directory..."
  rm -rf "$INSPECTOR_DIR"
  echo "[OK] Directory removed"
fi

# --- 4. Опционально: framer-motion ---
echo ""
echo "[UNINSTALL] Step 4/4: Dependency cleanup..."

if grep -q '"framer-motion"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
  # Проверить, используется ли framer-motion ещё где-то
  USAGE_COUNT=$(rg -l "framer-motion" "$SRC_DIR" --glob '!*inspector*' 2>/dev/null | wc -l)
  if [ "$USAGE_COUNT" -eq 0 ]; then
    read -p "[?] framer-motion is no longer used. Remove it? [y/N]: " ANSWER
    if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "Y" ]; then
      cd "$PROJECT_ROOT" && bun remove framer-motion
      echo "[OK] framer-motion removed"
    else
      echo "[OK] framer-motion kept (your choice)"
    fi
  else
    echo "[OK] framer-motion is used elsewhere, keeping"
  fi
else
  echo "[OK] framer-motion not in dependencies"
fi

echo ""
echo "============================================"
echo " Select Element Inspector uninstalled!"
echo "============================================"