'use client';

import { AnimatePresence } from 'framer-motion';
import { useElementInspector } from './use-element-inspector';
import { usePanelDrag } from './use-panel-drag';
import { HighlightOverlay } from './highlight-overlay';
import { InspectorPanel } from './inspector-panel';
import { InspectorFab } from './inspector-fab';
import { useShadowRoot } from './use-shadow-root';

// Dev-only guard: FAB не должен попасть в production-bundle.
// Это страховка на случай, если потребитель забыл поставить пакет
// в devDependencies или не убрал импорт из layout для прод-сборки.
// В проде next/build подставляет NODE_ENV=production и tree-shaking
// вырезает весь модуль целиком (sideEffects: false в package.json).
const IS_DEV = process.env.NODE_ENV === 'development';

export function SelectElementFab(): React.ReactElement | null {
  const {
    active,
    elementInfo,
    panelPos,
    setPanelPos,
    highlightBox,
    snippet,
    snippetLoading,
    toggleActive,
    closePanel,
  } = useElementInspector();

  const { isDragging, handleDragStart } = usePanelDrag(panelPos, setPanelPos);

  const shadowContent = useShadowRoot(
    <>
      <AnimatePresence>
        {active && elementInfo && (
          <InspectorPanel
            elementInfo={elementInfo}
            panelPos={panelPos}
            isDragging={isDragging}
            onDragStart={handleDragStart}
            onClose={closePanel}
            snippet={snippet}
            snippetLoading={snippetLoading}
          />
        )}
      </AnimatePresence>

      <InspectorFab
        active={active}
        onToggle={toggleActive}
        showTooltip={active && !elementInfo}
      />
    </>,
  );

  if (!IS_DEV) return null;

  return (
    <>
      {active && highlightBox && <HighlightOverlay highlightBox={highlightBox} />}
      {shadowContent}
    </>
  );
}