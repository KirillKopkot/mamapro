import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import { useReviews } from '../reviews/hooks'
import { Section } from '../specialists/profile/Section'
import styles from './Compare.module.css'

const MAX_REVIEWS = 3

export function CompareReviews({ specialistId }: { specialistId: string }) {
  const { t } = useTranslation()
  const lang = useLang()
  const { data, isPending, isError } = useReviews(specialistId)

  return (
    <Section title={t('reviews.title')}>
      {isPending && <p role="status">{t('common.loading')}</p>}
      {isError && <p role="alert">{t('common.error')}</p>}
      {data && data.length === 0 && <p>{t('reviews.empty')}</p>}
      {data && data.length > 0 && (
        <ul className={styles.reviews}>
          {data.slice(0, MAX_REVIEWS).map((r) => (
            <li key={r.id}>
              <strong>{r.authorName}</strong>{' '}
              <span aria-label={t('specialist.ratingLabel', { rating: r.rating })}>
                <span aria-hidden="true">{'★'.repeat(r.rating)}</span>
              </span>{' '}
              <time dateTime={r.date} className={styles.date}>
                {new Date(r.date).toLocaleDateString(lang)}
              </time>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
