# FabInspector

Визуальный инспектор элементов для Next.js dev mode. Плавающая FAB-кнопка с draggable панелью в GitHub Dark Theme, подсветкой синтаксиса и box-model визуализацией.

![npm version](https://img.shields.io/npm/v/@stsgs1980/fab-inspector?style=flat-square&logo=npm)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Next.js 15+](https://img.shields.io/badge/Next.js-15%2B-000000?style=flat-square&logo=nextdotjs)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Что делает

При клике на любой DOM-элемент показывает:

- Источник: файл и строка через `data-src` атрибут
- CSS-классы, текст, CSS Path, HTML-код
- Вычисленные стили (размер, шрифт, цвет)
- Box Model: визуальная схема margin / border / padding / content
- Сниппет исходного кода с подсветкой синтаксиса
- Copy task context: структурированный промпт (файл + тег + текст)
- Copy file:line в буфер обмена
- Quick-copy в свёрнутой панели (тег + классы + текст)

Панель по умолчанию свёрнута (только заголовок), раскрывается по клику на шеврон. Перетаскивается за заголовок.

## Установка

### npm / bun

```bash
bun add @stsgs1980/fab-inspector -D
# или
npm install @stsgs1980/fab-inspector -D
```

Peer dependencies (если ещё не стоят):

```bash
bun add framer-motion react-syntax-highlighter
```

### Подключение (одна команда)

```bash
npx @stsgs1980/fab-inspector init
```

CLI автоматически:
- Создаёт `src/app/api/source/route.ts` (re-export GET из пакета)
- Добавляет `import { SelectElementFab } from '@stsgs1980/fab-inspector'` в `src/app/layout.tsx`
- Вставляет `<SelectElementFab />` перед `</body>`
- Проверяет наличие peer dependencies

Идемпотентно — безопасно запускать сколько угодно раз.

### Ручная установка

```tsx
// src/app/layout.tsx:
import { SelectElementFab } from '@stsgs1980/fab-inspector';
// В JSX перед </body>:
<SelectElementFab />
```

```ts
// src/app/api/source/route.ts:
export { GET } from '@stsgs1980/fab-inspector/api/source';
```

## Обновление

```bash
bun update @stsgs1980/fab-inspector
# или
npm update @stsgs1980/fab-inspector
```

## Использование

### Режим инспекции

- FAB-кнопка в правом нижнем углу включает режим инспекции
- Клик по элементу показывает свёрнутую панель (тег, ID, файл:строка)
- Шеврон раскрывает все секции
- Esc закрывает инспектор
- Панель перетаскивается за заголовок

### Кнопки в заголовке панели

| Кнопка | Действие | Доступна без `data-src` |
|--------|----------|-------------------------|
| Документ | Copy task context (файл, тег, текст) | нет |
| Два прямоугольника | Copy file:line | нет |
| Копировать | Quick-copy (тег + классы + текст) | **да** |
| Шеврон | Свернуть / развернуть секции | да |
| x | Закрыть панель | да |

### data-src атрибут

Для отображения источника добавьте `data-src` на JSX-элементы:

```tsx
<h1 data-src="src/components/sections/hero.tsx:12">Заголовок</h1>
```

Инспектор поднимается по DOM-дереву и найдёт ближайший `data-src`.

> **Next.js 16 note:** Авто-проставление `data-src` через Turbopack plugin в Next.js 16 больше не работает (API `experimental.turbo.plugins` удалён). Проставляйте `data-src` вручную на ключевых элементах. SWC plugin для авто-разметки — в планах.

## Конфигурация

### Зависимости (peerDependencies)

| Пакет | Версия |
|-------|--------|
| `framer-motion` | >= 11.0 |
| `react-syntax-highlighter` | >= 15.0 |
| `next` | >= 15.0 |
| `react` | >= 19.0 |

### Production safety

- Пакет ставится в `devDependencies` — в production-bundle не попадает
- Компонент `SelectElementFab` имеет dev-only guard: `if (process.env.NODE_ENV !== 'development') return null`
- `sideEffects: false` — tree-shaking вырезает неиспользуемый код

### Сборка (v3.5.0+)

Начиная с v3.5.0 пакет публикуется **собранным** (`dist/` — ESM `.js` + `.d.ts` + sourcemaps), а не сырыми `.ts`/`.tsx`. Это значит:

- **Не нужен** `transpilePackages` в `next.config.ts` — работает из коробки
- **Не нужен** TypeScript на стороне потребителя для рантайма
- TypeScript-типы подключаются автоматически через `exports[].types`

Сборка из исходников (для контрибьюторов модуля):

```bash
git clone https://github.com/stsgs1980/FabInspector.git
cd FabInspector/src/components/inspector
npm run build        # tsc -p tsconfig.build.json → dist/
```

### API-роут `/api/source`

Создаётся CLI `init` автоматически. Принимает `file`, `line`, `ctx` (контекст строк). Файл валидируется по белому списку директорий (`src/components/`, `src/app/`, `src/content/`, `src/hooks/`, `src/lib/`).

## Структура модуля

**Исходники** (в git):

- `index.ts` — Barrel export
- `types.ts` — Интерфейсы (ElementInfo, SourceInfo, BoxModel, SnippetData)
- `select-element-fab.tsx` — Корневой composer
- `inspector-fab.tsx` — FAB-кнопка
- `inspector-panel.tsx` — Draggable сворачиваемая панель
- `highlight-overlay.tsx` — Подсветка элемента
- `panel-sections.tsx` — Секции панели (Source, Classes, Text, CSS Path, HTML, Styles, Snippet)
- `box-model-section.tsx` — Box Model диаграмма
- `use-element-inspector.ts` — Хук инспекции
- `use-panel-drag.ts` — Хук перетаскивания
- `api-source-route.ts` — GET handler для `/api/source`
- `plugins/data-src-plugin.ts` — Turbopack plugin (Next.js 15.3+, авто-data-src)
- `cli/init.mjs` — CLI `npx @stsgs1980/fab-inspector init`
- `tsconfig.build.json` — Конфиг сборки `dist/`

**В npm-пакете** (генерируется `npm run build`):

- `dist/` — ESM `.js` + `.d.ts` + `.js.map` для каждого исходника
- `cli/init.mjs` — CLI (как есть)
- `README.md` + `package.json`

## License

MIT
