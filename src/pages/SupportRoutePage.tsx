import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RouteStepper } from '../features/support/RouteStepper'
import styles from '../features/support/Support.module.css'

export default function SupportRoutePage() {
  const { t } = useTranslation()
  return (
    <div className={styles.list}>
      <Link to="/support">← {t('pages.support')}</Link>
      <h1>{t('pages.supportRoute')}</h1>
      <p>{t('support.route.intro')}</p>
      <RouteStepper />
    </div>
  )
}
