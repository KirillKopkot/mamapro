import { useTranslation } from 'react-i18next'
import { useLang } from '../../../i18n/useLang'
import type { SpecialistCase } from '../../../types'
import { Section } from './Section'
import styles from './CasesSection.module.css'

export function CasesSection({ cases }: { cases: SpecialistCase[] }) {
  const { t } = useTranslation()
  const lang = useLang()
  if (cases.length === 0) return null

  return (
    <Section title={t('profile.cases')}>
      <ul className={styles.list}>
        {cases.map((c) => (
          <li key={c.id} className={styles.card}>
            <h3 className={styles.title}>{c.title[lang]}</h3>
            <p className={styles.description}>{c.description[lang]}</p>
            <div className={styles.compare}>
              <div className={styles.block}>
                <h4 className={styles.blockTitle}>{t('profile.before')}</h4>
                {c.beforeImage && (
                  <img
                    src={c.beforeImage}
                    alt={t('profile.beforeImageAlt')}
                    loading="lazy"
                  />
                )}
                <p>{c.resultBefore[lang]}</p>
              </div>
              <div className={styles.block}>
                <h4 className={styles.blockTitle}>{t('profile.after')}</h4>
                {c.afterImage && (
                  <img
                    src={c.afterImage}
                    alt={t('profile.afterImageAlt')}
                    loading="lazy"
                  />
                )}
                <p>{c.resultAfter[lang]}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
