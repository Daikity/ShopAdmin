import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('не рендерится когда closed', () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        title="Delete?"
        description="Irreversible"
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('показывает title/description и вызывает onConfirm', async () => {
    const user = userEvent.setup()
    let confirmed = false

    render(
      <ConfirmDialog
        open
        title="Delete products?"
        description="Cannot undo"
        confirmLabel="Delete"
        onConfirm={() => {
          confirmed = true
        }}
        onCancel={() => undefined}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete products?')).toBeInTheDocument()
    expect(screen.getByText('Cannot undo')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(confirmed).toBe(true)
  })

  it('Escape вызывает onCancel', async () => {
    const user = userEvent.setup()
    let cancelled = false

    render(
      <ConfirmDialog
        open
        title="Confirm"
        description="Desc"
        onConfirm={() => undefined}
        onCancel={() => {
          cancelled = true
        }}
      />,
    )

    await user.keyboard('{Escape}')
    expect(cancelled).toBe(true)
  })
})
