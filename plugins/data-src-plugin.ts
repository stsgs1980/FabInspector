/**
 * data-src Injector Plugin for Turbopack (Next.js 15.3+)
 *
 * Автоматически добавляет data-src="file:line" атрибут на JSX-элементы.
 *
 * Подключение в next.config.ts:
 *   import { dataSrcPlugin } from './src/components/inspector/plugins/data-src-plugin';
 *
 *   const nextConfig = {
 *     experimental: {
 *       turbo: {
 *         plugins: [dataSrcPlugin()],
 *       },
 *     },
 *   };
 *
 * Пропускает: node_modules, inspector/, строки с комментариями и декларациями.
 * Только dev-режим (Next.js не вызывает turbo plugins в production build).
 *
 * ⚠️  API экспериментальное и может измениться в следующих версиях Next.js.
 *     При проблемах — добавляйте data-src вручную.
 */

type TransformResult = { code: string };

export const dataSrcPlugin = () => ({
  name: 'data-src-injector',

  setup(api: {
    transform: (
      opts: { filter: RegExp },
      handler: (args: { code: string; resource: string }) => TransformResult,
    ) => void;
  }) {
    api.transform({ filter: /\.(tsx|jsx)$/ }, ({ code, resource }) => {
      if (
        resource.includes('node_modules') ||
        resource.includes('/inspector/')
      ) {
        return { code };
      }
      return injectDataSrc(code, resource);
    });
  },
});

function injectDataSrc(code: string, resource: string): TransformResult {
  const lines = code.split('\n');
  const relativePath = toRelativePath(resource);
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (isJsxOpeningTag(line) && !hasDataSrc(line)) {
      result.push(injectOnLine(line, relativePath, lineNum));
    } else {
      result.push(line);
    }
  }

  return { code: result.join('\n') };
}

function injectOnLine(line: string, path: string, lineNum: number): string {
  const attr = ` data-src="${path}:${lineNum}"`;
  return line.replace(
    /(<[A-Za-z][A-Za-z0-9-]*)(\s|>)/,
    (_match, tag: string, after: string) => {
      if (after === '>') return `${tag}${attr}>`;
      return `${tag}${attr} `;
    },
  );
}

function isJsxOpeningTag(line: string): boolean {
  const t = line.trimStart();
  if (
    t.startsWith('//') ||
    t.startsWith('*') ||
    t.startsWith('/*') ||
    t.startsWith('import ') ||
    t.startsWith('export ') ||
    t.startsWith('type ') ||
    t.startsWith('interface ') ||
    t.startsWith('function ') ||
    t.startsWith('const ') ||
    t.startsWith('let ') ||
    t.startsWith('var ') ||
    t.startsWith('{') ||
    t.startsWith('}') ||
    t.startsWith('return ') ||
    t.startsWith('if ') ||
    t.startsWith('else')
  ) {
    return false;
  }
  return /<[A-Za-z][A-Za-z0-9-]*[\s>]/.test(t);
}

function hasDataSrc(line: string): boolean {
  return /data-src\s*=/.test(line);
}

function toRelativePath(resource: string): string {
  const idx = resource.indexOf('/src/');
  if (idx !== -1) return resource.slice(idx + 1);
  return resource.split('/').pop() || resource;
}