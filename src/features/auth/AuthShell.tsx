import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Eyebrow } from '../../components/ui'
import styles from './Auth.module.css'

interface AuthShellProps {
  mode: 'login' | 'register'
  children: ReactNode
}

const POINTS = ['help', 'people', 'control'] as const

/** Общий каркас /login и /register: розовый блок слева, вкладки и форма справа. */
export function AuthShell({ mode, children }: AuthShellProps) {
  const { t } = useTranslation()
  const active = (name: 'login' | 'register') => (mode === name ? 'primary' : 'secondary')
  const current = (name: 'login' | 'register') => (mode === name ? 'page' : undefined)

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <span aria-hidden="true">← </span>
        {t('auth.backHome')}
      </Link>
      <div className={styles.layout}>
        <section className={styles.hero} aria-labelledby="auth-hero-title">
          <Eyebrow>{t('auth.eyebrow')}</Eyebrow>
          <h1 id="auth-hero-title" className={styles.heroTitle}>
            {t(`auth.${mode}.heroTitle`)}
          </h1>
          <p className={styles.heroLead}>{t(`auth.${mode}.heroLead`)}</p>
          <ul className={styles.points}>
            {POINTS.map((key, index) => (
              <li key={key} className={styles.point}>
                <h2>{`0${index + 1} ${t(`auth.points.${key}.title`)}`}</h2>
                <p>{t(`auth.points.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </section>
        <div className={styles.side}>
          <nav className={styles.tabs} aria-label={t('auth.tabs')}>
            <Button
              to="/login"
              size="lg"
              variant={active('login')}
              aria-current={current('login')}
            >
              {t('auth.tabLogin')}
            </Button>
            <Button
              to="/register"
              size="lg"
              variant={active('register')}
              aria-current={current('register')}
            >
              {t('auth.tabRegister')}
            </Button>
          </nav>
          {children}
        </div>
      </div>
    </div>
  )
}
