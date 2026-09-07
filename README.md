# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 3 — Bulk Operations:** selection bar, change status/category/price/stock, delete (confirm), export CSV, partial success summary.

Ранее: Phase 0 Foundation, Phase 1 Auth, Phase 2 Catalog.

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
Bulk: selection → ConfirmDialog (destructive) → POST /products/bulk → partial/success/error summary
```

## Команды

```bash
npm install
npm run dev
npm run check
```

## Демо-вход

`admin` / `admin`

Catalog bulk: `/catalog/products` — выберите строки → Bulk Actions.

Для демо partial failure сервер отклоняет товары с id, кратным 7 (`Conflict: resource locked`).

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW; в production authorization должен быть на backend.
