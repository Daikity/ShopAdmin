# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 4 — Orders:** таблица заказов, URL-фильтры, order details, status workflow (domain module), actions + confirm для cancel/refund, optimistic update + rollback.

Ранее: Phase 0 Foundation, Phase 1 Auth, Phase 2 Catalog, Phase 3 Bulk Operations.

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
Orders: canChangeOrderStatus() → PATCH /orders/:id → optimistic UI → success | rollback
```

## Команды

```bash
npm install
npm run dev
npm run check
```

## Демо-вход

`admin` / `admin`

- Catalog bulk: `/catalog/products` — выберите строки → Bulk Actions. Partial failure: id, кратный 7.
- Orders: `/orders` → `/orders/:id`. Optimistic rollback: id, кратный 11 (`Conflict: fulfillment locked`).

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW; в production authorization должен быть на backend.
