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
}

export const mainNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/catalog/products', label: 'Catalog', icon: 'catalog' },
  { to: '/orders', label: 'Orders', icon: 'orders' },
  { to: '/customers', label: 'Customers', icon: 'customers' },
  { to: '/inventory', label: 'Inventory', icon: 'inventory' },
  { to: '/pricing', label: 'Pricing', icon: 'pricing' },
  { to: '/returns', label: 'Returns', icon: 'returns' },
  { to: '/reports', label: 'Reports', icon: 'reports' },
  { to: '/users', label: 'Users', icon: 'users' },
  { to: '/roles', label: 'Roles', icon: 'roles' },
  { to: '/audit-log', label: 'Audit Log', icon: 'audit' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]
