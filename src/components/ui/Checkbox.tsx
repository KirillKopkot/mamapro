import { useId, type InputHTMLAttributes } from 'react'
import styles from './Field.module.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  hint?: string
  error?: string
}

export function Checkbox({ label, hint, error, id, className, ...rest }: CheckboxProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.checkbox}>
        <input
          {...rest}
          id={fieldId}
          type="checkbox"
          className={className}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        <span>{label}</span>
      </label>
      {hint && !error && (
        <p id={`${fieldId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
