export interface SourceInfo {
  file: string;
  line: number;
}

export interface ElementInfo {
  tag: string;
  id: string;
  classes: string;
  rect: DOMRect;
  text: string;
  outerHTML: string;
  cssPath: string;
  computedStyles: Record<string, string>;
  source: SourceInfo | null;
}

export interface SnippetData {
  file: string;
  line: number;
  totalLines: number;
  snippet: {
    startLine: number;
    lines: string[];
    highlightLine: number;
  };
}