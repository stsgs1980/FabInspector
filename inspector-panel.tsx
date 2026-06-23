import { motion } from 'framer-motion';
import type { ElementInfo, SnippetData } from './types';
import {
  SourceSection,
  ClassesSection,
  TextSection,
  CssPathSection,
  HtmlSection,
  StylesSection,
  SnippetSection,
} from './panel-sections';

export function InspectorPanel({
  elementInfo,
  panelPos,
  isDragging,
  onDragStart,
  onClose,
  snippet,
  snippetLoading,
}: {
  elementInfo: ElementInfo;
  panelPos: { x: number; y: number };
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onClose: () => void;
  snippet: SnippetData | null;
  snippetLoading: boolean;
}) {
  return (
    <motion.div
      ref={(node) => {
        if (node) {
          (node as unknown as HTMLElement).setAttribute('data-se-panel', '');
        }
      }}
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.15 }}
      className={`fixed z-[95] bg-white rounded-xl shadow-xl border border-[#E5E7EB] overflow-hidden${isDragging ? '' : ' cursor-default'}`}
      style={{
        top: panelPos.y,
        left: panelPos.x,
        width: 380,
        maxHeight: 'calc(100vh - 32px)',
        userSelect: isDragging ? 'none' : 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header (drag handle) */}
      <div
        onMouseDown={onDragStart}
        className={`flex items-center justify-between px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB] select-none${isDragging ? ' cursor-grabbing' : ' cursor-grab'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#6366F1] text-white text-[10px] font-bold flex-shrink-0">
            &lt;/&gt;
          </span>
          <span className="text-sm font-semibold text-[#1A1F36] truncate">
            {elementInfo.tag}
            {elementInfo.id && <span className="text-[#6366F1]">#{elementInfo.id}</span>}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {elementInfo.source && (
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(`${elementInfo.source!.file}:${elementInfo.source!.line}`)
                  .catch(() => {})
              }
              className="p-1 rounded hover:bg-[#E5E7EB] transition-colors cursor-pointer"
              aria-label="Копировать путь к файлу"
              title="Копировать путь"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#E5E7EB] transition-colors cursor-pointer"
            aria-label="Закрыть панель"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {elementInfo.source && <SourceSection source={elementInfo.source} />}
        {elementInfo.classes && <ClassesSection classes={elementInfo.classes} />}
        {elementInfo.text && <TextSection text={elementInfo.text} />}
        {elementInfo.cssPath && <CssPathSection cssPath={elementInfo.cssPath} />}
        <HtmlSection outerHTML={elementInfo.outerHTML} />
        <StylesSection styles={elementInfo.computedStyles} />
        {elementInfo.source && (
          <SnippetSection source={elementInfo.source} snippet={snippet} snippetLoading={snippetLoading} />
        )}
      </div>
    </motion.div>
  );
}