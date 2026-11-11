import { useTranslation } from 'react-i18next'
import { LANGS, setLang } from '../../i18n'
import styles from './LanguageSwitcher.module.css'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  return (
    <div className={styles.root} role="group" aria-label={t('lang.switch')}>
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          className={styles.button}
          aria-pressed={i18n.language === lang}
          title={t(`lang.${lang}`)}
          onClick={() => setLang(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
