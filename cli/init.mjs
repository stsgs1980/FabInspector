#!/usr/bin/env node
/**
 * @stsgs1980/fab-inspector init
 *
 * Автоподключение инспектора в Next.js App Router проект.
 * Создаёт API-роут /api/source и вставляет импорт + JSX в layout.tsx.
 * Идемпотентно: безопасно запускать многократно.
 *
 * Использование:
 *   npx @stsgs1980/fab-inspector init
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const PKG = '@stsgs1980/fab-inspector';
const IMPORT_LINE = `import { SelectElementFab } from '${PKG}';`;
const ROUTE_REL = 'src/app/api/source/route.ts';
const ROUTE_CONTENT = `// FabInspector source endpoint.
// Handler живёт внутри npm-пакета — этот файл просто реэкспортирует его.
// При обновлении пакета ничего менять тут не надо.
export { GET } from '${PKG}/api/source';
`;

const LAYOUT_CANDIDATES = [
  'src/app/layout.tsx',
  'src/app/layout.ts',
  'src/app/page.tsx',
  'src/app/page.ts',
];

function findLayout(cwd) {
  for (const f of LAYOUT_CANDIDATES) {
    const p = resolve(cwd, f);
    if (existsSync(p)) return p;
  }
  return null;
}

function ensureImport(code) {
  if (code.includes('SelectElementFab')) return { code, added: false };
  const lines = code.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) lastImportIdx = i;
  }
  if (lastImportIdx === -1) {
    return { code: IMPORT_LINE + '\n' + code, added: true };
  }
  lines.splice(lastImportIdx + 1, 0, IMPORT_LINE);
  return { code: lines.join('\n'), added: true };
}

function ensureJsx(code) {
  if (code.includes('<SelectElementFab')) return { code, added: false };

  // </body> — стандартный случай для App Router root layout
  const bodyMatch = code.match(/^(\s*)<\/body>/m);
  if (bodyMatch) {
    const indent = bodyMatch[1];
    const insertion = `${indent}  <SelectElementFab />\n${indent}</body>`;
    return { code: code.replace(/^(\s*)<\/body>/m, insertion), added: true };
  }

  // </html> — если почему-то нет body
  const htmlMatch = code.match(/^(\s*)<\/html>/m);
  if (htmlMatch) {
    const indent = htmlMatch[1];
    const insertion = `${indent}  <SelectElementFab />\n${indent}</html>`;
    return { code: code.replace(/^(\s*)<\/html>/m, insertion), added: true };
  }

  return { code, added: false };
}

function ensureRoute(cwd) {
  const p = resolve(cwd, ROUTE_REL);
  if (existsSync(p)) return false;
  mkdirSync(resolve(cwd, 'src/app/api/source'), { recursive: true });
  writeFileSync(p, ROUTE_CONTENT);
  return true;
}

function detectMissingPeers(cwd) {
  const pkgPath = resolve(cwd, 'package.json');
  if (!existsSync(pkgPath)) return [];
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const peers = ['framer-motion', 'react-syntax-highlighter'];
  return peers.filter((p) => !deps[p]);
}

function detectPackageManager(cwd) {
  if (existsSync(resolve(cwd, 'bun.lockb')) || existsSync(resolve(cwd, 'bun.lock'))) return 'bun';
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function isPackageInstalled(cwd) {
  const pkgPath = resolve(cwd, 'package.json');
  if (!existsSync(pkgPath)) return false;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return PKG in deps;
}

function installPackage(cwd) {
  const pm = detectPackageManager(cwd);
  const cmd = pm === 'npm' ? `npm install ${PKG} -D` : `${pm} add ${PKG} -D`;
  console.log(`  Installing ${PKG}...`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const cwd = process.cwd();
  console.log('');
  console.log('  @stsgs1980/fab-inspector — init');
  console.log('  --------------------------------');

  const layout = findLayout(cwd);
  if (!layout) {
    console.error('  X  No src/app/layout.tsx or src/app/page.tsx found.');
    console.error('     Run from the root of a Next.js App Router project.');
    process.exit(1);
  }

  if (!isPackageInstalled(cwd)) {
    const ok = installPackage(cwd);
    if (!ok) {
      console.error(`  X  Failed to install ${PKG}.`);
      console.error(`     Try manually: bun add ${PKG} -D`);
      process.exit(1);
    }
  }

  const relLayout = layout.replace(cwd + '/', '');
  let code = readFileSync(layout, 'utf-8');

  const importRes = ensureImport(code);
  code = importRes.code;
  const jsxRes = ensureJsx(code);
  code = jsxRes.code;

  if (importRes.added || jsxRes.added) {
    writeFileSync(layout, code);
    console.log(`  +  Updated ${relLayout}`);
  } else {
    console.log(`  ok Already wired: ${relLayout}`);
  }

  const created = ensureRoute(cwd);
  console.log(created
    ? `  +  Created ${ROUTE_REL}`
    : `  ok Already exists: ${ROUTE_REL}`);

  const missing = detectMissingPeers(cwd);
  console.log('');
  if (missing.length) {
    console.log('  !  Peer dependencies missing:');
    missing.forEach((p) => console.log(`        - ${p}`));
    console.log('     Install them:');
    console.log(`        bun add ${missing.join(' ')}`);
    console.log('     (or: npm i ' + missing.join(' ') + ' -D)');
  } else {
    console.log('  ok Peer dependencies installed');
  }

  console.log('');
  console.log('  Start dev server — FAB appears bottom-right.');
  console.log('  Press Esc to close inspector.');
  console.log('');
}

main();
