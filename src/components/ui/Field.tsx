import type { ReactNode } from 'react'
import styles from './Field.module.css'

export interface FieldMessages {
  label: string
  hint?: string
  error?: string
  required?: boolean
}

interface FieldProps extends FieldMessages {
  /** id поля ввода; для подсказки и ошибки используются `${id}-hint` и `${id}-error`. */
  id: string
  children: ReactNode
}

/** Обёртка поля: подпись, подсказка, сообщение об ошибке. */
export function Field({ id, label, hint, error, required, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
