#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSPECTOR_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(cd "$INSPECTOR_DIR/../../../.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
APP_DIR="$SRC_DIR/app"

echo "[INSTALL] FabInspector v3.2"
echo "[INSTALL] Inspector dir: $INSPECTOR_DIR"
echo "[INSTALL] Project root: $PROJECT_ROOT"

# --- 1. Проверить зависимости ---
echo ""
echo "[INSTALL] Step 1/4: Checking dependencies..."

if ! command -v bun &>/dev/null; then
  echo "[FAIL] bun not found. Install bun first: https://bun.sh"
  exit 1
fi

# Проверить framer-motion
if ! grep -q '"framer-motion"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
  echo "[INSTALL] Installing framer-motion..."
  cd "$PROJECT_ROOT" && bun add framer-motion
  echo "[OK] framer-motion installed"
else
  echo "[OK] framer-motion already installed"
fi

# Проверить react-syntax-highlighter
if ! grep -q '"react-syntax-highlighter"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
  echo "[INSTALL] Installing react-syntax-highlighter..."
  cd "$PROJECT_ROOT" && bun add react-syntax-highlighter
  echo "[OK] react-syntax-highlighter installed"
else
  echo "[OK] react-syntax-highlighter already installed"
fi

# --- 2. Создать API-роут ---
echo ""
echo "[INSTALL] Step 2/4: Setting up API route..."

API_DIR="$APP_DIR/api/source"
mkdir -p "$API_DIR"

if [ -f "$API_DIR/route.ts" ]; then
  echo "[OK] API route already exists at src/app/api/source/route.ts"
else
  cp "$INSPECTOR_DIR/api-source-route.ts" "$API_DIR/route.ts"
  echo "[OK] API route created at src/app/api/source/route.ts"
fi

# --- 3. Добавить импорт в layout или page ---
echo ""
echo "[INSTALL] Step 3/4: Adding import to layout/page..."

IMPORT_LINE="import { SelectElementFab } from '@/components/inspector';"
JSX_LINE="<SelectElementFab />"

# Проверить layout.tsx
LAYOUT="$APP_DIR/layout.tsx"
if [ -f "$LAYOUT" ]; then
  if grep -q "SelectElementFab" "$LAYOUT" 2>/dev/null; then
    echo "[OK] Import already in layout.tsx"
  else
    # Добавить импорт после последнего import
    sed -i "/^import /!b;n;/^$/!{i\\
$IMPORT_LINE
;}" "$LAYOUT" 2>/dev/null || {
      # Fallback: вставить перед 'export default'
      sed -i "/export default/i\\
$IMPORT_LINE\\
" "$LAYOUT"
    }
    # Добавить JSX перед закрывающим </body> или </div> корневого
    if ! grep -q "SelectElementFab" "$LAYOUT"; then
      sed -i 's|</body>|  <SelectElementFab />\n</body>|' "$LAYOUT" 2>/dev/null || \
      sed -i 's|</div>$|  <SelectElementFab />\n  </div>|' "$LAYOUT" 2>/dev/null || \
      echo "[WARN] Could not auto-insert JSX. Add <SelectElementFab /> manually to layout.tsx"
    fi
    echo "[OK] Added to layout.tsx"
  fi
else
  # Нет layout — проверить page.tsx
  PAGE="$APP_DIR/page.tsx"
  if [ -f "$PAGE" ]; then
    if grep -q "SelectElementFab" "$PAGE" 2>/dev/null; then
      echo "[OK] Import already in page.tsx"
    else
      sed -i "/^import /!b;n;/^$/!{i\\
$IMPORT_LINE
;}" "$PAGE" 2>/dev/null || {
      sed -i "/export default/i\\
$IMPORT_LINE\\
" "$PAGE"
    }
    echo "[OK] Added to page.tsx"
    if ! grep -q "SelectElementFab" "$PAGE" 2>/dev/null; then
      echo "[WARN] JSX not auto-inserted. Add <SelectElementFab /> manually."
    fi
  else
    echo "[WARN] No layout.tsx or page.tsx found. Add manually:"
    echo "  import { SelectElementFab } from '@/components/inspector';"
    echo "  <SelectElementFab />"
  fi
fi

# --- 4. Готово ---
echo ""
echo "[INSTALL] Step 4/4: Done!"
echo ""
echo "============================================"
echo " FabInspector v3.2 installed!"
echo "============================================"
echo ""
echo " What was done:"
echo "   - framer-motion dependency checked"
echo "   - react-syntax-highlighter dependency checked"
echo "   - API route: src/app/api/source/route.ts"
echo "   - Import added to your layout/page"
echo ""
echo " The FAB button (bottom-right) appears in dev mode."
echo " Press Esc to close inspector."
echo "============================================"