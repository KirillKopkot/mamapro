import { useTranslation } from 'react-i18next'
import { useLang } from '../../../i18n/useLang'
import type { Education } from '../../../types'
import { Section } from './Section'
import styles from './EducationSection.module.css'

export function EducationSection({ education }: { education: Education[] }) {
  const { t } = useTranslation()
  const lang = useLang()
  if (education.length === 0) return null

  return (
    <Section title={t('profile.education')}>
      <ul className={styles.list}>
        {education.map((e, i) => (
          <li key={`${e.year}-${i}`} className={styles.item}>
            <span className={styles.year}>{e.year}</span>
            <div>
              <div className={styles.institution}>{e.institution[lang]}</div>
              <div className={styles.program}>{e.program[lang]}</div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
