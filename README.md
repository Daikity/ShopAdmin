# ShopAdmin

Production-like frontend админ-панель для e-commerce (portfolio, Middle+/Senior).

Sibling к [FlowCRM](https://github.com/Daikity/flowcrm): тот же стек и FSD, другой домен — сложные workflows, bulk, optimistic UI, RBAC, audit.

## Статус

**Phase 1 — Authentication:** session facade, authBridge, Bearer + 401 → logout, ProtectedRoute / GuestRoute, MSW `/api/auth/probe`, Toast + QueryState.

Ранее: **Phase 0** — scaffold, app shell, quality gate.

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- React Router
- MSW (mock API)
- Vitest + React Testing Library
- ESLint + `eslint-plugin-boundaries` (FSD)

Далее по плану: React Hook Form + Zod, Recharts, i18next.

## Архитектура

Feature-Sliced Design:

```text
src/
  app/       # bootstrap, providers, router, store, styles
  pages/     # страницы маршрутов
  widgets/   # app-shell, sidebar, header
  features/  # auth (+ далее product/order/…)
  entities/  # (с Phase 2+)
  shared/    # api, config, ui
```

Auth поток:

```text
Login → authStorage/session → authBridge → baseApi Authorization
401 → notifyUnauthorized → logout → ProtectedRoute → /login
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

## Демо-вход

`admin` / `admin`

После входа: `/dashboard` и остальные маршруты за ProtectedRoute.

## Чем будет отличаться от FlowCRM

ShopAdmin → e-commerce / bulk / order & return workflows / optimistic UI / inventory / pricing / returns / RBAC / audit.

Auth и RBAC симулированы на frontend/MSW; в production authorization должен быть на backend.
