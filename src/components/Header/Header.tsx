import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brand } from '../../config/brand'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import { navItems } from '../navItems'
import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.logo} role="img" aria-label={t('brand.logoAlt')}>
            {brand.logoLetter}
          </span>
          <span className={styles.name}>{brand.name}</span>
        </NavLink>
        <nav className={styles.nav} aria-label={t('nav.main')}>
          {navItems.map((item) => (
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
        <LanguageSwitcher />
      </div>
    </header>
  )
}
