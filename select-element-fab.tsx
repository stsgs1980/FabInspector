'use client';

import { AnimatePresence } from 'framer-motion';
import { useElementInspector } from './use-element-inspector';
import { usePanelDrag } from './use-panel-drag';
import { HighlightOverlay } from './highlight-overlay';
import { InspectorPanel } from './inspector-panel';
import { InspectorFab } from './inspector-fab';

export function SelectElementFab() {
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

  return (
    <>
      {active && highlightBox && <HighlightOverlay highlightBox={highlightBox} />}

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
    </>
  );
}