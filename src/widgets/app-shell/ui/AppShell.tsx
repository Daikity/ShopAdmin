import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ShellLayout } from '@/shared/ui'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
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
  )
}
