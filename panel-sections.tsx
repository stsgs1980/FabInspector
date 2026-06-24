import type { ElementInfo, SnippetData } from './types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CopyButton({ text, label }: { text: string; label?: string }): React.ReactElement {
  const copy = (): Promise<void> => navigator.clipboard.writeText(text).catch(() => {});
  return (
    <button
      onClick={copy}
      className="text-[10px] text-[#58A6FF] hover:text-[#79C0FF] transition-colors cursor-pointer"
      title={label ?? 'Копировать'}
    >
      {label ?? 'копировать'}
    </button>
  );
}

export function SourceSection({ source }: { source: NonNullable<ElementInfo['source']> }): React.ReactElement {
  const copy = (): Promise<void> =>
    navigator.clipboard.writeText(`${source.file}:${source.line}`).catch(() => {});
  return (
    <div className="px-4 py-2.5 bg-[#0D1117] border-b border-[#30363D]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#58A6FF] uppercase tracking-wider">
          Источник
        </div>
        <CopyButton text={`${source.file}:${source.line}`} />
      </div>
      <div
        className="font-mono text-xs text-[#E6EDF3] cursor-pointer hover:text-[#58A6FF] transition-colors break-all"
        onClick={copy}
        title="Кликните, чтобы скопировать"
      >
        {source.file}
        <span className="text-[#58A6FF]">:{source.line}</span>
      </div>
    </div>
  );
}

export function ClassesSection({ classes }: { classes: string }): React.ReactElement {
  const copy = (): Promise<void> => navigator.clipboard.writeText(classes).catch(() => {});
  return (
    <div className="px-4 py-2.5 border-b border-[#30363D]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider">Classes</div>
        <CopyButton text={classes} />
      </div>
      <div
        className="font-mono text-xs text-[#E6EDF3] bg-[#0D1117] rounded px-2.5 py-1.5 break-all cursor-pointer hover:bg-[#161B22] transition-colors border border-[#30363D]"
        onClick={copy}
        title="Кликните, чтобы скопировать"
      >
        {classes.length > 300 ? classes.slice(0, 300) + '...' : classes}
      </div>
    </div>
  );
}

export function TextSection({ text }: { text: string }): React.ReactElement {
  const copy = (): Promise<void> => navigator.clipboard.writeText(text).catch(() => {});
  return (
    <div className="px-4 py-2.5 border-b border-[#30363D]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider">Text</div>
        <CopyButton text={text} />
      </div>
      <div
        className="text-xs text-[#E6EDF3] bg-[#0D1117] rounded px-2.5 py-1.5 cursor-pointer hover:bg-[#161B22] transition-colors border border-[#30363D]"
        onClick={copy}
        title="Кликните, чтобы скопировать текст"
      >
        {text}
      </div>
    </div>
  );
}

export function CssPathSection({ cssPath }: { cssPath: string }): React.ReactElement {
  return (
    <div className="px-4 py-2.5 border-b border-[#30363D]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider">CSS Path</div>
        <CopyButton text={cssPath} />
      </div>
      <div
        className="font-mono text-[11px] text-[#E6EDF3] bg-[#0D1117] rounded px-2.5 py-1.5 break-all cursor-pointer hover:bg-[#161B22] transition-colors border border-[#30363D]"
        onClick={() => navigator.clipboard.writeText(cssPath).catch(() => {})}
        title="Кликните, чтобы скопировать CSS-путь"
      >
        {cssPath}
      </div>
    </div>
  );
}

export function HtmlSection({ outerHTML }: { outerHTML: string }): React.ReactElement {
  return (
    <div className="px-4 py-2.5 border-b border-[#30363D]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider">HTML</div>
        <CopyButton text={outerHTML} />
      </div>
      <pre
        className="font-mono text-[11px] text-[#E6EDF3] bg-[#0D1117] rounded px-2.5 py-1.5 overflow-x-auto whitespace-pre-wrap break-all cursor-pointer hover:bg-[#161B22] transition-colors max-h-40 border border-[#30363D]"
        onClick={() => navigator.clipboard.writeText(outerHTML).catch(() => {})}
        title="Кликните, чтобы скопировать HTML"
      >
        {outerHTML}
      </pre>
    </div>
  );
}

export function StylesSection({ styles }: { styles: Record<string, string> }): React.ReactElement {
  return (
    <div className="px-4 py-2.5 border-b border-[#30363D]">
      <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
        Styles
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-[#0D1117] rounded px-2 py-1 text-[11px] font-mono text-[#E6EDF3] border border-[#30363D]">
          {styles.width} x {styles.height}
        </div>
        <div className="bg-[#0D1117] rounded px-2 py-1 text-[11px] font-mono text-[#E6EDF3] border border-[#30363D]">
          {styles.fontSize}
        </div>
        <div className="bg-[#0D1117] rounded px-2 py-1 text-[11px] font-mono text-[#E6EDF3] border border-[#30363D]">
          weight: {styles.fontWeight}
        </div>
        <div className="bg-[#0D1117] rounded px-2 py-1 text-[11px] font-mono text-[#E6EDF3] border border-[#30363D]">
          lh: {styles.lineHeight}
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 bg-[#0D1117] rounded px-2 py-1 text-[11px] font-mono text-[#E6EDF3] border border-[#30363D]">
        <span
          className="inline-block w-3 h-3 rounded-sm border border-[#30363D] flex-shrink-0"
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
}): React.ReactElement {
  const ext = source.file.split('.').pop() || '';
  const lang = ['tsx', 'jsx'].includes(ext) ? 'tsx' : 'typescript';

  return (
    <div className="px-4 py-2.5">
      <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
        Код ({source.file.split('/').pop()})
      </div>
      {snippetLoading && <div className="text-xs text-[#6E7681] py-2">Загрузка...</div>}
      {snippet && (
        <div className="bg-[#0D1117] rounded-md overflow-hidden border border-[#30363D]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[#30363D]">
            <span className="text-[#6E7681] text-[10px] font-mono">
              {snippet.snippet.startLine}–{snippet.snippet.startLine + snippet.snippet.lines.length - 1} из {snippet.totalLines}
            </span>
            <CopyButton text={snippet.snippet.lines.join('\n')} label="копировать" />
          </div>
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            showLineNumbers
            startingLineNumber={snippet.snippet.startLine}
            lineProps={(lineNumber) => ({
              style: lineNumber === snippet.snippet.highlightLine
                ? { background: 'rgba(56, 139, 253, 0.15)', display: 'block' }
                : { display: 'block' },
            })}
            customStyle={{
              background: 'transparent',
              padding: '8px',
              margin: 0,
              fontSize: '12px',
              lineHeight: '1.6',
            }}
            lineNumberStyle={{
              color: '#484F58',
              minWidth: '2.5em',
              paddingRight: '1em',
            }}
            codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' } }}
          >
            {snippet.snippet.lines.join('\n')}
          </SyntaxHighlighter>
        </div>
      )}
      {!snippetLoading && !snippet && (
        <div className="text-xs text-[#6E7681] py-2">
          Не удалось загрузить исходный код (только в dev-режиме)
        </div>
      )}
    </div>
  );
}