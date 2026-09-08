export type AuditLogItem = {
  id: string
  at: string
  user: string
  action: string
  entity: string
  entityId: string
  changes: string
}

export type AuditListParams = {
  page: number
  limit: number
  user?: string
  action?: string
  entity?: string
  from?: string
  to?: string
}

export type AuditListResponse = {
  items: AuditLogItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}
