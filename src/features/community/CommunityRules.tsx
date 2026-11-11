import { useTranslation } from 'react-i18next'
import styles from './Community.module.css'

const RULES = ['respect', 'privacy', 'noAdvice', 'noAds', 'report'] as const

export function CommunityRules() {
  const { t } = useTranslation()
  return (
    <section className={styles.rules} aria-labelledby="rules-title">
      <h2 id="rules-title">{t('community.rules.title')}</h2>
      <ul>
        {RULES.map((r) => (
          <li key={r}>{t(`community.rules.${r}`)}</li>
        ))}
      </ul>
    </section>
  )
}
