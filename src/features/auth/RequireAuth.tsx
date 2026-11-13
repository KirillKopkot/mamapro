import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from './useAuth'
import { loginUrl } from './redirect'

/** Пускает только вошедшего пользователя; гостя отправляет на /login?next=... */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const { pathname, search } = useLocation()
  if (isLoading) return <p role="status">{t('common.loading')}</p>
  if (!user) return <Navigate to={loginUrl(pathname + search)} replace />
  return <>{children}</>
}
