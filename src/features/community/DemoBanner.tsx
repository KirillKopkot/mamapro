import { useTranslation } from 'react-i18next'
import styles from './Community.module.css'

export function DemoBanner({ messageKey }: { messageKey: string }) {
  const { t } = useTranslation()
  return (
    <p className={styles.demo} role="note">
      {t(messageKey)}
    </p>
  )
}
