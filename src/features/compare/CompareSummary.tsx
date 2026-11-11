import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import type { Specialist } from '../../types'
import { BestMark } from './BestMark'
import type { BestValues } from './comparison'
import styles from './Compare.module.css'

interface CompareSummaryProps {
  specialist: Specialist
  /** Какие из числовых параметров у этого специалиста лучшие */
  best: Record<keyof BestValues, boolean>
}

/** Краткая сводка: имя, специализация, стаж, цена, рейтинг. */
export function CompareSummary({ specialist: s, best }: CompareSummaryProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const priceText = t(s.priceFrom ? 'price.from' : 'price.value', {
    price: s.price.toLocaleString(lang),
  })

  return (
    <div className={styles.summary}>
      <p className={styles.name}>
        {s.firstName} {s.lastName}
      </p>
      <p className={styles.spec}>{s.specialization[lang]}</p>
      <dl className={styles.facts}>
        <div className={best.experience ? styles.isBest : undefined}>
          <dt>{t('profile.experience')}</dt>
          <dd>
            {t('specialist.years', { count: s.experienceYears })}
            {best.experience && <BestMark />}
          </dd>
        </div>
        <div className={best.price ? styles.isBest : undefined}>
          <dt>{t('profile.price')}</dt>
          <dd>
            {priceText}
            {best.price && <BestMark />}
          </dd>
        </div>
        <div className={best.rating ? styles.isBest : undefined}>
          <dt>{t('profile.rating')}</dt>
          <dd>
            {s.reviewsCount > 0 ? (
              <>
                <span aria-hidden="true">★</span> {s.ratingAvg.toFixed(1)} ·{' '}
                {t('specialist.reviews', { count: s.reviewsCount })}
              </>
            ) : (
              t('specialist.noReviews')
            )}
            {best.rating && <BestMark />}
          </dd>
        </div>
      </dl>
    </div>
  )
}
