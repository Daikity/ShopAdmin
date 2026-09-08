import type { User } from '@/entities/user'
import type { RoleId } from '@/entities/role'
import { appendAudit } from '../audit.store'

const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Shop Admin',
    email: 'admin@shopadmin.app',
    role: 'admin',
    status: 'active',
    lastLoginAt: '2026-09-08T08:10:00.000Z',
    createdAt: '2024-01-12T10:00:00.000Z',
  },
  {
    id: 'user-2',
    name: 'Mia Keller',
    email: 'mia.keller@shopadmin.app',
    role: 'manager',
    status: 'active',
    lastLoginAt: '2026-09-07T16:40:00.000Z',
    createdAt: '2024-03-02T09:00:00.000Z',
  },
  {
    id: 'user-3',
    name: 'Jonas Weber',
    email: 'jonas.weber@shopadmin.app',
    role: 'support',
    status: 'active',
    lastLoginAt: '2026-09-06T11:20:00.000Z',
    createdAt: '2024-05-18T12:00:00.000Z',
  },
  {
    id: 'user-4',
    name: 'Elena Rossi',
    email: 'elena.rossi@shopadmin.app',
    role: 'warehouse',
    status: 'active',
    lastLoginAt: '2026-09-08T07:05:00.000Z',
    createdAt: '2024-06-01T08:30:00.000Z',
  },
  {
    id: 'user-5',
    name: 'Noah Berg',
    email: 'noah.berg@shopadmin.app',
    role: 'analyst',
    status: 'active',
    lastLoginAt: '2026-09-05T14:15:00.000Z',
    createdAt: '2024-08-21T15:00:00.000Z',
  },
  {
    id: 'user-6',
    name: 'Clara Hahn',
    email: 'clara.hahn@shopadmin.app',
    role: 'support',
    status: 'invited',
    lastLoginAt: null,
    createdAt: '2026-08-28T10:00:00.000Z',
  },
  {
    id: 'user-7',
    name: 'Hugo Meyer',
    email: 'hugo.meyer@shopadmin.app',
    role: 'manager',
    status: 'disabled',
    lastLoginAt: '2026-07-01T09:00:00.000Z',
    createdAt: '2024-02-14T11:00:00.000Z',
  },
]

export const usersDb = { users: USERS }

const ROLE_LABEL: Record<RoleId, string> = {
  admin: 'Admin',
  manager: 'Manager',
  support: 'Support',
  warehouse: 'Warehouse',
  analyst: 'Analyst',
}

/** Стартовые audit-события для демо UI. */
export function seedAuditLog() {
  const samples = [
    {
      user: 'Shop Admin',
      action: 'product.price',
      entity: 'product',
      entityId: 'prod-012',
      changes: 'Admin changed product price',
      at: '2026-09-08T09:12:00.000Z',
    },
    {
      user: 'Elena Rossi',
      action: 'inventory.adjust',
      entity: 'inventory',
      entityId: 'inv-prod-003-wh-1',
      changes: 'Warehouse adjusted stock +12',
      at: '2026-09-08T08:40:00.000Z',
    },
    {
      user: 'Mia Keller',
      action: 'return.status',
      entity: 'return',
      entityId: 'ret-004',
      changes: 'Manager approved return RT-2004',
      at: '2026-09-07T17:05:00.000Z',
    },
    {
      user: 'Jonas Weber',
      action: 'order.status',
      entity: 'order',
      entityId: 'ord-0042',
      changes: 'John changed order #1042 status → processing',
      at: '2026-09-07T12:22:00.000Z',
    },
    {
      user: 'Noah Berg',
      action: 'reports.view',
      entity: 'report',
      entityId: 'reports',
      changes: 'Analyst opened revenue report',
      at: '2026-09-06T15:50:00.000Z',
    },
  ] as const

  for (const sample of samples) {
    appendAudit({ ...sample })
  }
}

export function roleDisplayName(role: RoleId) {
  return ROLE_LABEL[role]
}
