import { useParams } from 'react-router-dom'
import { OrderStatusActions } from '@/features/order-change-status'
import { useGetOrderQuery } from '@/shared/api/ordersApi'
import { PageHeader, QueryState } from '@/shared/ui'

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption capitalize">
      {value}
    </span>
  )
}

function AddressBlock({
  title,
  address,
}: {
  title: string
  address: {
    name: string
    line1: string
    city: string
    postalCode: string
    country: string
  }
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-small font-semibold text-text-secondary">{title}</h3>
      <p className="mt-2 font-medium">{address.name}</p>
      <p className="text-small text-text-secondary">{address.line1}</p>
      <p className="text-small text-text-secondary">
        {address.postalCode} {address.city}, {address.country}
      </p>
    </div>
  )
}

export function OrderDetailsPage() {
  const { id = '' } = useParams()
  const { data, isLoading, isError, isFetching, isSuccess } = useGetOrderQuery(
    id,
    { skip: !id },
  )

  return (
    <section>
      <PageHeader
        title={data?.number ?? 'Order'}
        description={
          data
            ? `${data.customerName} · ${new Date(data.createdAt).toLocaleString('ru-RU')}`
            : 'Карточка заказа'
        }
        back={{ to: '/orders' }}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        errorMessage="Заказ не найден или недоступен"
      >
        {data ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge value={data.status} />
                <StatusBadge value={data.paymentStatus} />
                <StatusBadge value={data.fulfillmentStatus} />
                <span className="text-small text-text-secondary">
                  Total €{data.total.toFixed(2)}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 text-small font-semibold text-text-secondary">
                  Actions
                </h3>
                <OrderStatusActions
                  orderId={data.id}
                  orderNumber={data.number}
                  status={data.status}
                />
                <p className="mt-2 text-caption text-text-secondary">
                  Демо rollback: заказы с id, кратным 11 (например ord-0011),
                  отвечают 409.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="text-small font-semibold text-text-secondary">
                  Customer
                </h3>
                <p className="mt-2 font-medium">{data.customerName}</p>
                <p className="text-small text-text-secondary">
                  {data.customerEmail}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="text-small font-semibold text-text-secondary">
                  Summary
                </h3>
                <p className="mt-2 text-small">Items: {data.itemsCount}</p>
                <p className="text-small">Updated: {new Date(data.updatedAt).toLocaleString('ru-RU')}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AddressBlock title="Shipping" address={data.shippingAddress} />
              <AddressBlock title="Billing" address={data.billingAddress} />
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="mb-3 text-small font-semibold text-text-secondary">
                Products
              </h3>
              <ul className="space-y-2">
                {data.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-caption text-text-secondary">
                        {item.sku} · ×{item.quantity}
                      </p>
                    </div>
                    <p className="text-small">€{item.total.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-3 text-small font-semibold text-text-secondary">
                  Timeline
                </h3>
                <ul className="space-y-2">
                  {data.timeline.map((event) => (
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
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-3 text-small font-semibold text-text-secondary">
                  Notes
                </h3>
                {data.notes.length === 0 ? (
                  <p className="text-small text-text-secondary">Нет заметок</p>
                ) : (
                  <ul className="space-y-2">
                    {data.notes.map((note) => (
                      <li key={note.id} className="text-small">
                        <p className="font-medium">{note.author}</p>
                        <p className="text-text-secondary">{note.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}
