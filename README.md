# FabInspector

Визуальный инспектор элементов для Next.js dev mode. Плавающая FAB-кнопка с draggable панелью в GitHub Dark Theme, подсветкой синтаксиса, box-model визуализацией и интеграцией с VS Code.

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
- Кнопка Open in VS Code: переход к file:line в редакторе
- Copy task context: структурированный промпт (файл + тег + текст)

Панель по умолчанию свёрнута (только заголовок), раскрывается по клику на шеврон. Перетаскивается за заголовок.

## Установка

### Вариант A: Новый проект

```bash
git submodule add https://github.com/stsgs1980/FabInspector.git src/components/inspector
bun add framer-motion react-syntax-highlighter
bash src/components/inspector/scripts/install.sh
```

### Вариант B: Существующий проект

```bash
git submodule add https://github.com/stsgs1980/FabInspector.git src/components/inspector
bun add framer-motion react-syntax-highlighter
bash src/components/inspector/scripts/install.sh
```

Скрипт автоматически:
- Проверяет зависимости (framer-motion, react-syntax-highlighter)
- Создаёт API-роут `src/app/api/source/route.ts`
- Вставляет `import` и `<SelectElementFab />` в layout.tsx или page.tsx

### Ручная установка

```tsx
// layout.tsx или page.tsx:
import { SelectElementFab } from '@/components/inspector';
// Добавить в JSX:
<SelectElementFab />
```

```bash
# API-роут (скопировать из модуля):
cp src/components/inspector/api-source-route.ts src/app/api/source/route.ts
```

## Удаление и обновление

```bash
# Удалить (импорт, API-роут, submodule):
bash src/components/inspector/scripts/uninstall.sh

# Обновить до последней версии:
bash src/components/inspector/scripts/update.sh
```

## Использование

### Режим инспекции

- FAB-кнопка в правом нижнем углу включает режим инспекции
- Клик по элементу показывает свёрнутую панель (тег, ID, файл:строка)
- Шеврон раскрывает все секции
- Esc закрывает инспектор
- Панель перетаскивается за заголовок

### Кнопки в заголовке панели

| Кнопка | Действие |
|--------|----------|
| Документ | Copy task context (файл, тег, текст) |
| `<>` | Open in VS Code |
| Два прямоугольника | Copy file:line |
| Шеврон | Свернуть / развернуть секции |
| x | Закрыть панель |

### data-src атрибут

Для отображения источника добавьте `data-src` на JSX-элементы:

```tsx
<h1 data-src="src/components/sections/hero.tsx:12">Заголовок</h1>
```

Инспектор поднимается по DOM-дереву и найдёт ближайший `data-src`.

### Автогенерация data-src (экспериментально)

Плагин для Turbopack добавляет `data-src` автоматически:

```ts
// next.config.ts
import { dataSrcPlugin } from './src/components/inspector/plugins/data-src-plugin';

const nextConfig = {
  experimental: { turbo: { plugins: [dataSrcPlugin()] } },
};
export default nextConfig;
```

Пропускает `node_modules`, `inspector/`, комментарии и control flow. Если API Turbopack изменится - добавляйте `data-src` вручную.

## Конфигурация

### Зависимости (peerDependencies)

| Пакет | Версия |
|-------|--------|
| `framer-motion` | >= 11.0 |
| `react-syntax-highlighter` | >= 15.0 |
| `next` | >= 15.0 |
| `react` | >= 19.0 |

### ESLint (опционально)

```js
// eslint.config.mjs корня проекта:
import inspectorConfig from './src/components/inspector/eslint.config.mjs';
export default [...inspectorConfig, /* ваш конфиг */];
```

### API-роут `/api/source`

Создаётся автоматически скриптом `install.sh`. Принимает `file`, `line`, `ctx` (контекст). Файл валидируется по белому списку директорий.

## Структура модуля

- `index.ts` - Barrel export
- `types.ts` - Интерфейсы (ElementInfo, SourceInfo, BoxModel, SnippetData)
- `select-element-fab.tsx` - Корневой composer (49 строк)
- `inspector-fab.tsx` - FAB-кнопка (62 строки)
- `inspector-panel.tsx` - Draggable сворачиваемая панель (185 строк)
- `highlight-overlay.tsx` - Подсветка элемента (22 строки)
- `panel-sections.tsx` - Секции панели (202 строки)
- `box-model-section.tsx` - Box Model диаграмма (96 строк)
- `use-element-inspector.ts` - Хук инспекции (242 строки)
- `use-panel-drag.ts` - Хук перетаскивания (46 строк)
- `plugins/data-src-plugin.ts` - Turbopack плагин
- `api-source-route.ts` - Шаблон API-роута
- `eslint.config.mjs` - ESLint конфиг модуля
- `scripts/` - install.sh, uninstall.sh, update.sh
- `tests/` - Тест-заглушки

## Пороги (ZAI-ARCH-002)

| Правило | Лимит | Факт |
|---------|-------|------|
| Файл | 250 строк | Макс. 242 |
| Компонент | 200 строк | Макс. 185 |
| useState | 2 на компонент | 0 в компонентах, 6 в хуках |