export type AuditEntry = {
  id: string
  at: string
  user: string
  action: string
  entity: string
  entityId: string
  changes: string
}

const entries: AuditEntry[] = []
let seq = 1

/** Минимальный audit writer для MSW-мутаций (UI audit — Phase 8). */
export function appendAudit(
  input: Omit<AuditEntry, 'id' | 'at'> & { at?: string },
) {
  const entry: AuditEntry = {
    id: `audit-${String(seq).padStart(4, '0')}`,
    at: input.at ?? new Date().toISOString(),
    user: input.user,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    changes: input.changes,
  }
  seq += 1
  entries.unshift(entry)
  return entry
}

export function listAuditEntries() {
  return [...entries]
}

export function resetAuditStore() {
  entries.length = 0
  seq = 1
}
