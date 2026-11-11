import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MEDIA_TABLET_UP } from '../config/breakpoints'
import { useMediaQuery } from '../components/useMediaQuery'
import { getBestValues, resolveComparison } from '../features/compare/comparison'
import { CompareSummary } from '../features/compare/CompareSummary'
import { compareRows } from '../features/compare/sections'
import { useSpecialist } from '../features/specialists/hooks'
import type { Specialist } from '../types'
import compareStyles from '../features/compare/Compare.module.css'
import styles from './ComparePage.module.css'

export default function ComparePage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const idA = params.get('a') ?? ''
  const idB = params.get('b') ?? ''
  const queryA = useSpecialist(idA)
  const queryB = useSpecialist(idB)
  const isTabletUp = useMediaQuery(MEDIA_TABLET_UP)
  const [openId, setOpenId] = useState<string | null>(null)

  const backLink = (
    <Link to="/favorites" className={styles.link}>
      {t('compare.backToFavorites')}
    </Link>
  )

  if (idA && idB && (queryA.isPending || queryB.isPending)) {
    return <p role="status">{t('common.loading')}</p>
  }
  if (queryA.isError || queryB.isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            void queryA.refetch()
            void queryB.refetch()
          }}
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }

  const result = resolveComparison(idA, idB, queryA.data, queryB.data)
  if (!result.ok) {
    return (
      <div className={styles.page}>
        <h1>{t('pages.compare')}</h1>
        <p role="alert">{t(`compare.errors.${result.error}`)}</p>
        {backLink}
      </div>
    )
  }

  const { a, b } = result
  const bestValues = getBestValues(a, b)
  const bestFor = (side: 'a' | 'b') => ({
    experience: bestValues.experience === side,
    price: bestValues.price === side,
    rating: bestValues.rating === side,
  })
  const sides: { side: 'a' | 'b'; specialist: Specialist }[] = [
    { side: 'a', specialist: a },
    { side: 'b', specialist: b },
  ]

  return (
    <div className={styles.page}>
      <h1>{t('pages.compare')}</h1>
      {backLink}

      {isTabletUp ? (
        <div className={compareStyles.grid}>
          {sides.map(({ side, specialist }) => (
            <div key={`summary-${side}`} className={compareStyles.cell}>
              <CompareSummary specialist={specialist} best={bestFor(side)} />
            </div>
          ))}
          {compareRows
            .filter((row) => row.hasData(a) || row.hasData(b))
            .flatMap((row) =>
              sides.map(({ side, specialist }) => (
                <div key={`${row.key}-${side}`} className={compareStyles.cell}>
                  {row.hasData(specialist) ? row.render(specialist) : null}
                </div>
              )),
            )}
        </div>
      ) : (
        <div className={compareStyles.accordion}>
          {sides.map(({ side, specialist }) => {
            const open = openId === specialist.id
            const panelId = `compare-panel-${specialist.id}`
            return (
              <article key={specialist.id} className={compareStyles.item}>
                <div
                  className={compareStyles.toggle}
                  onClick={() => setOpenId(open ? null : specialist.id)}
                >
                  <CompareSummary specialist={specialist} best={bestFor(side)} />
                  <button
                    type="button"
                    className={compareStyles.toggleButton}
                    aria-expanded={open}
                    aria-controls={panelId}
                  >
                    {open ? t('common.close') : t('compare.details')}
                  </button>
                </div>
                {open && (
                  <div id={panelId} className={compareStyles.panel}>
                    {compareRows
                      .filter((row) => row.hasData(specialist))
                      .map((row) => (
                        <div key={row.key}>{row.render(specialist)}</div>
                      ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
