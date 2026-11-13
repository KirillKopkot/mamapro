import { useTranslation } from 'react-i18next'
import { LANGS, setLang } from '../../i18n'
import type { Lang } from '../../types'
import styles from './LanguageSwitcher.module.css'

interface LanguageSwitcherProps {
  /** `group` — обе кнопки «Рус · Қаз»; `toggle` — одна кнопка с текущим языком (переключает на другой). */
  variant?: 'group' | 'toggle'
}

export function LanguageSwitcher({ variant = 'group' }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const current: Lang = i18n.language === 'kk' ? 'kk' : 'ru'

  if (variant === 'toggle') {
    const next = LANGS.find((lang) => lang !== current) ?? 'ru'
    return (
      <button
        type="button"
        className={`${styles.button} ${styles.toggle}`}
        aria-label={`${t('lang.switch')}: ${t(`lang.${next}`)}`}
        onClick={() => setLang(next)}
      >
        {t(`lang.short.${current}`)}
      </button>
    )
  }

  return (
    <div className={styles.root} role="group" aria-label={t('lang.switch')}>
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          className={styles.button}
          lang={lang}
          aria-pressed={current === lang}
          title={t(`lang.${lang}`)}
          onClick={() => setLang(lang)}
        >
          {t(`lang.short.${lang}`)}
        </button>
      ))}
    </div>
  )
}
