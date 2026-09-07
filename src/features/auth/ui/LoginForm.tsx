import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login as establishSession, validateCredentials } from '../model/session'

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof (location.state as { from: unknown }).from === 'string'
      ? (location.state as { from: string }).from
      : '/dashboard'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateCredentials(loginValue.trim(), password)) {
      setError('Неверный логин или пароль')
      return
    }

    establishSession()
    navigate(from || '/dashboard', { replace: true })
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1.5">
        <span className="text-small font-medium text-text-primary">Логин</span>
        <input
          name="login"
          autoComplete="username"
          value={loginValue}
          onChange={(event) => {
            setLoginValue(event.target.value)
            setError('')
          }}
          className="rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary"
          placeholder="admin"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-small font-medium text-text-primary">Пароль</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
          className="rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary"
          placeholder="admin"
        />
      </label>

      {error ? (
        <p className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2.5 text-small font-semibold text-accent-foreground hover:bg-accent-hover"
      >
        Войти
      </button>
    </form>
  )
}
