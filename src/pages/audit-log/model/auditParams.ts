import { auditFiltersSchema, type AuditFilters } from '@/entities/audit'

export const auditFilterDefaults: AuditFilters = {
  page: 1,
  limit: 20,
  user: undefined,
  action: undefined,
  entity: undefined,
  from: undefined,
  to: undefined,
}

export { auditFiltersSchema }
