import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import styles from './Home.module.css'

/** Зелёный баннер «Можно быть мамой…» — только десктоп. */
export function BannerSection() {
  const { t } = useTranslation()
  return (
    <section
      className={`${styles.banner} ${styles.onlyDesktop}`}
      aria-labelledby="banner-title"
    >
      <div className={styles.bannerText}>
        <h2 id="banner-title" className={styles.bannerTitle}>
          <span className={styles.heroLine}>{t('home.banner.line1')}</span>
          <span className={styles.heroLine}>{t('home.banner.line2')}</span>
        </h2>
        <p className={styles.bannerLead}>{t('home.banner.lead')}</p>
      </div>
      <Button to="/support" variant="secondary" size="lg">
        {t('home.banner.cta')} <span aria-hidden="true">→</span>
      </Button>
    </section>
  )
}
