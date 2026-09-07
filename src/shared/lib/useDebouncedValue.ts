import { useEffect, useState } from 'react'

/** Отложенное значение для поиска и прочих частых изменений. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
