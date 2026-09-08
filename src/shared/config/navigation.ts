import type { Permission } from '@/entities/role'

/** Конфиг навигации админки — labelKey → i18n `nav.*`. */
export type NavIconId =
  | 'dashboard'
  | 'catalog'
  | 'orders'
  | 'customers'
  | 'inventory'
  | 'pricing'
  | 'returns'
  | 'reports'
  | 'users'
  | 'roles'
  | 'audit'
  | 'settings'

export type NavItem = {
  to: string
  labelKey:
    | 'nav.dashboard'
    | 'nav.catalog'
    | 'nav.orders'
    | 'nav.customers'
    | 'nav.inventory'
    | 'nav.pricing'
    | 'nav.returns'
    | 'nav.reports'
    | 'nav.users'
    | 'nav.roles'
    | 'nav.audit'
    | 'nav.settings'
  icon: NavIconId
  /** Если задано — пункт виден только при can(permission). */
  permission?: Permission
}

export const mainNavItems: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: 'dashboard' },
  {
    to: '/catalog/products',
    labelKey: 'nav.catalog',
    icon: 'catalog',
    permission: 'products.read',
  },
  {
    to: '/orders',
    labelKey: 'nav.orders',
    icon: 'orders',
    permission: 'orders.read',
  },
  {
    to: '/customers',
    labelKey: 'nav.customers',
    icon: 'customers',
    permission: 'customers.read',
  },
  {
    to: '/inventory',
    labelKey: 'nav.inventory',
    icon: 'inventory',
    permission: 'inventory.read',
  },
  {
    to: '/pricing',
    labelKey: 'nav.pricing',
    icon: 'pricing',
    permission: 'products.write',
  },
  {
    to: '/returns',
    labelKey: 'nav.returns',
    icon: 'returns',
    permission: 'returns.read',
  },
  {
    to: '/reports',
    labelKey: 'nav.reports',
    icon: 'reports',
    permission: 'reports.read',
  },
  { to: '/users', labelKey: 'nav.users', icon: 'users', permission: 'users.read' },
  { to: '/roles', labelKey: 'nav.roles', icon: 'roles', permission: 'users.read' },
  {
    to: '/audit-log',
    labelKey: 'nav.audit',
    icon: 'audit',
    permission: 'audit.read',
  },
  { to: '/settings', labelKey: 'nav.settings', icon: 'settings' },
]
