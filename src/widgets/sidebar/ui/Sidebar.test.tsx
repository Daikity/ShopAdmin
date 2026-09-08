import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { store } from '@/app/store'
import { Sidebar } from './Sidebar'

function renderSidebar(variant: 'rail' | 'drawer' = 'drawer') {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar variant={variant} />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Sidebar', () => {
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
})
