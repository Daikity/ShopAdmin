import type {
  FulfillmentStatus,
  OrderDetails,
  OrderStatus,
  PaymentStatus,
} from '@/entities/order'

/** Детерминированный PRNG для стабильного seed. */
function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  const index = Math.floor(rng() * items.length)
  return items[index] ?? items[0]!
}

const FIRST_NAMES = [
  'Anna',
  'Boris',
  'Clara',
  'David',
  'Elena',
  'Felix',
  'Greta',
  'Hugo',
  'Iris',
  'Jonas',
] as const

const LAST_NAMES = [
  'Weber',
  'Keller',
  'Novak',
  'Santos',
  'Berg',
  'Costa',
  'Meyer',
  'Silva',
  'Hahn',
  'Rossi',
] as const

const CITIES = [
  'Berlin',
  'Munich',
  'Hamburg',
  'Vienna',
  'Zurich',
  'Amsterdam',
] as const

const PRODUCT_NAMES = [
  'Compact Speaker',
  'Classic Jacket',
  'Studio Lamp',
  'Trail Bottle',
  'Urban Sneaker',
  'Pro Headset',
  'Daily Backpack',
  'Lite Watch',
] as const

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

function isoDaysAgo(base: Date, days: number, hours: number) {
  const date = new Date(base)
  date.setUTCDate(date.getUTCDate() - days)
  date.setUTCHours(hours, 0, 0, 0)
  return date.toISOString()
}

function buildOrder(index: number, rng: () => number, baseDate: Date): OrderDetails {
  const id = `ord-${String(index).padStart(4, '0')}`
  const number = `SA-${1000 + index}`
  const first = pick(rng, FIRST_NAMES)
  const last = pick(rng, LAST_NAMES)
  const customerName = `${first} ${last}`
  const customerEmail = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`
  const customerId = `cust-${String((index % 80) + 1).padStart(3, '0')}`
  // Conflict-id (кратные 11) оставляем pending — стабильный демо rollback.
  const status = index % 11 === 0 ? 'pending' : pick(rng, STATUSES)

  let paymentStatus: PaymentStatus = 'pending'
  let fulfillmentStatus: FulfillmentStatus = 'unfulfilled'
  if (status === 'confirmed' || status === 'processing') {
    paymentStatus = 'paid'
    fulfillmentStatus = status === 'processing' ? 'partial' : 'unfulfilled'
  } else if (status === 'shipped' || status === 'delivered') {
    paymentStatus = 'paid'
    fulfillmentStatus = 'fulfilled'
  } else if (status === 'cancelled') {
    paymentStatus = 'failed'
  } else if (status === 'refunded') {
    paymentStatus = 'refunded'
    fulfillmentStatus = 'returned'
  }

  const itemCount = 1 + Math.floor(rng() * 3)
  const items = Array.from({ length: itemCount }, (_, itemIndex) => {
    const quantity = 1 + Math.floor(rng() * 3)
    const unitPrice = Math.round((15 + rng() * 180) * 100) / 100
    const productName = pick(rng, PRODUCT_NAMES)
    const productNum = ((index + itemIndex) % 100) + 1
    return {
      id: `${id}-item-${itemIndex + 1}`,
      productId: `prod-${String(productNum).padStart(3, '0')}`,
      productName,
      sku: `SKU-${productNum}-${itemIndex + 1}`,
      quantity,
      unitPrice,
      total: Math.round(quantity * unitPrice * 100) / 100,
    }
  })

  const total = Math.round(items.reduce((sum, item) => sum + item.total, 0) * 100) / 100
  const createdAt = isoDaysAgo(baseDate, Math.floor(rng() * 90), Math.floor(rng() * 24))
  const updatedAt = createdAt
  const city = pick(rng, CITIES)
  const address = {
    name: customerName,
    line1: `${10 + Math.floor(rng() * 90)} Market Street`,
    city,
    postalCode: String(10000 + Math.floor(rng() * 80000)),
    country: 'DE',
  }

  const timeline = [
    {
      id: `${id}-tl-1`,
      at: createdAt,
      type: 'created',
      message: 'Order placed',
    },
  ]

  if (status !== 'pending') {
    timeline.push({
      id: `${id}-tl-2`,
      at: createdAt,
      type: 'status',
      message: `Status set to ${status}`,
    })
  }

  return {
    id,
    number,
    customerId,
    customerName,
    customerEmail,
    createdAt,
    updatedAt,
    itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total,
    paymentStatus,
    fulfillmentStatus,
    status,
    currency: 'EUR',
    items,
    shippingAddress: address,
    billingAddress: { ...address },
    timeline,
    notes:
      rng() > 0.7
        ? [
            {
              id: `${id}-note-1`,
              at: createdAt,
              author: 'Support',
              text: 'Customer asked about delivery window.',
            },
          ]
        : [],
  }
}

function buildDataset() {
  const rng = createRng(20260907)
  const baseDate = new Date('2026-09-07T12:00:00.000Z')
  const orders: OrderDetails[] = []

  for (let i = 1; i <= 150; i += 1) {
    orders.push(buildOrder(i, rng, baseDate))
  }

  return { orders }
}

export const ordersDb = buildDataset()
