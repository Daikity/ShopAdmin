import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { baseApi } from '@/shared/api'
import { demoRoleReducer, setDemoRole } from '@/app/store/demoRoleSlice'
import { settingsReducer } from '@/app/store/settingsSlice'
import { notificationsReducer } from '@/app/store/notificationsSlice'
import { Sidebar } from './Sidebar'

function createStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      notifications: notificationsReducer,
      demoRole: demoRoleReducer,
      settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

function renderSidebar(
  variant: 'rail' | 'drawer' = 'drawer',
  store = createStore(),
) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar variant={variant} />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('рендерит бренд и основные пункты навигации', () => {
    renderSidebar('drawer')

    expect(screen.getByText('ShopAdmin')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Catalog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument()
  })

  it('в rail даёт доступные имена ссылок через aria-label', () => {
    renderSidebar('rail')

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('support не видит Inventory и Catalog', () => {
    const store = createStore()
    store.dispatch(setDemoRole('support'))
    renderSidebar('drawer', store)

    expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Customers' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Inventory' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Catalog' })).not.toBeInTheDocument()
  })

  it('analyst видит Reports, но не Users', () => {
    const store = createStore()
    store.dispatch(setDemoRole('analyst'))
    renderSidebar('drawer', store)

    expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument()
  })
})
