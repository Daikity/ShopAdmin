import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { OrderAction, OrderStatus } from '@/entities/order'
import {
  getAvailableOrderActions,
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

const ORDER_ACTION_KEYS = {
  confirm: 'orders.workflow.confirm',
  cancel: 'orders.workflow.cancel',
  start_fulfillment: 'orders.workflow.startFulfillment',
  ship: 'orders.workflow.ship',
  deliver: 'orders.workflow.deliver',
  refund: 'orders.workflow.refund',
} as const

export function OrderStatusActions({
  orderId,
  orderNumber,
  status,
}: OrderStatusActionsProps) {
  const { t } = useTranslation()
  const [pendingAction, setPendingAction] = useState<OrderAction | null>(null)
  const [changeStatus, { isLoading }] = useChangeOrderStatusMutation()
  const canWrite = useCan('orders.write')
  const canRefund = useCan('orders.refund')
  const actions = getAvailableOrderActions(status).filter((action) => {
    if (action === 'refund') return canRefund
    return canWrite
  })

  function actionLabel(action: OrderAction) {
    return t(ORDER_ACTION_KEYS[action])
  }

  async function apply(action: OrderAction) {
    const nextStatus = resolveOrderActionStatus(action)
    try {
      await changeStatus({ id: orderId, status: nextStatus }).unwrap()
      notifyToast({
        tone: 'success',
        message: t('orders.toast.success', {
          orderNumber,
          action: actionLabel(action),
        }),
      })
    } catch {
      notifyToast({
        tone: 'error',
        message: t('orders.toast.failed', { orderNumber }),
      })
    } finally {
      setPendingAction(null)
    }
  }

  if (actions.length === 0) {
    return (
      <p className="text-small text-text-secondary">
        {!canWrite && !canRefund
          ? t('orders.action.noPermission')
          : t('orders.action.noneForStatus', {
              status: t(`enums.orderStatus.${status}`),
            })}
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
            {actionLabel(action)}
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={t('orders.confirmTitle')}
        description={
          pendingAction
            ? t('orders.confirmDescription', {
                action: actionLabel(pendingAction),
                orderNumber,
              })
            : null
        }
        tone="danger"
        confirmLabel={t('orders.confirmLabel')}
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
