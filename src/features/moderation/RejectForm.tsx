import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocalizedText } from '../../types'
import { validateRejectionReason } from './validation'
import type { RejectionErrors } from './validation'
import styles from './Moderation.module.css'

interface RejectFormProps {
  pending: boolean
  onConfirm: (reason: LocalizedText) => void
  onCancel: () => void
}

export function RejectForm({ pending, onConfirm, onCancel }: RejectFormProps) {
  const { t } = useTranslation()
  const id = useId()
  const [reason, setReason] = useState<LocalizedText>({ ru: '', kk: '' })
  const [errors, setErrors] = useState<RejectionErrors>({})

  function submit(e: FormEvent) {
    e.preventDefault()
    const found = validateRejectionReason(reason)
    setErrors(found)
    if (Object.keys(found).length === 0) {
      onConfirm({ ru: reason.ru.trim(), kk: reason.kk.trim() })
    }
  }

  return (
    <form className={styles.rejectForm} onSubmit={submit} noValidate>
      <p>{t('moderation.rejectHint')}</p>
      {(['ru', 'kk'] as const).map((lang) => (
        <div key={lang} className={styles.field}>
          <label htmlFor={`${id}-${lang}`}>{t(`moderation.reason.${lang}`)}</label>
          <textarea
            id={`${id}-${lang}`}
            rows={3}
            value={reason[lang]}
            aria-invalid={errors[lang] ? true : undefined}
            aria-describedby={errors[lang] ? `${id}-${lang}-error` : undefined}
            onChange={(e) => setReason((r) => ({ ...r, [lang]: e.target.value }))}
          />
          {errors[lang] && (
            <span id={`${id}-${lang}-error`} role="alert" className={styles.error}>
              {t(`moderation.errors.${errors[lang]}`)}
            </span>
          )}
        </div>
      ))}
      <div className={styles.actions}>
        <button type="submit" className={styles.danger} disabled={pending}>
          {t('moderation.confirmReject')}
        </button>
        <button type="button" className={styles.secondary} onClick={onCancel}>
          {t('moderation.cancel')}
        </button>
      </div>
    </form>
  )
}
