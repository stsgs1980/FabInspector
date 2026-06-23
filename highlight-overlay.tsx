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
        border: '1px dashed #58A6FF',
        backgroundColor: 'rgba(56, 139, 253, 0.06)',
        borderRadius: '3px',
        transition: 'all 0.1s ease-out',
      }}
      aria-hidden="true"
    />
  );
}