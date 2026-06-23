import { useState, useCallback, useRef } from 'react';

export function usePanelDrag(
  panelPos: { x: number; y: number },
  setPanelPos: (pos: { x: number; y: number }) => void,
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: panelPos.x,
        startTop: panelPos.y,
      };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        setPanelPos({
          x: Math.max(0, Math.min(window.innerWidth - 396, dragRef.current.startLeft + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 48, dragRef.current.startTop + dy)),
        });
      };
      const onUp = () => {
        setIsDragging(false);
        dragRef.current = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [panelPos, setPanelPos],
  );

  return { isDragging, handleDragStart };
}