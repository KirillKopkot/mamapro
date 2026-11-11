import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from '../features/support/Support.module.css'

const sections = [
  { to: '/support/documents', key: 'documents' },
  { to: '/support/benefits', key: 'benefits' },
  { to: '/support/route', key: 'route' },
] as const

export default function SupportPage() {
  const { t } = useTranslation()
  return (
    <div className={styles.list}>
      <h1>{t('pages.support')}</h1>
      <p>{t('support.intro')}</p>
      <ul className={styles.hub}>
        {sections.map((s) => (
          <li key={s.key}>
            <Link to={s.to} className={styles.hubCard}>
              <h2 className={styles.hubTitle}>{t(`support.hub.${s.key}.title`)}</h2>
              <p className={styles.hubText}>{t(`support.hub.${s.key}.text`)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
