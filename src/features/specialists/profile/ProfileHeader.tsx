import { useTranslation } from 'react-i18next'
import { cities } from '../../../config/cities'
import { useLang } from '../../../i18n/useLang'
import type { Specialist } from '../../../types'
import { FavoriteButton } from '../../favorites/FavoriteButton'
import styles from './ProfileHeader.module.css'

export function ProfileHeader({ specialist: s }: { specialist: Specialist }) {
  const { t } = useTranslation()
  const lang = useLang()
  const city = cities.find((c) => c.id === s.city)
  const hasAddress = s.formats.some((f) => f === 'clinic' || f === 'home') && s.address
  const location = [city?.name[lang], hasAddress ? s.address?.[lang] : undefined]
    .filter(Boolean)
    .join(', ')
  const priceText = t(s.priceFrom ? 'price.from' : 'price.value', {
    price: s.price.toLocaleString(lang),
  })

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.name}>
            {s.firstName} {s.lastName}
          </h1>
          <p className={styles.spec}>{s.specialization[lang]}</p>
        </div>
        <FavoriteButton specialistId={s.id} />
      </div>
      <dl className={styles.facts}>
        <div>
          <dt>{t('profile.experience')}</dt>
          <dd>{t('specialist.years', { count: s.experienceYears })}</dd>
        </div>
        <div>
          <dt>{t('profile.price')}</dt>
          <dd>{priceText}</dd>
        </div>
        <div>
          <dt>{t('formats.label')}</dt>
          <dd>
            <ul className={styles.badges}>
              {s.formats.map((f) => (
                <li key={f} className={styles.badge}>
                  {t(`formats.${f}`)}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        {location && (
          <div>
            <dt>{t('profile.location')}</dt>
            <dd>{location}</dd>
          </div>
        )}
        <div>
          <dt>{t('profile.rating')}</dt>
          <dd>
            {s.reviewsCount > 0 ? (
              <span aria-label={t('specialist.ratingLabel', { rating: s.ratingAvg })}>
                <span aria-hidden="true">★</span> {s.ratingAvg.toFixed(1)} ·{' '}
                {t('specialist.reviews', { count: s.reviewsCount })}
              </span>
            ) : (
              t('specialist.noReviews')
            )}
          </dd>
        </div>
      </dl>
    </header>
  )
}
