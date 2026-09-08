import type { Permission } from '@/entities/role'

/** Конфиг навигации админки — единый источник пунктов меню. */
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
  label: string
  icon: NavIconId
  /** Если задано — пункт виден только при can(permission). */
  permission?: Permission
}

export const mainNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  {
    to: '/catalog/products',
    label: 'Catalog',
    icon: 'catalog',
    permission: 'products.read',
  },
  { to: '/orders', label: 'Orders', icon: 'orders', permission: 'orders.read' },
  {
    to: '/customers',
    label: 'Customers',
    icon: 'customers',
    permission: 'customers.read',
  },
  {
    to: '/inventory',
    label: 'Inventory',
    icon: 'inventory',
    permission: 'inventory.read',
  },
  {
    to: '/pricing',
    label: 'Pricing',
    icon: 'pricing',
    permission: 'products.write',
  },
  {
    to: '/returns',
    label: 'Returns',
    icon: 'returns',
    permission: 'returns.read',
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: 'reports',
    permission: 'reports.read',
  },
  { to: '/users', label: 'Users', icon: 'users', permission: 'users.read' },
  { to: '/roles', label: 'Roles', icon: 'roles', permission: 'users.read' },
  {
    to: '/audit-log',
    label: 'Audit Log',
    icon: 'audit',
    permission: 'audit.read',
  },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]
