import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { startQuestions } from './content'
import styles from './Home.module.css'

/** «С чего начать?» — только мобильные, сетка 2×2. */
export function StartSection() {
  const { t } = useTranslation()
  return (
    <section
      className={`${styles.section} ${styles.onlyMobile}`}
      aria-labelledby="start-title"
    >
      <h2 id="start-title">{t('home.start.title')}</h2>
      <ul className={`${styles.grid} ${styles.startGrid} ${styles.list}`}>
        {startQuestions.map((item) => {
          const key = `home.start.items.${item.id}`
          return (
            <li key={item.id}>
              <Link
                to={item.to}
                className={`${styles.tile} ${'pink' in item ? styles.tilePink : ''} ${styles.fill}`}
              >
                <span className={styles.tileTitle}>
                  <Trans
                    i18nKey={`${key}.title`}
                    components={{ accent: <span className={styles.accent} /> }}
                  />
                </span>
                {t(`${key}.text`, { defaultValue: '' }) && (
                  <span className={styles.tileText}>{t(`${key}.text`)}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
