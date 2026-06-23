/**
 * data-src Injector Plugin
 *
 * Автоматически добавляет data-src атрибут на JSX-элементы
 * с указанием файла исходника и номера строки.
 *
 * Формат: data-src="src/components/sections/hero.tsx:12"
 *
 * Подключение в next.config.ts:
 *   experimental: { turbo: { plugins: [dataSrcPlugin()] } }
 */

type TransformResult = { code: string };

/**
 * Создаёт экземпляр плагина для Turbopack / Rsbuild.
 * Только в dev-режиме (Next.js не вызывает плагины в production build).
 */
export const dataSrcPlugin = () => ({
  name: 'data-src-injector',

  setup(api: { transform: (opts: { filter: RegExp }, handler: (args: { code: string; resource: string }) => TransformResult) => void }) {
    api.transform({ filter: /\.(tsx|jsx)$/ }, ({ code, resource }) => {
      if (resource.includes('node_modules') || resource.includes('/inspector/')) {
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

/**
 * Вставляет data-src после имени тега.
 * Ищет <TagName за которым идёт пробел, > или >
 */
function injectOnLine(line: string, path: string, lineNum: number): string {
  const attr = ` data-src="${path}:${lineNum}"`;
  // Совпадаем: <TagName<space> или <TagName> (self-closing или открывающий)
  return line.replace(
    /(<[A-Za-z][A-Za-z0-9-]*)(\s|>)/,
    (match, tag, after) => {
      if (after === '>') {
        return `${tag}${attr}>`;
      }
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
    t.startsWith('var ')
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
  if (idx !== -1) {
    return resource.slice(idx + 1);
  }
  return resource.split('/').pop() || resource;
}