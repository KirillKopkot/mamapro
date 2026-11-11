import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../features/favorites/hooks'
import { canCompare, getSelectBlockReason } from '../features/compare/comparison'
import { useSpecialists } from '../features/specialists/hooks'
import { SpecialistCard } from '../features/specialists/SpecialistCard'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const favorites = useFavorites()
  const specialists = useSpecialists()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  if (favorites.isPending || specialists.isPending) {
    return <p role="status">{t('common.loading')}</p>
  }
  if (favorites.isError || specialists.isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            void favorites.refetch()
            void specialists.refetch()
          }}
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }

  const items = specialists.data.filter((s) => favorites.data.includes(s.id))
  // выбор учитывает только тех, кто всё ещё в избранном
  const selected = items.filter((s) => selectedIds.includes(s.id))

  function toggle(id: string) {
    setSelectedIds(
      selected.some((s) => s.id === id)
        ? selected.filter((s) => s.id !== id).map((s) => s.id)
        : [...selected.map((s) => s.id), id],
    )
  }

  function goCompare() {
    const [a, b] = selected
    if (a && b && canCompare(selected)) {
      navigate(`/compare?a=${encodeURIComponent(a.id)}&b=${encodeURIComponent(b.id)}`)
    }
  }

  return (
    <div className={styles.page}>
      <h1>{t('pages.favorites')}</h1>

      {items.length === 0 ? (
        <div role="status" className={styles.empty}>
          <p className={styles.emptyTitle}>{t('favorites.empty')}</p>
          <p>{t('favorites.emptyHint')}</p>
          <Link to="/specialists" className={styles.primary}>
            {t('favorites.emptyLink')}
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <span role="status">
              {t('favorites.selectedCount', { count: selected.length })}
            </span>
            <button
              type="button"
              className={styles.primary}
              disabled={!canCompare(selected)}
              onClick={goCompare}
            >
              {t('favorites.compare')}
            </button>
          </div>
          <ul className={styles.list}>
            {items.map((s) => {
              const reason = getSelectBlockReason(selected, s)
              const hintId = `compare-hint-${s.id}`
              return (
                <li key={s.id}>
                  <SpecialistCard
                    specialist={s}
                    footer={
                      <>
                        <label className={styles.check}>
                          <input
                            type="checkbox"
                            checked={selected.some((x) => x.id === s.id)}
                            disabled={reason !== null}
                            aria-describedby={reason ? hintId : undefined}
                            title={
                              reason
                                ? t(
                                    reason === 'maxReached'
                                      ? 'favorites.hintMax'
                                      : 'favorites.hintDifferent',
                                  )
                                : undefined
                            }
                            onChange={() => toggle(s.id)}
                          />
                          <span>{t('favorites.selectForCompare')}</span>
                        </label>
                        {reason && (
                          <p id={hintId} className={styles.hint}>
                            {t(
                              reason === 'maxReached'
                                ? 'favorites.hintMax'
                                : 'favorites.hintDifferent',
                            )}
                          </p>
                        )}
                      </>
                    }
                  />
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
