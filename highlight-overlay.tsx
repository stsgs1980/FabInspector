export function HighlightOverlay({
  highlightBox,
}: {
  highlightBox: DOMRect;
}) {
  return (
    <div
      data-se-highlight
      className="fixed pointer-events-none z-[90]"
      style={{
        top: highlightBox.top,
        left: highlightBox.left,
        width: highlightBox.width,
        height: highlightBox.height,
        border: '1px dashed #6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.06)',
        borderRadius: '4px',
        transition: 'all 0.1s ease-out',
      }}
      aria-hidden="true"
    />
  );
}