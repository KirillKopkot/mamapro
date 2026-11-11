import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArticlesList } from '../features/support/ArticlesList'
import styles from '../features/support/Support.module.css'

export default function SupportDocumentsPage() {
  const { t } = useTranslation()
  return (
    <div className={styles.list}>
      <Link to="/support">← {t('pages.support')}</Link>
      <h1>{t('pages.supportDocuments')}</h1>
      <p className={styles.demo} role="note">
        {t('support.demoNotice')}
      </p>
      <ArticlesList category="documents" />
    </div>
  )
}
