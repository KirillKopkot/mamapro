import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brand } from '../../config/brand'
import { PageContainer } from '../ui'
import styles from './Footer.module.css'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className={styles.footer}>
      <PageContainer>
        <div className={styles.inner}>
          <div>
            <p className={styles.brand}>{brand.name}</p>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </div>
          <nav className={styles.links} aria-label={t('footer.nav')}>
            <Link to="/about" className={styles.link}>
              {t('footer.about')}
            </Link>
            <Link to="/privacy" className={styles.link}>
              {t('footer.privacy')}
            </Link>
            <Link to="/contacts" className={`${styles.link} ${styles.desktopOnly}`}>
              {t('footer.contacts')}
            </Link>
          </nav>
        </div>
      </PageContainer>
    </footer>
  )
}
