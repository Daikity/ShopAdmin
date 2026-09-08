import { http, HttpResponse } from 'msw'
import { customerHandlers } from './customer.handlers'
import { dashboardHandlers } from './dashboard.handlers'
import { inventoryHandlers } from './inventory.handlers'
import { orderHandlers } from './order.handlers'
import { pricingHandlers } from './pricing.handlers'
import { productHandlers } from './product.handlers'
import { reportsHandlers } from './reports.handlers'
import { returnHandlers } from './return.handlers'
import { userHandlers } from './user.handlers'
import { roleHandlers } from './role.handlers'
import { auditHandlers } from './audit.handlers'
import { listAuditEntries } from './audit.store'
import { seedAuditLog } from './data/users.seed'

if (listAuditEntries().length === 0) {
  seedAuditLog()
}

export const handlers = [
  http.get('/api/auth/probe', ({ request }) => {
    const auth = request.headers.get('Authorization')

    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = auth.slice('Bearer '.length)

    if (!token || token === 'force-401') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return HttpResponse.json({ ok: true })
  }),
  ...productHandlers,
  ...orderHandlers,
  ...inventoryHandlers,
  ...pricingHandlers,
  ...returnHandlers,
  ...customerHandlers,
  ...dashboardHandlers,
  ...reportsHandlers,
  ...userHandlers,
  ...roleHandlers,
  ...auditHandlers,
]
