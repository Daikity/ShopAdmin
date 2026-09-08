import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardTopProduct } from '@/entities/dashboard'
import { formatMoney } from '@/shared/lib'

type DashboardTopProductsProps = {
  items: DashboardTopProduct[]
}

export function DashboardTopProducts({ items }: DashboardTopProductsProps) {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">{t('dashboard.topProductsTitle')}</h2>
      <p className="mt-1 text-small text-text-secondary">
        {t('dashboard.topProductsSubtitle')}
      </p>
      {items.length === 0 ? (
        <p className="py-10 text-center text-small text-text-secondary">
          {t('dashboard.topProductsEmpty')}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between gap-3 py-2.5 text-small"
            >
              <div className="min-w-0">
                <Link
                  to={`/catalog/products/${item.productId}`}
                  className="truncate font-medium text-accent hover:underline"
                >
                  {item.productName}
                </Link>
                <p className="text-caption text-text-secondary">
                  {t('dashboard.topProductsQty', { quantity: item.quantity })}
                </p>
              </div>
              <span className="shrink-0 tabular-nums">
                {formatMoney(item.revenue)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
