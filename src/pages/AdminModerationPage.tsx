import { useTranslation } from 'react-i18next'
import { usePendingReviews, usePendingSpecialists } from '../features/moderation/hooks'
import { ReviewModerationCard } from '../features/moderation/ReviewModerationCard'
import { SpecialistModerationCard } from '../features/moderation/SpecialistModerationCard'
import styles from '../features/moderation/Moderation.module.css'

export default function AdminModerationPage() {
  const { t } = useTranslation()
  const specialists = usePendingSpecialists()
  const reviews = usePendingReviews()

  return (
    <div className={styles.stack}>
      <h1>{t('pages.adminModeration')}</h1>


      <section aria-labelledby="mod-profiles">
        <h2 id="mod-profiles">{t('moderation.profilesTitle')}</h2>
        {specialists.isPending && <p role="status">{t('common.loading')}</p>}
        {specialists.isError && (
          <div role="alert">
            <p>{t('common.error')}</p>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => void specialists.refetch()}
            >
              {t('common.retry')}
            </button>
          </div>
        )}
        {specialists.data && specialists.data.length === 0 && (
          <p>{t('moderation.noProfiles')}</p>
        )}
        {specialists.data && specialists.data.length > 0 && (
          <ul className={styles.list}>
            {specialists.data.map((s) => (
              <li key={s.id}>
                <SpecialistModerationCard specialist={s} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="mod-reviews">
        <h2 id="mod-reviews">{t('moderation.reviewsTitle')}</h2>
        {reviews.isPending && <p role="status">{t('common.loading')}</p>}
        {reviews.isError && (
          <div role="alert">
            <p>{t('common.error')}</p>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => void reviews.refetch()}
            >
              {t('common.retry')}
            </button>
          </div>
        )}
        {reviews.data && reviews.data.length === 0 && <p>{t('moderation.noReviews')}</p>}
        {reviews.data && reviews.data.length > 0 && (
          <ul className={styles.list}>
            {reviews.data.map((r) => (
              <li key={r.id}>
                <ReviewModerationCard review={r} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
