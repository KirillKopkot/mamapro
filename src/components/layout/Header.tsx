import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brand } from '../../config/brand'
import logoUrl from '../../assets/icons/logo.png'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../features/auth/useAuth'
import { Button, PageContainer } from '../ui'
import { UserMenu } from './UserMenu'
import { headerNav } from './navItems'
import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  // Меню привязано к странице, на которой открыто: при переходе закрывается само
  const [openAt, setOpenAt] = useState<string | null>(null)
  const menuOpen = openAt === pathname
  const setMenuOpen = (open: boolean) => setOpenAt(open ? pathname : null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenAt(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <PageContainer>
        <div className={styles.bar}>
          <Link to="/" className={styles.brand}>
            <img src={logoUrl} alt="" className={styles.logo} width={36} height={36} />
            <span>{brand.name}</span>
          </Link>

          <nav className={styles.nav} aria-label={t('nav.main')}>
            {headerNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className={styles.spacer} />

          <div className={styles.actions}>
            <LanguageSwitcher />
            {user ? (
              <UserMenu />
            ) : (
              !isLoading && (
                <Button to="/login" variant="secondary">
                  {t('auth.loginButton')}
                </Button>
              )
            )}
          </div>

          <div className={styles.mobileLang}>
            <LanguageSwitcher variant="toggle" />
          </div>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </PageContainer>

      {menuOpen && (
        <div id="mobile-menu" className={styles.panel}>
          <nav aria-label={t('nav.main')} className={styles.panelNav}>
            {headerNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={styles.panelLink}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
          {user && (
            <div className={styles.panelNav}>
              <Link to="/child" className={styles.panelLink}>
                {t('auth.childProfile')}
              </Link>
              <button
                type="button"
                className={`${styles.panelLink} ${styles.panelButton}`}
                onClick={async () => {
                  setMenuOpen(false)
                  await logout()
                  navigate('/')
                }}
              >
                {t('auth.logout')}
              </button>
            </div>
          )}
          <div className={styles.panelFooter}>
            <LanguageSwitcher />
            {!user && !isLoading && (
              <Button to="/login" variant="secondary">
                {t('auth.loginButton')}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
