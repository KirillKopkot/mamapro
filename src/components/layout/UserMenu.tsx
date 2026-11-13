import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../features/auth/useAuth'
import styles from './UserMenu.module.css'

/** Круглая аватарка вошедшего пользователя с меню (Профиль ребёнка, Выйти). */
export function UserMenu() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // привязано к странице: при переходе меню закрывается само
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === pathname
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenAt(null)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpenAt(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  if (!user) return null

  async function onLogout() {
    setOpenAt(null)
    await logout()
    navigate('/')
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.avatar}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('nav.account')}: ${user.name}`}
        onClick={() => setOpenAt(open ? null : pathname)}
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          aria-hidden="true"
          fill="currentColor"
        >
          <circle cx="12" cy="8.5" r="4" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
        </svg>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <p className={styles.name}>{user.name}</p>
          <Link to="/child" className={styles.item} role="menuitem">
            {t('auth.childProfile')}
          </Link>
          <button
            type="button"
            className={styles.item}
            role="menuitem"
            onClick={onLogout}
          >
            {t('auth.logout')}
          </button>
        </div>
      )}
    </div>
  )
}
