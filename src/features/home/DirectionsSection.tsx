import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { directions } from './content'
import { buildDirectionUrl } from './searchUrl'
import styles from './Home.module.css'

/** «Помощь, с которой можно начать» — только десктоп. */
export function DirectionsSection() {
  const { t } = useTranslation()
  return (
    <section
      id="directions"
      className={`${styles.section} ${styles.onlyDesktop}`}
      aria-labelledby="directions-title"
    >
      <div className={styles.sectionHead}>
        <h2 id="directions-title">{t('home.directions.title')}</h2>
        <p className={styles.lead}>{t('home.directions.lead')}</p>
      </div>
      <ul className={`${styles.grid} ${styles.directionsGrid} ${styles.list}`}>
        {directions.map((item, index) => (
          <li key={item.id}>
            <Link
              to={buildDirectionUrl(item.to, item.specializations)}
              className={`${styles.tile} ${'pink' in item ? styles.tilePink : ''} ${styles.fill}`}
            >
              <span className={styles.number}>{`0${index + 1}`}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <span className={`${styles.tileTitle} ${styles.tileTitleGap}`}>
                {t(`home.directions.items.${item.id}.title`)}
              </span>
              <span className={styles.tileText}>
                {t(`home.directions.items.${item.id}.text`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
