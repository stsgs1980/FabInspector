import { useState, useCallback, useEffect } from 'react';
import type { ElementInfo, SnippetData, SourceInfo, BoxModel } from './types';
import { isClickInsideInspector } from './use-shadow-root';

function findSource(el: HTMLElement): SourceInfo | null {
  let current: HTMLElement | null = el;
  while (current) {
    const src = current.getAttribute('data-src');
    if (src) {
      const lastColon = src.lastIndexOf(':');
      if (lastColon > 0) {
        return {
          file: src.slice(0, lastColon),
          line: parseInt(src.slice(lastColon + 1), 10) || 1,
        };
      }
      return { file: src, line: 1 };
    }
    current = current.parentElement;
  }
  return null;
}

function getCssPath(el: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += '#' + current.id;
      parts.unshift(selector);
      break;
    }
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => (c as Element).tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }
    parts.unshift(selector);
    current = parent;
  }
  return parts.join(' > ');
}

function getTextForInspector(el: HTMLElement): string {
  const TEXT_TAGS = new Set([
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'BUTTON', 'A', 'LABEL', 'P', 'SPAN', 'LI', 'TD', 'TH', 'DT', 'DD',
  ]);
  if (!TEXT_TAGS.has(el.tagName)) return '';

  // Только прямые текстовые узлы — без содержимого дочерних элементов.
  // Для <span><Icon /> Wiki Codex <em>v2</em></span> вернёт "Wiki Codex",
  // а не "Wiki Codex v2" (как textContent).
  let direct = '';
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      direct += node.textContent;
    }
  }
  const directTrim = direct.trim();

  // Если прямого текста нет (всё во вложенных) — fallback на textContent,
  // чтобы не потерять <button><Icon />Save</button> (там текст прямой,
  // но иногда иконка съедает весь текст).
  const fallback = (el.textContent || '').trim();
  const result = directTrim || fallback;
  return result.slice(0, 120);
}

function getElementInfo(el: HTMLElement): ElementInfo | null {
  const rect = el.getBoundingClientRect();
  const cs = window.getComputedStyle(el);
  if (el.getRootNode() instanceof ShadowRoot) {
    return null;
  }
  if (
    el.closest('[data-se-fab]') ||
    el.closest('[data-se-panel]') ||
    el.closest('[data-se-highlight]')
  ) {
    return null;
  }
  let outerHTML = el.outerHTML;
  if (outerHTML.length > 2000) {
    outerHTML = outerHTML.slice(0, 2000) + '\n  ...';
  }
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || '',
    classes: typeof el.className === 'string' ? el.className : '',
    rect,
    text: getTextForInspector(el),
    outerHTML,
    cssPath: getCssPath(el),
    computedStyles: {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      color: cs.color,
      lineHeight: cs.lineHeight,
      width: `${Math.round(rect.width)}px`,
      height: `${Math.round(rect.height)}px`,
    },
    boxModel: {
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      borderTop: cs.borderTopWidth,
      borderRight: cs.borderRightWidth,
      borderBottom: cs.borderBottomWidth,
      borderLeft: cs.borderLeftWidth,
      width: cs.width,
      height: cs.height,
    },
    source: findSource(el),
  };
}

function computePanelPos(rect: DOMRect): { x: number; y: number } {
  const panelW = 380;
  const panelH = 400;
  let x = rect.right + 8;
  let y = rect.top;
  if (x + panelW > window.innerWidth - 16) {
    x = rect.left - panelW - 8;
  }
  if (x < 8) x = 8;
  if (y + panelH > window.innerHeight - 16) {
    y = window.innerHeight - panelH - 16;
  }
  if (y < 8) y = 8;
  return { x, y };
}

export interface ElementInspectorApi {
  active: boolean;
  elementInfo: ElementInfo | null;
  panelPos: { x: number; y: number };
  setPanelPos: (pos: { x: number; y: number }) => void;
  highlightBox: DOMRect | null;
  snippet: SnippetData | null;
  snippetLoading: boolean;
  toggleActive: () => void;
  closePanel: () => void;
}

export function useElementInspector(): ElementInspectorApi {
  const [active, setActive] = useState(false);
  const [elementInfo, setElementInfo] = useState<ElementInfo | null>(null);
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
  const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);
  const [snippet, setSnippet] = useState<SnippetData | null>(null);
  const [snippetLoading, setSnippetLoading] = useState(false);

  const fetchSnippet = useCallback(async (file: string, line: number) => {
    setSnippetLoading(true);
    setSnippet(null);
    try {
      const res = await fetch(
        `/api/source?file=${encodeURIComponent(file)}&line=${line}&ctx=10`,
      );
      if (res.ok) {
        const data = await res.json();
        setSnippet(data);
      }
    } catch {
      // ignore
    }
    setSnippetLoading(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isClickInsideInspector(e)) {
      setHighlightBox(null);
      return;
    }
    const target = e.target as HTMLElement;
    setHighlightBox(target.getBoundingClientRect());
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (isClickInsideInspector(e)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const info = getElementInfo(target);
      if (info) {
        setElementInfo(info);
        setSnippet(null);
        setPanelPos(computePanelPos(info.rect));
        if (info.source) {
          fetchSnippet(info.source.file, info.source.line);
        }
      }
    },
    [fetchSnippet],
  );

  const handleScroll = useCallback(() => {
    setHighlightBox(null);
  }, []);

  useEffect(() => {
    if (!active) return;
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('scroll', handleScroll, true);
    document.body.style.cursor = 'crosshair';
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('scroll', handleScroll, true);
      document.body.style.cursor = '';
    };
  }, [active, handleMouseMove, handleClick, handleScroll]);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(false);
        setElementInfo(null);
        setHighlightBox(null);
        setSnippet(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active]);

  const toggleActive = useCallback(() => {
    setActive((v) => {
      const next = !v;
      if (!next) {
        setElementInfo(null);
        setHighlightBox(null);
        setSnippet(null);
      }
      return next;
    });
  }, []);

  const closePanel = useCallback(() => {
    setElementInfo(null);
  }, []);

  return {
    active,
    elementInfo,
    panelPos,
    setPanelPos,
    highlightBox,
    snippet,
    snippetLoading,
    toggleActive,
    closePanel,
  };
}