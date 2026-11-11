import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/useLang'
import { FiltersPanel } from '../features/specialists/FiltersPanel'
import { SortBar } from '../features/specialists/SortBar'
import { SpecialistCard } from '../features/specialists/SpecialistCard'
import {
  countActiveFilters,
  filterSpecialists,
  sortSpecialists,
} from '../features/specialists/filtering'
import { useSpecialists } from '../features/specialists/hooks'
import { useSpecialistsQuery } from '../features/specialists/useSpecialistsQuery'
import styles from './SpecialistsPage.module.css'

export default function SpecialistsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const { data, isPending, isError, refetch } = useSpecialists()
  const { filters, sort, setFilters, setSort, reset } = useSpecialistsQuery()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const visible = useMemo(
    () => sortSpecialists(filterSpecialists(data ?? [], filters), sort, lang),
    [data, filters, sort, lang],
  )
  const activeCount = countActiveFilters(filters)

  function renderResults() {
    if (isPending) return <p role="status">{t('common.loading')}</p>
    if (isError) {
      return (
        <div role="alert">
          <p>{t('common.error')}</p>
          <button type="button" className={styles.button} onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </div>
      )
    }
    if (visible.length === 0) {
      return (
        <div role="status">
          <p className={styles.emptyTitle}>{t('specialists.empty')}</p>
          <p>{t('specialists.emptyHint')}</p>
          <button type="button" className={styles.button} onClick={reset}>
            {t('specialists.reset')}
          </button>
        </div>
      )
    }
    return (
      <>
        <p className={styles.count} role="status">
          {t('specialists.found', { count: visible.length })}
        </p>
        <ul className={styles.list}>
          {visible.map((s) => (
            <li key={s.id}>
              <SpecialistCard specialist={s} />
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div className={styles.page}>
      <h1>{t('pages.specialists')}</h1>
      <div className={styles.layout}>
        <FiltersPanel
          specialists={data ?? []}
          filters={filters}
          open={filtersOpen}
          onChange={setFilters}
          onReset={reset}
          onClose={() => setFiltersOpen(false)}
        />
        <div className={styles.content}>
          <input
            type="search"
            className={styles.search}
            aria-label={t('specialists.searchLabel')}
            placeholder={t('specialists.searchPlaceholder')}
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
          />
          <div className={styles.toolbar}>
            <button
              type="button"
              className={`${styles.button} ${styles.filtersButton}`}
              onClick={() => setFiltersOpen(true)}
            >
              {t('specialists.filters')}
              {activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
            <SortBar sort={sort} onChange={setSort} />
          </div>
          {renderResults()}
        </div>
      </div>
    </div>
  )
}
