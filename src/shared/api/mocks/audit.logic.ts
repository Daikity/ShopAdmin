import type { AuditListParams, AuditListResponse } from '@/entities/audit'
import { listAuditEntries } from './audit.store'

function inRange(iso: string, from?: string, to?: string) {
  const key = iso.slice(0, 10)
  if (from && key < from) return false
  if (to && key > to) return false
  return true
}

export function listAuditLog(params: AuditListParams): AuditListResponse {
  let filtered = listAuditEntries()

  if (params.user) {
    const needle = params.user.toLowerCase()
    filtered = filtered.filter((item) =>
      item.user.toLowerCase().includes(needle),
    )
  }
  if (params.action) {
    const needle = params.action.toLowerCase()
    filtered = filtered.filter((item) =>
      item.action.toLowerCase().includes(needle),
    )
  }
  if (params.entity) {
    const needle = params.entity.toLowerCase()
    filtered = filtered.filter((item) =>
      item.entity.toLowerCase().includes(needle),
    )
  }
  if (params.from || params.to) {
    filtered = filtered.filter((item) =>
      inRange(item.at, params.from, params.to),
    )
  }

  const page = Math.max(1, params.page)
  const limit = Math.max(1, params.limit)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit

  return {
    items: filtered.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  }
}
