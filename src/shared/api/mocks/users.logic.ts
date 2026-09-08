import type { UsersListParams, UsersListResponse } from '@/entities/user'
import { usersDb } from './data/users.seed'

export function listUsers(params: UsersListParams): UsersListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered = [...usersDb.users]

  if (search) {
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search),
    )
  }
  if (params.role) {
    filtered = filtered.filter((user) => user.role === params.role)
  }
  if (params.status) {
    filtered = filtered.filter((user) => user.status === params.status)
  }

  const [sortField, sortOrder] = (params.sort ?? 'createdAt:desc').split(
    ':',
  ) as [string, 'asc' | 'desc']

  filtered.sort((a, b) => {
    const left = a[sortField as keyof typeof a]
    const right = b[sortField as keyof typeof b]
    if (left == null && right == null) return 0
    if (left == null) return sortOrder === 'asc' ? -1 : 1
    if (right == null) return sortOrder === 'asc' ? 1 : -1
    if (typeof left === 'string' && typeof right === 'string') {
      return sortOrder === 'asc'
        ? left.localeCompare(right)
        : right.localeCompare(left)
    }
    return 0
  })

  const page = Math.max(1, params.page)
  const limit = Math.max(1, params.limit)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit

  return {
    items: filtered.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  }
}
