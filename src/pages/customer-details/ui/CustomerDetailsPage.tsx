import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetCustomerQuery } from '@/shared/api/customersApi'
import { PageHeader, QueryState } from '@/shared/ui'

const tabs = ['Overview', 'Orders', 'Returns', 'Activity'] as const
type Tab = (typeof tabs)[number]

export function CustomerDetailsPage() {
  const { id = '' } = useParams()
  const [tab, setTab] = useState<Tab>('Overview')
  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetCustomerQuery(id, { skip: !id })

  return (
    <section>
      <PageHeader
        title={data?.name ?? 'Customer'}
        description={data?.email ?? 'Карточка клиента'}
        back={{ to: '/customers' }}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        errorMessage="Клиент не найден или недоступен"
      >
        {data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 border-b border-border pb-2">
              {tabs.map((item) => (
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
                  {item}
                </button>
              ))}
            </div>

            {tab === 'Overview' ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Total orders" value={String(data.ordersCount)} />
                <Stat
                  label="Total spent"
                  value={`€${data.totalSpent.toFixed(2)}`}
                />
                <Stat
                  label="Average order"
                  value={`€${data.averageOrder.toFixed(2)}`}
                />
                <Stat
                  label="Last order"
                  value={
                    data.lastOrderAt
                      ? new Date(data.lastOrderAt).toLocaleDateString('ru-RU')
                      : '—'
                  }
                />
              </div>
            ) : null}

            {tab === 'Orders' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                {data.orders.length === 0 ? (
                  <p className="text-small text-text-secondary">Нет заказов</p>
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
                        <span className="text-small capitalize text-text-secondary">
                          {order.status}
                        </span>
                        <span className="text-small">
                          €{order.total.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {tab === 'Returns' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                {data.returns.length === 0 ? (
                  <p className="text-small text-text-secondary">Нет возвратов</p>
                ) : (
                  <ul className="space-y-2">
                    {data.returns.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-b-0"
                      >
                        <span className="font-medium">{item.number}</span>
                        <span className="text-small capitalize text-text-secondary">
                          {item.status}
                        </span>
                        <span className="text-small">
                          €{item.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {tab === 'Activity' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <ul className="space-y-2">
                  {data.activity.map((event) => (
                    <li key={event.id} className="text-small">
                      <span className="text-text-secondary">
                        {new Date(event.at).toLocaleString('ru-RU')}
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
