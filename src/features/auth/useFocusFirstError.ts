import { useEffect, useRef, useState } from 'react'

/** Переводит фокус на первое поле с aria-invalid после неудачной валидации. */
export function useFocusFirstError() {
  const formRef = useRef<HTMLFormElement>(null)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (tick === 0) return
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [tick])
  return { formRef, requestFocus: () => setTick((n) => n + 1) }
}
