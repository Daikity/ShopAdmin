import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import type {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from '@/entities/order'
import { OrderStatusActions } from '@/features/order-change-status'
import { formatDateTime, formatMoney } from '@/shared/lib'
import { useGetOrderQuery } from '@/shared/api/ordersApi'
import { PageHeader, QueryState } from '@/shared/ui'

function StatusBadge({ children }: { children: string }) {
  return (
    <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
      {children}
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
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const { data, isLoading, isError, isFetching, isSuccess } = useGetOrderQuery(
    id,
    { skip: !id },
  )

  return (
    <section>
      <PageHeader
        title={data?.number ?? t('orders.detailsFallbackTitle')}
        description={
          data
            ? `${data.customerName} · ${formatDateTime(data.createdAt)}`
            : t('orders.detailsFallbackDescription')
        }
        back={{ to: '/orders' }}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        errorMessage={t('orders.detailsLoadError')}
      >
        {data ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge>
                  {t(`enums.orderStatus.${data.status as OrderStatus}`)}
                </StatusBadge>
                <StatusBadge>
                  {t(
                    `enums.paymentStatus.${data.paymentStatus as PaymentStatus}`,
                  )}
                </StatusBadge>
                <StatusBadge>
                  {t(
                    `enums.fulfillmentStatus.${data.fulfillmentStatus as FulfillmentStatus}`,
                  )}
                </StatusBadge>
                <span className="text-small text-text-secondary">
                  {t('orders.details.total', {
                    total: formatMoney(data.total),
                  })}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 text-small font-semibold text-text-secondary">
                  {t('orders.details.actions')}
                </h3>
                <OrderStatusActions
                  orderId={data.id}
                  orderNumber={data.number}
                  status={data.status}
                />
                <p className="mt-2 text-caption text-text-secondary">
                  {t('orders.details.rollbackHint')}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="text-small font-semibold text-text-secondary">
                  {t('orders.details.customer')}
                </h3>
                <p className="mt-2 font-medium">{data.customerName}</p>
                <p className="text-small text-text-secondary">
                  {data.customerEmail}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="text-small font-semibold text-text-secondary">
                  {t('orders.details.summary')}
                </h3>
                <p className="mt-2 text-small">
                  {t('orders.details.items', { count: data.itemsCount })}
                </p>
                <p className="text-small">
                  {t('orders.details.updated', {
                    date: formatDateTime(data.updatedAt),
                  })}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AddressBlock
                title={t('orders.details.shipping')}
                address={data.shippingAddress}
              />
              <AddressBlock
                title={t('orders.details.billing')}
                address={data.billingAddress}
              />
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="mb-3 text-small font-semibold text-text-secondary">
                {t('orders.details.products')}
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
                    <p className="text-small">{formatMoney(item.total)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-3 text-small font-semibold text-text-secondary">
                  {t('orders.details.timeline')}
                </h3>
                <ul className="space-y-2">
                  {data.timeline.map((event) => (
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
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-3 text-small font-semibold text-text-secondary">
                  {t('orders.details.notes')}
                </h3>
                {data.notes.length === 0 ? (
                  <p className="text-small text-text-secondary">
                    {t('orders.details.noNotes')}
                  </p>
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
