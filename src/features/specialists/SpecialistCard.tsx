import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cities } from '../../config/cities'
import { useLang } from '../../i18n/useLang'
import type { Specialist } from '../../types'
import { FavoriteButton } from '../favorites/FavoriteButton'
import styles from './SpecialistCard.module.css'

interface SpecialistCardProps {
  specialist: Specialist
  /** Дополнительный блок под карточкой (например, чекбокс сравнения) */
  footer?: ReactNode
}

export function SpecialistCard({ specialist: s, footer }: SpecialistCardProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const city = cities.find((c) => c.id === s.city)
  const priceText = t(s.priceFrom ? 'price.from' : 'price.value', {
    price: s.price.toLocaleString(lang),
  })

  return (
    <article className={styles.card}>
      <Link to={`/specialists/${s.id}`} className={styles.link}>
        <h2 className={styles.name}>
          {s.firstName} {s.lastName}
        </h2>
        <p className={styles.spec}>{s.specialization[lang]}</p>
        <p className={styles.meta}>
          {t('specialist.years', { count: s.experienceYears })}
          {city ? ` · ${city.name[lang]}` : ''}
        </p>
        <ul className={styles.badges}>
          {s.formats.map((f) => (
            <li key={f} className={styles.badge}>
              {t(`formats.${f}`)}
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <span className={styles.price}>{priceText}</span>
          <span
            className={styles.rating}
            aria-label={
              s.reviewsCount > 0
                ? t('specialist.ratingLabel', { rating: s.ratingAvg })
                : undefined
            }
          >
            {s.reviewsCount > 0 ? (
              <>
                <span aria-hidden="true">★</span> {s.ratingAvg.toFixed(1)} ·{' '}
                {t('specialist.reviews', { count: s.reviewsCount })}
              </>
            ) : (
              t('specialist.noReviews')
            )}
          </span>
        </div>
      </Link>
      <FavoriteButton specialistId={s.id} className={styles.favorite} />
      {footer && <div className={styles.extra}>{footer}</div>}
    </article>
  )
}
