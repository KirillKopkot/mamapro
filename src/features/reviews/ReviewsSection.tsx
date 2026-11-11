import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import { Section } from '../specialists/profile/Section'
import { useReviews } from './hooks'
import { ReviewForm } from './ReviewForm'
import { calcRatingStats } from './stats'
import styles from './ReviewsSection.module.css'

export function ReviewsSection({ specialistId }: { specialistId: string }) {
  const { t } = useTranslation()
  const lang = useLang()
  const { data: reviews, isPending, isError, refetch } = useReviews(specialistId)

  function renderBody() {
    if (isPending) return <p role="status">{t('common.loading')}</p>
    if (isError) {
      return (
        <div role="alert">
          <p>{t('common.error')}</p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </div>
      )
    }
    if (reviews.length === 0) return <p>{t('reviews.empty')}</p>

    const stats = calcRatingStats(reviews)
    return (
      <>
        <div className={styles.summary}>
          <div className={styles.average}>
            <span className={styles.averageValue}>{stats.average.toFixed(1)}</span>
            <span className={styles.averageMeta}>
              {t('specialist.ratingLabel', { rating: stats.average.toFixed(1) })} ·{' '}
              {t('specialist.reviews', { count: stats.count })}
            </span>
          </div>
          <ul className={styles.distribution} aria-label={t('reviews.distribution')}>
            {[5, 4, 3, 2, 1].map((star) => {
              const n = stats.distribution[star - 1] ?? 0
              return (
                <li key={star} className={styles.row}>
                  <span className={styles.rowLabel}>
                    {star} <span aria-hidden="true">★</span>
                  </span>
                  <span className={styles.bar} aria-hidden="true">
                    <span
                      className={styles.barFill}
                      style={{ width: `${(n / stats.count) * 100}%` }}
                    />
                  </span>
                  <span className={styles.rowCount}>
                    <span className="visually-hidden">
                      {t('reviews.starCount', { star, count: n })}
                    </span>
                    <span aria-hidden="true">{n}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <ul className={styles.list}>
          {reviews.map((r) => (
            <li key={r.id} className={styles.review}>
              <div className={styles.reviewHead}>
                <strong>{r.authorName}</strong>
                <span aria-label={t('specialist.ratingLabel', { rating: r.rating })}>
                  <span aria-hidden="true">{'★'.repeat(r.rating)}</span>
                </span>
                <time className={styles.date} dateTime={r.date}>
                  {new Date(r.date).toLocaleDateString(lang)}
                </time>
              </div>
              <p className={styles.text}>{r.text}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <Section title={t('reviews.title')}>
      {renderBody()}
      <ReviewForm specialistId={specialistId} />
    </Section>
  )
}
