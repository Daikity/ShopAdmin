# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 2 — Catalog:** products list (search/filters/sort/pagination/selection), product details + tabs, RHF+Zod forms, MSW seed (≥100 products / ≥200 variants), `useUrlFilters` + минимальный Admin Kit.

Ранее: Phase 0 Foundation, Phase 1 Authentication.

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- React Router
- React Hook Form + Zod
- MSW (mock API)
- Vitest + React Testing Library
- ESLint + `eslint-plugin-boundaries` (FSD)

## Архитектура

```text
UI → Features/Widgets → Entities → RTK Query → /api/* → MSW
URL filters: search params → Zod → typed filters → RTK Query
```

## Команды

```bash
npm install
npm run dev
npm run check
```

## Демо-вход

`admin` / `admin`

Catalog: `/catalog/products`, details: `/catalog/products/:id`.

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW; в production authorization должен быть на backend.
