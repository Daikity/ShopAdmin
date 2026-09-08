# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 7 — Dashboard + Reports:** KPI/Recharts, period URL на dashboard, reports с URL-фильтрами (date/category/product/customer/payment), кастомный `DatePicker`, MSW-агрегации по seed orders/returns/inventory.

Ранее: Phase 0–6 (Foundation, Auth, Catalog, Bulk, Orders, Inventory + Pricing, Returns + Customers).

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- React Router
- React Hook Form + Zod
- Recharts
- MSW (mock API)
- Vitest + React Testing Library
- ESLint + `eslint-plugin-boundaries` (FSD)

## Архитектура

```text
UI → Features/Widgets → Entities → RTK Query → /api/* → MSW
Dashboard: GET /api/dashboard?from&to → KPI + charts
Reports: GET /api/reports + URL filters → revenue/orders/category/top
```

## Команды

```bash
npm install
npm run dev
npm run check
```

## Демо-вход

`admin` / `admin`

- Catalog bulk: product id % 7 → partial failure
- Orders: order id % 11 → status rollback
- Inventory: product id % 13 → adjust rollback
- Pricing: selection → Preview → Apply
- Returns: `/returns` → drawer actions
- Customers: `/customers/:id`
- Dashboard: `/dashboard?from=&to=` + presets Today/7/30/90
- Reports: `/reports` + category/product/customer/payment filters

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW; в production authorization должен быть на backend.
