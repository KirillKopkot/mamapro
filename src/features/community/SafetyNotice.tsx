import { useTranslation } from 'react-i18next'
import { emergencyContact } from '../../config/emergency'
import { useLang } from '../../i18n/useLang'
import styles from './Community.module.css'

/** Блок безопасности: чат не заменяет помощь специалиста. */
export function SafetyNotice() {
  const { t } = useTranslation()
  const lang = useLang()
  return (
    <aside className={styles.safety} aria-labelledby="safety-title">
      <h2 id="safety-title" className={styles.safetyTitle}>
        {t('community.safety.title')}
      </h2>
      <p>{t('community.safety.text')}</p>
      {emergencyContact.value !== '' && (
        <p>
          <strong>{emergencyContact.label[lang]}:</strong> {emergencyContact.value}
        </p>
      )}
    </aside>
  )
}
