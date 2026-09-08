import type { RoleId } from '@/entities/role'

export type UserStatus = 'active' | 'invited' | 'disabled'

export type User = {
  id: string
  name: string
  email: string
  role: RoleId
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
}

export type UsersListParams = {
  page: number
  limit: number
  search?: string
  role?: RoleId
  status?: UserStatus
  sort?: string
}

export type UsersListResponse = {
  items: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}
