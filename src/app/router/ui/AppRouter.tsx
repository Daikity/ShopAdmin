import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuditLogPage } from '@/pages/audit-log'
import { CustomersPage } from '@/pages/customers'
import { DashboardPage } from '@/pages/dashboard'
import { InventoryPage } from '@/pages/inventory'
import { OrdersPage } from '@/pages/orders'
import { PricingPage } from '@/pages/pricing'
import { ProductsPage } from '@/pages/products'
import { ReportsPage } from '@/pages/reports'
import { ReturnsPage } from '@/pages/returns'
import { RolesPage } from '@/pages/roles'
import { SettingsPage } from '@/pages/settings'
import { UsersPage } from '@/pages/users'
import { AppShell } from '@/widgets/app-shell'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/catalog" element={<Navigate to="/catalog/products" replace />} />
          <Route path="/catalog/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
