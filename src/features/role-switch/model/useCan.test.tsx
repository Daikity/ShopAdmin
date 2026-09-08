import { configureStore } from '@reduxjs/toolkit'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { baseApi } from '@/shared/api'
import { demoRoleReducer, setDemoRole } from '@/app/store/demoRoleSlice'
import { useCan } from './useCan'

function createTestStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      demoRole: demoRoleReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

function withRole(role: 'admin' | 'support' | 'warehouse') {
  const store = createTestStore()
  store.dispatch(setDemoRole(role))
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  return wrapper
}

describe('useCan', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('admin может products.write', () => {
    const { result } = renderHook(() => useCan('products.write'), {
      wrapper: withRole('admin'),
    })
    expect(result.current).toBe(true)
  })

  it('support не может inventory.write', () => {
    const { result } = renderHook(() => useCan('inventory.write'), {
      wrapper: withRole('support'),
    })
    expect(result.current).toBe(false)
  })

  it('warehouse может inventory.write', () => {
    const { result } = renderHook(() => useCan('inventory.write'), {
      wrapper: withRole('warehouse'),
    })
    expect(result.current).toBe(true)
  })
})
