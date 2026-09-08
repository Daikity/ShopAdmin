# ShopAdmin

Production-like frontend админ-панель для e-commerce 

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- React Router
- React Hook Form + Zod
- i18next + react-i18next (en / ru / de)
- Recharts
- MSW (mock API)
- Vitest + React Testing Library
- ESLint + `eslint-plugin-boundaries` (FSD)
- GitHub Actions CI

## Архитектура

```text
UI → Features/Widgets → Entities → RTK Query → /api/* → MSW
i18n: settings.locale → i18n.changeLanguage → LOCALE_TO_INTL / formatMoney|formatDate
RBAC: demoRole slice → can(role, permission) → hide/disable actions
Audit: MSW appendAudit → GET /api/audit-log
```

FSD-слои: `app` / `pages` / `widgets` / `features` / `entities` / `shared`.  
Admin Kit (минимум): `DataTable`, `ConfirmDialog`, `QueryState`, `PageHeader`, `Toast`, `useUrlFilters`.

## Команды

```bash
npm install
npm run dev
npm run check   # typecheck + lint + test:run + build
```

## Демо-вход

`admin` / `admin`

| Демо | Как воспроизвести |
|------|-------------------|
| Bulk partial failure | Catalog: product id % 7 |
| Order status rollback | Order id % 11 → 409 |
| Inventory adjust rollback | Product id % 13 → conflict |
| Pricing bulk | Selection → Preview → Apply |
| Returns workflow | `/returns` → drawer actions |
| Customers | `/customers/:id` |
| Dashboard / Reports | URL period/filters + DatePicker |
| Role Switcher | Header: Admin / Manager / Support / Warehouse / Analyst |
| Audit + network sim | `/audit-log`; Settings → network simulation |
| i18n | Settings → Language (en / ru / de) |

## Limitations

- **Auth** — демо `admin/admin`, session в `localStorage`, MSW `/api/auth/probe`. Нет реального backend.
- **RBAC** — `can()` скрывает/дизейблит UI; authorization в production должен быть на сервере.
- **Данные** — stateful MSW + deterministic seed; сброс при reload страницы (кроме settings/role в localStorage).
- **Сеть** — latency и редкие 409/500 включаются флагом в Settings для демо rollback.

## Портфолио / Docker

- Vite `base`: `/demos/shopadmin/`
- Router `basename`: из `import.meta.env.BASE_URL`
- MSW включён и в production (демо без бэкенда)
- Образ: `Dockerfile` → nginx SPA

В стеке портфолио: http://localhost/demos/shopadmin/
