import { useTranslation } from 'react-i18next'
import { steps } from './content'
import styles from './Home.module.css'

export function StepsSection() {
  const { t } = useTranslation()
  return (
    <section
      className={`${styles.section} ${styles.stepsSection}`}
      aria-labelledby="steps-title"
    >
      <div className={styles.sectionHead}>
        <h2 id="steps-title" className={styles.stepsTitle}>
          {t('home.steps.title')}
        </h2>
        <p className={`${styles.lead} ${styles.onlyDesktop}`}>{t('home.steps.lead')}</p>
      </div>
      <ol className={`${styles.steps}`}>
        {steps.map((id, index) => (
          <li key={id} className={styles.step}>
            <span className={styles.stepNumber} aria-hidden="true">
              {index + 1}
            </span>
            <div className={styles.stepBody}>
              <h3 className={styles.tileTitle}>{t(`home.steps.items.${id}.title`)}</h3>
              <p className={styles.tileText}>{t(`home.steps.items.${id}.text`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
