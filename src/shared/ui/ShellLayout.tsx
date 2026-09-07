import type { ReactNode } from 'react'

type ShellLayoutProps = {
  sidebar: ReactNode
  mobileSidebar: ReactNode
  header: ReactNode
  mobileNavOpen: boolean
  onCloseMobileNav: () => void
  children: ReactNode
}

/** Layout: fixed shell (sidebar + header), scroll только у main. */
export function ShellLayout({
  sidebar,
  mobileSidebar,
  header,
  mobileNavOpen,
  onCloseMobileNav,
  children,
}: ShellLayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-background text-text-primary">
      <div className="flex h-full">
        <aside className="group/nav relative z-40 hidden h-full w-16 shrink-0 lg:block">
          <div className="absolute inset-y-0 left-0 h-full w-16 overflow-hidden border-r border-border bg-surface transition-[width,box-shadow] duration-200 ease-out hover:w-60 hover:shadow-overlay">
            {sidebar}
          </div>
        </aside>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-text-primary/40"
              aria-label="Закрыть меню"
              onClick={onCloseMobileNav}
            />
            <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-surface shadow-overlay">
              {mobileSidebar}
            </aside>
          </div>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="z-30 shrink-0 border-b border-border bg-surface/95 backdrop-blur">
            {header}
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
