import { useTranslation } from 'react-i18next'
import { cities } from '../../config/cities'
import { useLang } from '../../i18n/useLang'
import type { Specialist } from '../../types'
import { Section } from '../specialists/profile/Section'
import styles from './Compare.module.css'

export function FormatsAndLocation({ specialist: s }: { specialist: Specialist }) {
  const { t } = useTranslation()
  const lang = useLang()
  const city = cities.find((c) => c.id === s.city)
  const hasAddress = s.formats.some((f) => f === 'clinic' || f === 'home') && s.address
  const location = [city?.name[lang], hasAddress ? s.address?.[lang] : undefined]
    .filter(Boolean)
    .join(', ')

  return (
    <Section title={t('formats.label')}>
      <ul className={styles.badges}>
        {s.formats.map((f) => (
          <li key={f} className={styles.badge}>
            {t(`formats.${f}`)}
          </li>
        ))}
      </ul>
      {location && (
        <p>
          <strong>{t('profile.location')}: </strong>
          {location}
        </p>
      )}
    </Section>
  )
}
