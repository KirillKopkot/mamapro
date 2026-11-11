import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SpecialistForm.module.css'

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Код ошибки (см. specialistForm.errors) */
  error?: string
  hint?: string
  multiline?: boolean
  optional?: boolean
  inputMode?: 'numeric' | 'url' | 'text'
  maxLength?: number
}

export function Field({
  label,
  value,
  onChange,
  error,
  hint,
  multiline,
  optional,
  inputMode,
  maxLength,
}: FieldProps) {
  const { t } = useTranslation()
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')
  const common = {
    id,
    value,
    maxLength,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {optional && (
          <span className={styles.muted}> ({t('specialistForm.optional')})</span>
        )}
      </label>
      {multiline ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...common}
          inputMode={inputMode}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && (
        <span id={`${id}-hint`} className={styles.muted}>
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} role="alert" className={styles.error}>
          {t(`specialistForm.errors.${error}`)}
        </span>
      )}
    </div>
  )
}
