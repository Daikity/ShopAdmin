import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { OrderListItem } from '@/entities/order'
import { formatMoney } from '@/shared/lib'

type DashboardRecentOrdersProps = {
  items: OrderListItem[]
}

export function DashboardRecentOrders({ items }: DashboardRecentOrdersProps) {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h2">{t('dashboard.recentTitle')}</h2>
          <p className="mt-1 text-small text-text-secondary">
            {t('dashboard.recentSubtitle')}
          </p>
        </div>
        <Link to="/orders" className="text-small text-accent hover:underline">
          {t('dashboard.recentViewAll')}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-10 text-center text-small text-text-secondary">
          {t('dashboard.recentEmpty')}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between gap-3 py-2.5 text-small"
            >
              <div className="min-w-0">
                <Link
                  to={`/orders/${order.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {order.number}
                </Link>
                <p className="truncate text-caption text-text-secondary">
                  {order.customerName} · {t(`enums.orderStatus.${order.status}`)}
                </p>
              </div>
              <span className="shrink-0 tabular-nums">
                {formatMoney(order.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
