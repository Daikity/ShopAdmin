/** Конфиг навигации админки — единый источник пунктов меню. */
export type NavItem = {
  to: string
  label: string
}

export const mainNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/catalog/products', label: 'Catalog' },
  { to: '/orders', label: 'Orders' },
  { to: '/customers', label: 'Customers' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/returns', label: 'Returns' },
  { to: '/reports', label: 'Reports' },
  { to: '/users', label: 'Users' },
  { to: '/roles', label: 'Roles' },
  { to: '/audit-log', label: 'Audit Log' },
  { to: '/settings', label: 'Settings' },
]
