/** @type {import('eslint').Linter.Config[]} */
const inspectorConfig = [
  {
    name: 'FabInspector/rules',
    files: ['src/components/inspector/**/*.{ts,tsx}'],
    rules: {
      // Модуль должен оставаться ниже порогов Anti-Monolith (ZAI-ARCH-002)
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],

      // Компоненты React: максимум 200 строк JSX
      'react/no-multi-comp': 'off',

      // Нет Any
      '@typescript-eslint/no-explicit-any': 'error',

      // Нет console в production-коде
      'no-console': 'warn',

      // Обязательна типизация пропсов
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      // Запрет emoji в UI-строках
      'no-irregular-whitespace': 'error',
    },
  },
  {
    name: 'FabInspector/imports',
    files: ['src/components/inspector/**/*.{ts,tsx}'],
    rules: {
      // Модуль может импортировать только external libs
      // (проверяется при code review, здесь — предупреждение)
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['@/components/guide/*'],
              message: 'Inspector module must not import from guide/. Keep modules isolated.',
            },
            {
              group: ['@/app/*'],
              message: 'Inspector module must not import from app/. Use props/callbacks instead.',
            },
          ],
        },
      ],
    },
  },
];

export default inspectorConfig;