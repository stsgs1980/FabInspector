# FabInspector

Visual element inspector for Next.js dev mode. Floating FAB button with a draggable panel in GitHub Dark Theme, syntax highlighting, and box-model visualization.

[![npm version](https://img.shields.io/npm/v/@stsgs1980/fab-inspector?style=flat-square&logo=npm)](https://www.npmjs.com/package/@stsgs1980/fab-inspector)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Click any DOM element to inspect: source file + line, CSS classes, text, CSS path, HTML code
- Computed styles display (size, font, color)
- Box Model visualization (margin / border / padding / content)
- Source code snippet with syntax highlighting
- Copy task context: structured prompt (file + tag + text)
- Copy file:line to clipboard
- Quick-copy in collapsed panel (tag + classes + text)
- Panel collapsed by default, expands on chevron click, draggable by header
- Esc to close inspector
- Dev-only guard: component returns null in production
- Zero runtime footprint: `sideEffects: false` for tree-shaking

## Tech Stack

- **Framework** - Next.js 15+
- **Language** - TypeScript
- **UI** - React 19
- **Animation** - Framer Motion
- **Highlighting** - react-syntax-highlighter

## Getting Started

### Prerequisites

- Next.js 15+
- React 19+
- Bun

### Installation

```bash
bun add @stsgs1980/fab-inspector -D
```

Peer dependencies (if not already installed):

```bash
bun add framer-motion react-syntax-highlighter
```

### Setup (one command)

```bash
npx @stsgs1980/fab-inspector init
```

CLI automatically:
- Creates `src/app/api/source/route.ts` (re-exports GET from package)
- Adds `import { SelectElementFab } from '@stsgs1980/fab-inspector'` to `src/app/layout.tsx`
- Inserts `<SelectElementFab />` before `</body>`
- Checks peer dependencies

Idempotent -- safe to run multiple times.

### Manual Setup

```tsx
// src/app/layout.tsx:
import { SelectElementFab } from '@stsgs1980/fab-inspector';
// In JSX before </body>:
<SelectElementFab />
```

```ts
// src/app/api/source/route.ts:
export { GET } from '@stsgs1980/fab-inspector/api/source';
```

### Update

```bash
bun update @stsgs1980/fab-inspector
```

## Usage

### Inspection Mode

- FAB button in the bottom-right corner enables inspection mode
- Click an element to show collapsed panel (tag, ID, file:line)
- Chevron expands all sections
- Esc closes inspector
- Panel is draggable by header

### Panel Buttons

| Button | Action | Works without `data-src` |
|--------|--------|--------------------------|
| Document | Copy task context (file, tag, text) | no |
| Two rectangles | Copy file:line | no |
| Copy | Quick-copy (tag + classes + text) | **yes** |
| Chevron | Collapse / expand sections | yes |
| x | Close panel | yes |

### data-src Attribute

Add `data-src` to JSX elements for source display:

```tsx
<h1 data-src="src/components/sections/hero.tsx:12">Heading</h1>
```

Inspector walks up the DOM tree to find the nearest `data-src`.

> **Next.js 16 note:** Auto-injection of `data-src` via Turbopack plugin no longer works in Next.js 16 (the `experimental.turbo.plugins` API was removed). Add `data-src` manually to key elements. SWC plugin for auto-annotation is planned.

## Configuration

### Peer Dependencies

| Package | Version |
|---------|---------|
| `framer-motion` | >= 11.0 |
| `react-syntax-highlighter` | >= 15.0 |
| `next` | >= 15.0 |
| `react` | >= 19.0 |

### Production Safety

- Package installed in `devDependencies` -- not included in production bundle
- `SelectElementFab` has dev-only guard: `if (process.env.NODE_ENV !== 'development') return null`
- `sideEffects: false` -- tree-shaking removes unused code

### Build (v3.5.0+)

Since v3.5.0 the package is published **compiled** (`dist/` -- ESM `.js` + `.d.ts` + sourcemaps), not raw `.ts`/`.tsx`:

- No `transpilePackages` needed in `next.config.ts` -- works out of the box
- No TypeScript needed on consumer side for runtime
- TypeScript types load automatically via `exports[].types`

Build from source (for contributors):

```bash
git clone https://github.com/stsgs1980/FabInspector.git
cd FabInspector/src/components/inspector
bun run build
```

### API Route `/api/source`

Created automatically by CLI `init`. Accepts `file`, `line`, `ctx` (context lines). File is validated against a directory whitelist (`src/components/`, `src/app/`, `src/content/`, `src/hooks/`, `src/lib/`).

## Project Structure

- `index.ts` - Barrel export
- `types.ts` - Interfaces (ElementInfo, SourceInfo, BoxModel, SnippetData)
- `select-element-fab.tsx` - Root composer
- `inspector-fab.tsx` - FAB button
- `inspector-panel.tsx` - Draggable collapsible panel
- `highlight-overlay.tsx` - Element highlight
- `panel-sections.tsx` - Panel sections (Source, Classes, Text, CSS Path, HTML, Styles, Snippet)
- `box-model-section.tsx` - Box Model diagram
- `use-element-inspector.ts` - Inspection hook
- `use-panel-drag.ts` - Drag hook
- `api-source-route.ts` - GET handler for `/api/source`
- `plugins/data-src-plugin.ts` - Turbopack plugin (Next.js 15.3+, auto-data-src)
- `cli/init.mjs` - CLI `npx @stsgs1980/fab-inspector init`
- `tsconfig.build.json` - Build config for `dist/`

## License

[MIT](LICENSE)

---
Built with: Next.js + React + TypeScript + Framer Motion