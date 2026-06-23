import type { ElementInfo, SnippetData } from './types';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const copy = () => navigator.clipboard.writeText(text).catch(() => {});
  return (
    <button
      onClick={copy}
      className="text-[10px] text-[#6366F1] hover:text-[#4F46E5] transition-colors cursor-pointer"
      title={label ?? 'Копировать'}
    >
      {label ?? 'копировать'}
    </button>
  );
}

export function SourceSection({ source }: { source: NonNullable<ElementInfo['source']> }) {
  const copy = () =>
    navigator.clipboard.writeText(`${source.file}:${source.line}`).catch(() => {});
  return (
    <div className="px-4 py-2.5 bg-[#EEF2FF] border-b border-[#C7D2FE]">
      <div className="text-[11px] font-semibold text-[#6366F1] uppercase tracking-wider mb-1">
        Источник
      </div>
      <div
        className="font-mono text-xs text-[#1A1F36] cursor-pointer hover:text-[#6366F1] transition-colors break-all"
        onClick={copy}
        title="Кликните, чтобы скопировать"
      >
        {source.file}
        <span className="text-[#6366F1]">:{source.line}</span>
      </div>
    </div>
  );
}

export function ClassesSection({ classes }: { classes: string }) {
  const copy = () => navigator.clipboard.writeText(classes).catch(() => {});
  return (
    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
      <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
        Classes
      </div>
      <div
        className="font-mono text-xs text-[#374151] bg-[#F9FAFB] rounded px-2.5 py-1.5 break-all cursor-pointer hover:bg-[#EEF2FF] transition-colors"
        onClick={copy}
        title="Кликните, чтобы скопировать"
      >
        {classes.length > 300 ? classes.slice(0, 300) + '...' : classes}
      </div>
    </div>
  );
}

export function TextSection({ text }: { text: string }) {
  const copy = () => navigator.clipboard.writeText(text).catch(() => {});
  return (
    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Text</div>
        <CopyButton text={text} />
      </div>
      <div
        className="text-xs text-[#374151] bg-[#F9FAFB] rounded px-2.5 py-1.5 cursor-pointer hover:bg-[#EEF2FF] transition-colors"
        onClick={copy}
        title="Кликните, чтобы скопировать текст"
      >
        {text}
      </div>
    </div>
  );
}

export function CssPathSection({ cssPath }: { cssPath: string }) {
  return (
    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">CSS Path</div>
        <CopyButton text={cssPath} />
      </div>
      <div
        className="font-mono text-[11px] text-[#374151] bg-[#F9FAFB] rounded px-2.5 py-1.5 break-all cursor-pointer hover:bg-[#EEF2FF] transition-colors"
        onClick={() => navigator.clipboard.writeText(cssPath).catch(() => {})}
        title="Кликните, чтобы скопировать CSS-путь"
      >
        {cssPath}
      </div>
    </div>
  );
}

export function HtmlSection({ outerHTML }: { outerHTML: string }) {
  return (
    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">HTML</div>
        <CopyButton text={outerHTML} />
      </div>
      <pre
        className="font-mono text-[11px] text-[#374151] bg-[#F9FAFB] rounded px-2.5 py-1.5 overflow-x-auto whitespace-pre-wrap break-all cursor-pointer hover:bg-[#EEF2FF] transition-colors max-h-40"
        onClick={() => navigator.clipboard.writeText(outerHTML).catch(() => {})}
        title="Кликните, чтобы скопировать HTML"
      >
        {outerHTML}
      </pre>
    </div>
  );
}

export function StylesSection({ styles }: { styles: Record<string, string> }) {
  return (
    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
      <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
        Styles
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-[#F9FAFB] rounded px-2 py-1 text-[11px] font-mono text-[#374151]">
          {styles.width} x {styles.height}
        </div>
        <div className="bg-[#F9FAFB] rounded px-2 py-1 text-[11px] font-mono text-[#374151]">
          {styles.fontSize}
        </div>
        <div className="bg-[#F9FAFB] rounded px-2 py-1 text-[11px] font-mono text-[#374151]">
          weight: {styles.fontWeight}
        </div>
        <div className="bg-[#F9FAFB] rounded px-2 py-1 text-[11px] font-mono text-[#374151]">
          lh: {styles.lineHeight}
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 bg-[#F9FAFB] rounded px-2 py-1 text-[11px] font-mono text-[#374151]">
        <span
          className="inline-block w-3 h-3 rounded-sm border border-[#E5E7EB] flex-shrink-0"
          style={{ backgroundColor: styles.color }}
        />
        {styles.color}
      </div>
    </div>
  );
}

export function SnippetSection({
  source,
  snippet,
  snippetLoading,
}: {
  source: NonNullable<ElementInfo['source']>;
  snippet: SnippetData | null;
  snippetLoading: boolean;
}) {
  return (
    <div className="px-4 py-2.5">
      <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
        Код ({source.file.split('/').pop()})
      </div>
      {snippetLoading && <div className="text-xs text-[#9CA3AF] py-2">Загрузка...</div>}
      {snippet && (
        <div className="bg-[#0F172A] rounded-lg overflow-hidden text-[12px] font-mono leading-[1.6]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.06] border-b border-white/[0.08]">
            <span className="text-white/40 text-[10px]">
              строки {snippet.snippet.startLine}-{snippet.snippet.startLine + snippet.snippet.lines.length - 1} из{' '}
              {snippet.totalLines}
            </span>
            <CopyButton text={snippet.snippet.lines.join('\n')} label="копировать" />
          </div>
          <div className="p-2 overflow-x-auto">
            {snippet.snippet.lines.map((line, i) => {
              const lineNum = snippet.snippet.startLine + i;
              const isHighlight = lineNum === snippet.snippet.highlightLine;
              return (
                <div
                  key={i}
                  className="flex"
                  style={{ backgroundColor: isHighlight ? 'rgba(99,102,241,0.15)' : 'transparent' }}
                >
                  <span
                    className="inline-block w-8 flex-shrink-0 text-right mr-3 text-white/25 select-none text-[10px]"
                    style={{ color: isHighlight ? '#93C5FD' : undefined }}
                  >
                    {lineNum}
                  </span>
                  <span
                    className="whitespace-pre text-white/80"
                    style={{ color: isHighlight ? '#E5E7EB' : undefined }}
                  >
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!snippetLoading && !snippet && (
        <div className="text-xs text-[#9CA3AF] py-2">
          Не удалось загрузить исходный код (только в dev-режиме)
        </div>
      )}
    </div>
  );
}