# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 8 — Users / Roles / Audit / Settings:** `can()` + Role Switcher, users/roles pages, audit log (URL filters), settings (locale stub, density, network simulation).

Ранее: Phase 0–7 (Foundation → Dashboard/Reports).

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
RBAC: demoRole slice → can(role, permission) → hide/disable actions
Audit: MSW appendAudit → GET /api/audit-log
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
- Dashboard / Reports: URL period/filters + DatePicker
- Role Switcher (header): Admin / Manager / Support / Warehouse / Analyst
- Audit: `/audit-log`; Settings: network simulation — каждый 2-й PATCH order/inventory → 500

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW (`can()` — UI capability); в production authorization должен быть на backend.
