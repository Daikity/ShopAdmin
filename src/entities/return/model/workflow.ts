import type { ReturnStatus } from './types'

const ALLOWED_TRANSITIONS: Record<ReturnStatus, readonly ReturnStatus[]> = {
  requested: ['approved', 'rejected'],
  approved: ['received'],
  received: ['refunded'],
  rejected: [],
  refunded: [],
}

export type ReturnAction = 'approve' | 'reject' | 'receive' | 'refund'

const ACTION_TO_STATUS: Record<ReturnAction, ReturnStatus> = {
  approve: 'approved',
  reject: 'rejected',
  receive: 'received',
  refund: 'refunded',
}

export function canChangeReturnStatus(
  currentStatus: ReturnStatus,
  nextStatus: ReturnStatus,
): boolean {
  return ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)
}

export function getAllowedNextReturnStatuses(
  currentStatus: ReturnStatus,
): readonly ReturnStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus]
}

export function resolveReturnActionStatus(action: ReturnAction): ReturnStatus {
  return ACTION_TO_STATUS[action]
}

export function canPerformReturnAction(
  currentStatus: ReturnStatus,
  action: ReturnAction,
): boolean {
  return canChangeReturnStatus(currentStatus, resolveReturnActionStatus(action))
}

export function getAvailableReturnActions(
  currentStatus: ReturnStatus,
): ReturnAction[] {
  return (Object.keys(ACTION_TO_STATUS) as ReturnAction[]).filter((action) =>
    canPerformReturnAction(currentStatus, action),
  )
}

export function isDestructiveReturnAction(action: ReturnAction): boolean {
  return action === 'reject'
}
