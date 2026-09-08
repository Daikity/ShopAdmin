import { Link } from 'react-router-dom'
import type { ReportTopProduct } from '@/entities/report'
import { formatMoney } from '@/shared/lib'

type ReportsTopProductsProps = {
  items: ReportTopProduct[]
}

export function ReportsTopProducts({ items }: ReportsTopProductsProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">Top products</h2>
      <p className="mt-1 text-small text-text-secondary">По выручке</p>
      {items.length === 0 ? (
        <p className="py-10 text-center text-small text-text-secondary">
          Нет данных
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-small">
            <thead className="text-caption text-text-secondary">
              <tr className="border-b border-border">
                <th className="py-2 font-medium">Product</th>
                <th className="py-2 font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId} className="border-b border-border/70">
                  <td className="py-2">
                    <Link
                      to={`/catalog/products/${item.productId}`}
                      className="text-accent hover:underline"
                    >
                      {item.productName}
                    </Link>
                  </td>
                  <td className="py-2 tabular-nums">{item.quantity}</td>
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
