# Select Element Inspector

> Визуальный инспектор элементов для Next.js приложений.
> Версия: 3.1

---

## Описание

Модуль-инспектор элементов для dev-режима. Добавляет плавающую кнопку (FAB) на страницу. При активации позволяет кликнуть на любой DOM-элемент и увидеть:

- Источник (файл:строка через `data-src` атрибут)
- CSS-классы
- Текстовое содержимое
- CSS Path (полный DOM-селектор)
- HTML-код элемента
- Вычисленные стили (размер, шрифт, цвет)
- Сниппет исходного кода с подсветкой строки

Панель информации **draggable** (перетаскивается за заголовок).

---

## Зависимости

| Пакет | Версия | Обязательность |
|-------|--------|----------------|
| `framer-motion` | >= 11.0 | Обязательно |
| `next` | >= 15.0 | Обязательно (для API-роута) |
| `react` | >= 19.0 | Обязательно |

---

## Установка

### Вариант A: Новый проект

```bash
# 1. Добавить submodule
git submodule add https://github.com/stsgs1980/FabInspector.git src/components/inspector

# 2. Установить зависимости
bun add framer-motion

# 3. Запустить скрипт установки (добавит API-роут и импорт)
bash src/components/inspector/scripts/install.sh

# 4. Готово — FAB-кнопка появится на всех страницах
```

### Вариант B: Существующий проект

```bash
# 1. Добавить submodule
git submodule add https://github.com/stsgs1980/FabInspector.git src/components/inspector

# 2. Установить зависимости (если framer-motion ещё нет)
bun add framer-motion

# 3. Запустить скрипт установки
bash src/components/inspector/scripts/install.sh

# 4. Скрипт обнаружит существующий layout/page и добавит импорт автоматически
```

### Ручная установка (без скриптов)

```tsx
// 1. В вашем layout.tsx или page.tsx:
import { SelectElementFab } from '@/components/inspector';

// 2. Добавить в JSX (обычно в корень return):
<SelectElementFab />

// 3. Создать API-роут src/app/api/source/route.ts
//    Скопируйте содержимое из src/components/inspector/api-source-route.ts
```

---

## Удаление

### Через скрипт

```bash
bash src/components/inspector/scripts/uninstall.sh
```

Скрипт автоматически:
- Удалит импорт `SelectElementFab` из файла, куда он был добавлен
- Удалит API-роут `src/app/api/source/route.ts`
- Удалит submodule

### Ручное удаление

```bash
# 1. Убрать импорт из layout.tsx / page.tsx
# 2. Удалить API-роут
rm -rf src/app/api/source/

# 3. Удалить submodule
git submodule deinit src/components/inspector
git rm src/components/inspector
rm -rf .git/modules/src/components/inspector

# 4. (Опционально) Удалить framer-motion, если больше не нужен
bun remove framer-motion
```

---

## Обновление

### Через скрипт

```bash
bash src/components/inspector/scripts/update.sh
```

### Ручное обновление

```bash
git submodule update --remote src/components/inspector
```

---

## Структура модуля

```
inspector/
  index.ts                    Barrel export
  types.ts                    TypeScript-интерфейсы
  select-element-fab.tsx      Корневой composer (49 строк)
  inspector-fab.tsx           FAB-кнопка + тултип (62 строки)
  inspector-panel.tsx         Панель-композитор (109 строк)
  highlight-overlay.tsx       Подсветка элемента (22 строки)
  panel-sections.tsx          Секции панели: Source, Classes, Text,
                              CSS Path, HTML, Styles, Snippet (198 строк)
  use-element-inspector.ts    Хук: инспекция + DOM-события (226 строк)
  use-panel-drag.ts           Хук: перетаскивание панели (46 строк)
  api-source-route.ts         Шаблон API-роута для установки
  eslint.config.mjs           ESLint-конфиг модуля
  package.json                Метаданные и скрипты модуля
  scripts/
    install.sh                Автоматическая установка
    uninstall.sh              Автоматическое удаление
    update.sh                 Автоматическое обновление
  tests/
    select-element-fab.test.tsx
    use-element-inspector.test.ts
    use-panel-drag.test.ts
  README.md                   Этот файл
```

---

## Использование в компонентах

### data-src атрибут

Для отображения источника добавьте `data-src="путь/к/файлу:номер_строки"` на JSX-элементы:

```tsx
<h1 data-src="src/components/sections/hero.tsx:12">Заголовок</h1>
```

Инспектор поднимется по DOM-дереву и найдёт ближайший `data-src`.

### Пороги (Anti-Monolith ZAI-ARCH-002)

Модуль следует стандарту модульной архитектуры:

| Правило | Порог | Факт |
|---------|-------|------|
| Файл | 250 строк | Макс. 226 (хук) |
| Компонент | 200 строк | Макс. 109 (panel) |
| useState | 2 на компонент | 0 в компонентах, 6 в хуках |

---

## API-роут

Модуль требует API-роут `/api/source` для загрузки сниппетов исходного кода. Скрипт `install.sh` создаёт его автоматически, либо скопируйте `api-source-route.ts` вручную.

Роут принимает:
- `file` — путь к файлу (валидируется по белому списку)
- `line` — номер строки
- `ctx` — контекст (строк вокруг, по умолчанию 8)

---

## Конфигурация ESLint

Модуль поставляется с собственным `eslint.config.mjs`. Для подключения в основной проект:

```js
// eslint.config.mjs (корень проекта)
import inspectorConfig from './src/components/inspector/eslint.config.mjs';

export default [
  ...inspectorConfig,
  // ваш основной конфиг
];
```

---

## Тесты

```bash
# Запустить тесты модуля
cd src/components/inspector
bun test

# Или из корня проекта
bun test src/components/inspector
```

---

## Лицензия

MIT