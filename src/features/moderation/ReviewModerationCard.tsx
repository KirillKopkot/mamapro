import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import type { Review } from '../../types'
import { useSpecialists } from '../specialists/hooks'
import { useModerateReview } from './hooks'
import { RejectForm } from './RejectForm'
import styles from './Moderation.module.css'

export function ReviewModerationCard({ review: r }: { review: Review }) {
  const { t } = useTranslation()
  const lang = useLang()
  const moderate = useModerateReview()
  const specialists = useSpecialists()
  const [rejecting, setRejecting] = useState(false)
  const target = specialists.data?.find((s) => s.id === r.specialistId)

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>
        {t('moderation.reviewFor', {
          name: target ? `${target.firstName} ${target.lastName}` : r.specialistId,
        })}
      </h3>
      <p className={styles.muted}>
        {r.authorName} ·{' '}
        <span aria-label={t('specialist.ratingLabel', { rating: r.rating })}>
          <span aria-hidden="true">{'★'.repeat(r.rating)}</span>
        </span>{' '}
        · <time dateTime={r.date}>{new Date(r.date).toLocaleDateString(lang)}</time>
      </p>
      <p>{r.text}</p>

      {rejecting ? (
        <RejectForm
          pending={moderate.isPending}
          onCancel={() => setRejecting(false)}
          onConfirm={(reason) =>
            moderate.mutate({ id: r.id, decision: { status: 'rejected', reason } })
          }
        />
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            disabled={moderate.isPending}
            onClick={() =>
              moderate.mutate({ id: r.id, decision: { status: 'approved' } })
            }
          >
            {t('moderation.approve')}
          </button>
          <button
            type="button"
            className={styles.danger}
            disabled={moderate.isPending}
            onClick={() => setRejecting(true)}
          >
            {t('moderation.reject')}
          </button>
        </div>
      )}
      {moderate.isError && (
        <p role="alert" className={styles.error}>
          {t('common.error')}
        </p>
      )}
    </article>
  )
}
