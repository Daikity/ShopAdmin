import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import type { OrderStatus } from '@/entities/order'
import type { ReturnStatus } from '@/entities/return'
import { formatDate, formatDateTime, formatMoney } from '@/shared/lib'
import { useGetCustomerQuery } from '@/shared/api/customersApi'
import { PageHeader, QueryState } from '@/shared/ui'

const TAB_KEYS = ['overview', 'orders', 'returns', 'activity'] as const
type Tab = (typeof TAB_KEYS)[number]

export function CustomerDetailsPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const [tab, setTab] = useState<Tab>('overview')
  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetCustomerQuery(id, { skip: !id })

  return (
    <section>
      <PageHeader
        title={data?.name ?? t('customers.detailsFallbackTitle')}
        description={data?.email ?? t('customers.detailsFallbackDescription')}
        back={{ to: '/customers' }}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        errorMessage={t('customers.detailsLoadError')}
      >
        {data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 border-b border-border pb-2">
              {TAB_KEYS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'rounded-md px-3 py-1.5 text-small font-medium',
                    tab === item
                      ? 'bg-accent text-accent-foreground'
                      : 'text-text-secondary hover:bg-surface-muted',
                  ].join(' ')}
                  onClick={() => setTab(item)}
                >
                  {t(`customers.tab.${item}`)}
                </button>
              ))}
            </div>

            {tab === 'overview' ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                  label={t('customers.stat.totalOrders')}
                  value={String(data.ordersCount)}
                />
                <Stat
                  label={t('customers.stat.totalSpent')}
                  value={formatMoney(data.totalSpent)}
                />
                <Stat
                  label={t('customers.stat.averageOrder')}
                  value={formatMoney(data.averageOrder)}
                />
                <Stat
                  label={t('customers.stat.lastOrder')}
                  value={
                    data.lastOrderAt ? formatDate(data.lastOrderAt) : '—'
                  }
                />
              </div>
            ) : null}

            {tab === 'orders' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                {data.orders.length === 0 ? (
                  <p className="text-small text-text-secondary">
                    {t('customers.emptyOrders')}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {data.orders.map((order) => (
                      <li
                        key={order.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-b-0"
                      >
                        <Link
                          to={`/orders/${order.id}`}
                          className="font-medium text-accent hover:underline"
                        >
                          {order.number}
                        </Link>
                        <span className="text-small text-text-secondary">
                          {t(`enums.orderStatus.${order.status as OrderStatus}`)}
                        </span>
                        <span className="text-small">
                          {formatMoney(order.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {tab === 'returns' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                {data.returns.length === 0 ? (
                  <p className="text-small text-text-secondary">
                    {t('customers.emptyReturns')}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {data.returns.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-b-0"
                      >
                        <span className="font-medium">{item.number}</span>
                        <span className="text-small text-text-secondary">
                          {t(
                            `enums.returnStatus.${item.status as ReturnStatus}`,
                          )}
                        </span>
                        <span className="text-small">
                          {formatMoney(item.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {tab === 'activity' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <ul className="space-y-2">
                  {data.activity.map((event) => (
                    <li key={event.id} className="text-small">
                      <span className="text-text-secondary">
                        {formatDateTime(event.at)}
                      </span>
                      <span className="mx-2">·</span>
                      {event.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-caption text-text-secondary">{label}</p>
      <p className="mt-1 text-h2">{value}</p>
    </div>
  )
}
