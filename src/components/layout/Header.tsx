import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brand } from '../../config/brand'
import logoUrl from '../../assets/icons/logo.svg'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import { Button, PageContainer } from '../ui'
import { headerNav } from './navItems'
import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
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
            <Button to="/login" variant="secondary">
              {t('auth.login')}
            </Button>
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
          <div className={styles.panelFooter}>
            <LanguageSwitcher />
            <Button to="/login" variant="secondary">
              {t('auth.login')}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
