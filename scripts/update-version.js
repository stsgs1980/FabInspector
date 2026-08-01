import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const versionPath = path.join(root, 'version.ts');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const content = `export const VERSION = '${pkg.version}'\n`;

fs.writeFileSync(versionPath, content);
console.log(`Updated version.ts to ${pkg.version}`);
