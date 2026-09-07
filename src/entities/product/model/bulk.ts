export type BulkOperationStatus =
  | 'idle'
  | 'pending'
  | 'success'
  | 'partial'
  | 'error'

export type BulkAction =
  | { type: 'changeStatus'; status: 'active' | 'draft' | 'archived' }
  | { type: 'changeCategory'; categoryId: string }
  | { type: 'updatePrice'; mode: 'percent' | 'fixed'; value: number }
  | { type: 'updateStock'; mode: 'set' | 'adjust'; value: number }
  | { type: 'delete' }
  | { type: 'export' }

export type BulkProductsRequest = {
  ids: string[]
  action: BulkAction
}

export type BulkFailure = {
  id: string
  reason: string
}

export type BulkProductsResult = {
  updated: number
  failed: number
  failures: BulkFailure[]
  exportCsv?: string
}

export function resolveBulkStatus(
  result: BulkProductsResult,
): Exclude<BulkOperationStatus, 'idle' | 'pending'> {
  if (result.failed > 0 && result.updated > 0) {
    return 'partial'
  }
  if (result.failed > 0 && result.updated === 0) {
    return 'error'
  }
  return 'success'
}
