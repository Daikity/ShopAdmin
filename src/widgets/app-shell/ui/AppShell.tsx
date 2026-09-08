import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import type { RootState } from '@/app/store'
import { cn } from '@/shared/lib'
import { ShellLayout } from '@/shared/ui'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const tableDensity = useSelector(
    (state: RootState) => state.settings.tableDensity,
  )

  return (
    <div
      className={cn(
        tableDensity === 'compact' && '[&_td]:py-1.5 [&_th]:py-1.5',
      )}
    >
      <ShellLayout
        sidebar={<Sidebar variant="rail" />}
        mobileSidebar={
          <Sidebar
            variant="drawer"
            onNavigate={() => setMobileNavOpen(false)}
          />
        }
        header={
          <Header
            mobileNavOpen={mobileNavOpen}
            onToggleMobileNav={() => setMobileNavOpen((open) => !open)}
          />
        }
        mobileNavOpen={mobileNavOpen}
        onCloseMobileNav={() => setMobileNavOpen(false)}
      >
        <Outlet />
      </ShellLayout>
    </div>
  )
}
