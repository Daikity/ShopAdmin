import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ReportCustomerItem } from '@/entities/report'
import { formatMoney } from '@/shared/lib'

type ReportsByCustomerProps = {
  items: ReportCustomerItem[]
}

export function ReportsByCustomer({ items }: ReportsByCustomerProps) {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">{t('reports.byCustomerTitle')}</h2>
      <p className="mt-1 text-small text-text-secondary">
        {t('reports.byCustomerSubtitle')}
      </p>
      {items.length === 0 ? (
        <p className="py-10 text-center text-small text-text-secondary">
          {t('reports.chart.empty')}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-small">
            <thead className="text-caption text-text-secondary">
              <tr className="border-b border-border">
                <th className="py-2 font-medium">
                  {t('reports.byCustomer.col.customer')}
                </th>
                <th className="py-2 font-medium">
                  {t('reports.byCustomer.col.orders')}
                </th>
                <th className="py-2 text-right font-medium">
                  {t('reports.byCustomer.col.revenue')}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.customerId} className="border-b border-border/70">
                  <td className="py-2">
                    <Link
                      to={`/customers/${item.customerId}`}
                      className="text-accent hover:underline"
                    >
                      {item.customerName}
                    </Link>
                  </td>
                  <td className="py-2 tabular-nums">{item.orders}</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatMoney(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
