import { auditFiltersSchema, type AuditFilters } from '@/entities/audit'
import { useUrlFilters } from '@/shared/lib'
import { auditFilterDefaults } from './auditParams'

export function useAuditFilters() {
  return useUrlFilters<AuditFilters>({
    schema: auditFiltersSchema,
    defaults: auditFilterDefaults,
  })
}
