import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { BoxModelSection } from './box-model-section';

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
  const [expanded, setExpanded] = useState(false);

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
      className={`fixed z-[95] bg-[#161B22] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#30363D] overflow-hidden${isDragging ? '' : ' cursor-default'}`}
      style={{
        top: panelPos.y,
        left: panelPos.x,
        width: 400,
        maxHeight: 'calc(100vh - 32px)',
        userSelect: isDragging ? 'none' : 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header (drag handle) */}
      <div
        onMouseDown={onDragStart}
        className={`flex items-center justify-between px-4 py-2.5 bg-[#1C2128] border-b border-[#30363D] select-none${isDragging ? ' cursor-grabbing' : ' cursor-grab'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#1F6FEB] text-[#F0F6FC] text-[10px] font-bold flex-shrink-0">
            &lt;/&gt;
          </span>
          <span className="text-sm font-semibold text-[#E6EDF3] truncate">
            {elementInfo.tag}
            {elementInfo.id && <span className="text-[#58A6FF]">#{elementInfo.id}</span>}
          </span>
          {elementInfo.source && (
            <span className="text-[11px] text-[#6E7681] font-mono truncate hidden sm:inline">
              {elementInfo.source.file.split('/').pop()}:{elementInfo.source.line}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {elementInfo.source && (
            <button
              onClick={() => {
                const lines = [
                  elementInfo.source ? `File: ${elementInfo.source.file}:${elementInfo.source.line}` : '',
                  `Tag: <${elementInfo.tag}${elementInfo.id ? `#${elementInfo.id}` : ''}>`,
                  elementInfo.text ? `Text: "${elementInfo.text}"` : '',
                ].filter(Boolean).join('\n');
                navigator.clipboard.writeText(lines).catch(() => {});
              }}
              className="p-1.5 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-[#58A6FF] transition-colors cursor-pointer"
              aria-label="Copy task context"
              title="Copy task context (file, tag, text)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </button>
          )}
          {elementInfo.source && (
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(`${elementInfo.source!.file}:${elementInfo.source!.line}`)
                  .catch(() => {})
              }
              className="p-1.5 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-[#58A6FF] transition-colors cursor-pointer"
              aria-label="Copy file path"
              title="Copy file:line"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
          )}
          {/* Always-visible quick copy: tag + id + classes + text.
              Работает без data-src — можно скопировать базу из свёрнутой панели. */}
          <button
            onClick={() => {
              const parts = [
                `<${elementInfo.tag}${elementInfo.id ? `#${elementInfo.id}` : ''}>`,
                elementInfo.classes ? elementInfo.classes : '',
                elementInfo.text ? `"${elementInfo.text}"` : '',
              ].filter(Boolean);
              navigator.clipboard.writeText(parts.join('\n')).catch(() => {});
            }}
            className="p-1.5 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-[#58A6FF] transition-colors cursor-pointer"
            aria-label="Скопировать информацию об элементе"
            title="Копировать (тег + классы + текст)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </button>
          <div className="w-px h-4 bg-[#30363D] mx-0.5" />
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer"
            aria-label={expanded ? 'Свернуть детали' : 'Развернуть детали'}
            title={expanded ? 'Свернуть' : 'Детали'}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#DA3633]/20 text-[#8B949E] hover:text-[#F85149] transition-colors cursor-pointer"
            aria-label="Закрыть панель"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              {elementInfo.source && <SourceSection source={elementInfo.source} />}
              {elementInfo.classes && <ClassesSection classes={elementInfo.classes} />}
              {elementInfo.text && <TextSection text={elementInfo.text} />}
              {elementInfo.cssPath && <CssPathSection cssPath={elementInfo.cssPath} />}
              <HtmlSection outerHTML={elementInfo.outerHTML} />
              <StylesSection styles={elementInfo.computedStyles} />
              {elementInfo.boxModel && <BoxModelSection boxModel={elementInfo.boxModel} />}
              {elementInfo.source && (
                <SnippetSection source={elementInfo.source} snippet={snippet} snippetLoading={snippetLoading} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}