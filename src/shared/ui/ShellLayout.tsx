import type { ReactNode } from 'react'

type ShellLayoutProps = {
  sidebar: ReactNode
  header: ReactNode
  mobileNavOpen: boolean
  onCloseMobileNav: () => void
  children: ReactNode
}

/** Базовый layout: sidebar + header + content, с мобильным drawer. */
export function ShellLayout({
  sidebar,
  header,
  mobileNavOpen,
  onCloseMobileNav,
  children,
}: ShellLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:block">
          {sidebar}
        </aside>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-text-primary/40"
              aria-label="Закрыть меню"
              onClick={onCloseMobileNav}
            />
            <aside className="relative z-10 h-full w-72 max-w-[85vw] border-r border-border bg-surface shadow-overlay">
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            {header}
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
