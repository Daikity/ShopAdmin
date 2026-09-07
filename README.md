# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 0 — Foundation:** Vite + React 19 + TypeScript + Tailwind + FSD scaffold, app shell, RTK Query `baseApi`, ESLint boundaries, Vitest, маршруты-заглушки.

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- React Router
- Vitest + React Testing Library
- ESLint + `eslint-plugin-boundaries` (FSD)

Далее по плану: React Hook Form + Zod, Recharts, MSW, i18next.

## Архитектура

Feature-Sliced Design:

```text
src/
  app/       # bootstrap, providers, router, store, styles
  pages/     # страницы маршрутов
  widgets/   # app-shell, sidebar, header
  features/  # (с Phase 1)
  entities/  # (с Phase 2+)
  shared/    # api, config, ui
```

## Команды

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run check
```

## Маршруты (Phase 0)

`/dashboard`, `/catalog/products`, `/orders`, `/customers`, `/inventory`, `/pricing`, `/returns`, `/reports`, `/users`, `/roles`, `/audit-log`, `/settings` — пока заглушки внутри app shell.

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.
