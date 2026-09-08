import type { Customer, CustomerDetails } from '@/entities/customer'
import type { ReturnItem, ReturnStatus } from '@/entities/return'
import { ordersDb } from './orders.seed'

function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)] ?? items[0]!
}

const FIRST = [
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
const LAST = [
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
const REASONS = [
  'Damaged item',
  'Wrong size',
  'Not as described',
  'Changed mind',
  'Missing parts',
] as const
const STATUSES: ReturnStatus[] = [
  'requested',
  'approved',
  'rejected',
  'received',
  'refunded',
]

function buildDataset() {
  const rng = createRng(20260907)
  const customers: Customer[] = []
  const customerDetails = new Map<string, CustomerDetails>()

  for (let i = 1; i <= 80; i += 1) {
    const id = `cust-${String(i).padStart(3, '0')}`
    const first = pick(rng, FIRST)
    const last = pick(rng, LAST)
    const name = `${first} ${last}`
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`
    const relatedOrders = ordersDb.orders.filter(
      (order) => order.customerId === id,
    )
    const ordersCount =
      relatedOrders.length > 0
        ? relatedOrders.length
        : Math.floor(rng() * 6)
    const totalSpent =
      relatedOrders.length > 0
        ? Math.round(
            relatedOrders.reduce((sum, order) => sum + order.total, 0) * 100,
          ) / 100
        : Math.round((rng() * 1200 + 40) * 100) / 100
    const lastOrderAt =
      relatedOrders.length > 0
        ? relatedOrders
            .map((order) => order.createdAt)
            .sort()
            .at(-1)!
        : rng() > 0.2
          ? new Date(Date.UTC(2026, Math.floor(rng() * 8), 1 + Math.floor(rng() * 20))).toISOString()
          : null
    const status = pick(rng, ['active', 'active', 'active', 'blocked', 'invited'] as const)
    const createdAt = new Date(
      Date.UTC(2024, Math.floor(rng() * 12), 1 + Math.floor(rng() * 27)),
    ).toISOString()

    const customer: Customer = {
      id,
      name,
      email,
      ordersCount: Math.max(ordersCount, relatedOrders.length),
      totalSpent,
      lastOrderAt,
      status,
      createdAt,
    }
    customers.push(customer)

    const orderSummaries = relatedOrders.slice(0, 8).map((order) => ({
      id: order.id,
      number: order.number,
      createdAt: order.createdAt,
      total: order.total,
      status: order.status,
    }))

    customerDetails.set(id, {
      ...customer,
      averageOrder:
        customer.ordersCount > 0
          ? Math.round((customer.totalSpent / customer.ordersCount) * 100) / 100
          : 0,
      orders: orderSummaries,
      returns: [],
      activity: [
        {
          id: `${id}-act-1`,
          at: createdAt,
          type: 'created',
          message: 'Customer created',
        },
        ...(lastOrderAt
          ? [
              {
                id: `${id}-act-2`,
                at: lastOrderAt,
                type: 'order',
                message: 'Placed an order',
              },
            ]
          : []),
      ],
    })
  }

  const returns: ReturnItem[] = []
  for (let i = 1; i <= 60; i += 1) {
    const order = ordersDb.orders[i % ordersDb.orders.length]!
    const customer =
      customers.find((item) => item.id === order.customerId) ??
      customers[i % customers.length]!
    const product = order.items[0]
    const status = pick(rng, STATUSES)
    const createdAt = new Date(
      Date.UTC(2026, Math.floor(rng() * 8), 1 + Math.floor(rng() * 25)),
    ).toISOString()
    const id = `ret-${String(i).padStart(3, '0')}`
    const item: ReturnItem = {
      id,
      number: `RT-${2000 + i}`,
      orderId: order.id,
      orderNumber: order.number,
      customerId: customer.id,
      customerName: customer.name,
      productId: product?.productId ?? `prod-${String((i % 100) + 1).padStart(3, '0')}`,
      productName: product?.productName ?? `Product ${i}`,
      reason: pick(rng, REASONS),
      amount: Math.round((product?.total ?? 40 + rng() * 120) * 100) / 100,
      status,
      createdAt,
      updatedAt: createdAt,
      note: rng() > 0.7 ? 'Customer contacted support' : undefined,
    }
    returns.push(item)

    const details = customerDetails.get(customer.id)
    if (details) {
      details.returns.push({
        id: item.id,
        number: item.number,
        createdAt: item.createdAt,
        amount: item.amount,
        status: item.status,
      })
      details.activity.unshift({
        id: `${customer.id}-ret-${item.id}`,
        at: item.createdAt,
        type: 'return',
        message: `Return ${item.number} ${item.status}`,
      })
    }
  }

  return { customers, customerDetails, returns }
}

export const customersReturnsDb = buildDataset()
