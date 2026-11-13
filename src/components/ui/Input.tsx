import { useId, type InputHTMLAttributes } from 'react'
import { Field, type FieldMessages } from './Field'
import { fieldAria } from './fieldAria'
import styles from './Field.module.css'

type InputProps = FieldMessages & Omit<InputHTMLAttributes<HTMLInputElement>, 'required'>

export function Input({
  label,
  hint,
  error,
  required,
  id,
  className,
  ...rest
}: InputProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required}>
      <input
        {...rest}
        id={fieldId}
        required={required}
        className={[styles.control, className].filter(Boolean).join(' ')}
        {...fieldAria(fieldId, { hint, error })}
      />
    </Field>
  )
}
