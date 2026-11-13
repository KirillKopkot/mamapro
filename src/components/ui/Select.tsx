import { useId, type SelectHTMLAttributes } from 'react'
import { Field, type FieldMessages } from './Field'
import { fieldAria } from './fieldAria'
import styles from './Field.module.css'

type SelectProps = FieldMessages &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'required'>

export function Select({
  label,
  hint,
  error,
  required,
  id,
  className,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required}>
      <select
        {...rest}
        id={fieldId}
        required={required}
        className={[styles.control, className].filter(Boolean).join(' ')}
        {...fieldAria(fieldId, { hint, error })}
      >
        {children}
      </select>
    </Field>
  )
}
