import { useId, type TextareaHTMLAttributes } from 'react'
import { Field, type FieldMessages } from './Field'
import { fieldAria } from './fieldAria'
import styles from './Field.module.css'

type TextareaProps = FieldMessages &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'>

export function Textarea({
  label,
  hint,
  error,
  required,
  id,
  className,
  ...rest
}: TextareaProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required}>
      <textarea
        {...rest}
        id={fieldId}
        required={required}
        className={[styles.control, className].filter(Boolean).join(' ')}
        {...fieldAria(fieldId, { hint, error })}
      />
    </Field>
  )
}
