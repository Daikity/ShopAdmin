# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 5 — Inventory + Pricing:** склад (stock states, warehouses, adjust + optimistic/rollback + MSW audit), pricing (edit, bulk %/fixed с обязательным preview).

Ранее: Phase 0–4 (Foundation, Auth, Catalog, Bulk, Orders).

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
Inventory adjust → optimistic → audit writer
Pricing bulk → preview → confirm → apply
```

## Команды

```bash
npm install
npm run dev
npm run check
```

## Демо-вход

`admin` / `admin`

- Catalog bulk: `/catalog/products` — partial failure: product id % 7.
- Orders: `/orders/:id` — rollback: order id % 11.
- Inventory: `/inventory` — Adjust; rollback: product id % 13.
- Pricing: `/pricing` — selection → Preview → Apply.

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW; в production authorization должен быть на backend.
