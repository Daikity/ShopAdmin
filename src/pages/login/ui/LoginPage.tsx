import { LoginForm } from '@/features/auth'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-panel md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-caption font-medium tracking-wide text-text-secondary uppercase">
            ShopAdmin
          </p>
          <h1 className="text-h1">Вход</h1>
          <p className="text-small text-text-secondary">
            Демо: <span className="font-medium text-text-primary">admin / admin</span>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
