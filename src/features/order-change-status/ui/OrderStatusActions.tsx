import { useState } from 'react'
import type { OrderAction, OrderStatus } from '@/entities/order'
import {
  getAvailableOrderActions,
  getOrderActionLabel,
  isDestructiveOrderAction,
  resolveOrderActionStatus,
} from '@/entities/order'
import { useCan } from '@/features/role-switch'
import { notifyToast } from '@/shared/lib'
import { useChangeOrderStatusMutation } from '@/shared/api/ordersApi'
import { ConfirmDialog } from '@/shared/ui'

type OrderStatusActionsProps = {
  orderId: string
  orderNumber: string
  status: OrderStatus
}

export function OrderStatusActions({
  orderId,
  orderNumber,
  status,
}: OrderStatusActionsProps) {
  const [pendingAction, setPendingAction] = useState<OrderAction | null>(null)
  const [changeStatus, { isLoading }] = useChangeOrderStatusMutation()
  const canWrite = useCan('orders.write')
  const canRefund = useCan('orders.refund')
  const actions = getAvailableOrderActions(status).filter((action) => {
    if (action === 'refund') return canRefund
    return canWrite
  })

  async function apply(action: OrderAction) {
    const nextStatus = resolveOrderActionStatus(action)
    try {
      await changeStatus({ id: orderId, status: nextStatus }).unwrap()
      notifyToast({
        tone: 'success',
        message: `${orderNumber}: ${getOrderActionLabel(action)}`,
      })
    } catch {
      notifyToast({
        tone: 'error',
        message: `${orderNumber}: не удалось сменить статус (rollback)`,
      })
    } finally {
      setPendingAction(null)
    }
  }

  if (actions.length === 0) {
    return (
      <p className="text-small text-text-secondary">
        {!canWrite && !canRefund
          ? 'Нет permission на изменение заказа (orders.write / orders.refund).'
          : `Нет доступных действий для статуса «${status}».`}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={isLoading}
            className={[
              'rounded-md px-3 py-2 text-small font-medium disabled:opacity-50',
              isDestructiveOrderAction(action)
                ? 'border border-danger/40 text-danger'
                : 'bg-accent text-accent-foreground hover:bg-accent-hover',
            ].join(' ')}
            onClick={() => {
              if (isDestructiveOrderAction(action)) {
                setPendingAction(action)
                return
              }
              void apply(action)
            }}
          >
            {getOrderActionLabel(action)}
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title="Подтвердите действие"
        description={
          pendingAction
            ? `${getOrderActionLabel(pendingAction)} для ${orderNumber}?`
            : null
        }
        tone="danger"
        confirmLabel="Подтвердить"
        isPending={isLoading}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          if (pendingAction) {
            void apply(pendingAction)
          }
        }}
      />
    </>
  )
}
