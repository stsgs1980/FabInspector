export interface SourceInfo {
  file: string;
  line: number;
}

export interface BoxModel {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
  width: string;
  height: string;
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
  boxModel: BoxModel | null;
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