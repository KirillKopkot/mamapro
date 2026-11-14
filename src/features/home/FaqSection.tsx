import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import { faqItems } from './content'
import styles from './Home.module.css'

export function FaqSection() {
  const { t } = useTranslation()

  function scrollToDirections() {
    const target = document.getElementById('directions')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    target?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
  }

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.faqHead}>
        <h2 id="faq-title">{t('home.faq.title')}</h2>
        <Button
          variant="secondary"
          className={styles.onlyDesktop}
          onClick={scrollToDirections}
        >
          {t('home.faq.directions')}
        </Button>
      </div>
      <ul className={`${styles.faqGrid}`}>
        {faqItems.map((id) => (
          <li key={id}>
            <article className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>{t(`home.faq.items.${id}.q`)}</h3>
              <p className={styles.faqAnswer}>{t(`home.faq.items.${id}.a`)}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
