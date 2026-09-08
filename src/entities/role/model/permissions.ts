export const ROLE_IDS = [
  'admin',
  'manager',
  'support',
  'warehouse',
  'analyst',
] as const

export type RoleId = (typeof ROLE_IDS)[number]

export const PERMISSIONS = [
  'products.read',
  'products.write',
  'products.delete',
  'orders.read',
  'orders.write',
  'orders.refund',
  'inventory.read',
  'inventory.write',
  'reports.read',
  'users.read',
  'users.write',
  'returns.read',
  'returns.write',
  'customers.read',
  'audit.read',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export type RoleDefinition = {
  id: RoleId
  name: string
  description: string
  permissions: Permission[]
}

const ALL_PERMISSIONS = [...PERMISSIONS]

/** Матрица ролей — демо RBAC без отдельного permission engine. */
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Полный доступ к операциям магазина',
    permissions: ALL_PERMISSIONS,
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Каталог, заказы, возвраты, отчёты',
    permissions: [
      'products.read',
      'products.write',
      'products.delete',
      'orders.read',
      'orders.write',
      'orders.refund',
      'inventory.read',
      'reports.read',
      'users.read',
      'returns.read',
      'returns.write',
      'customers.read',
      'audit.read',
    ],
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Заказы, клиенты и возвраты',
    permissions: [
      'orders.read',
      'returns.read',
      'returns.write',
      'customers.read',
    ],
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Сток и просмотр заказов/товаров',
    permissions: [
      'products.read',
      'orders.read',
      'inventory.read',
      'inventory.write',
    ],
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Отчёты и чтение данных',
    permissions: [
      'products.read',
      'orders.read',
      'reports.read',
      'customers.read',
      'audit.read',
      'inventory.read',
    ],
  },
]

export function getRoleDefinition(roleId: RoleId) {
  return (
    ROLE_DEFINITIONS.find((role) => role.id === roleId) ?? ROLE_DEFINITIONS[0]!
  )
}

/** UI capability check — не замена backend authorization. */
export function can(roleId: RoleId, permission: Permission) {
  return getRoleDefinition(roleId).permissions.includes(permission)
}
