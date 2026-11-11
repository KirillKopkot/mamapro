import { useTranslation } from 'react-i18next'
import { useLang } from '../../../i18n/useLang'
import type { Specialist } from '../../../types'
import { Section } from './Section'
import styles from './AboutSection.module.css'

export function AboutSection({ bio }: { bio: Specialist['bio'] }) {
  const { t } = useTranslation()
  const lang = useLang()
  const text = bio[lang].trim()
  if (!text) return null
  return (
    <Section title={t('profile.about')}>
      <p className={styles.text}>{text}</p>
    </Section>
  )
}
