import { useTranslation } from 'react-i18next'
import { useFavorites, useToggleFavorite } from './hooks'
import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  specialistId: string
  className?: string
}

export function FavoriteButton({ specialistId, className }: FavoriteButtonProps) {
  const { t } = useTranslation()
  const { data: favorites = [] } = useFavorites()
  const toggle = useToggleFavorite()
  const active = favorites.includes(specialistId)
  const label = t(active ? 'favorites.remove' : 'favorites.add')

  return (
    <button
      type="button"
      className={`${styles.button} ${active ? styles.active : ''} ${className ?? ''}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      disabled={toggle.isPending}
      onClick={() => toggle.mutate(specialistId)}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3 5 6.3 5c1.9 0 3.5 1 4.2 2.4h3C14.2 6 15.8 5 17.7 5 21 5 22.8 8.4 21.5 11.7 19.500 16.400 12 21 12 21z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
