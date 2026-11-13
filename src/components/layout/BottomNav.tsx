import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { bottomNav } from './navItems'
import styles from './BottomNav.module.css'

export function BottomNav() {
  const { t } = useTranslation()
  return (
    <nav className={styles.nav} aria-label={t('nav.bottom')}>
      {bottomNav.map((item) => (
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
  )
}
