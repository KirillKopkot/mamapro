import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_STATE, parseQueryState, toSearchParams } from './filtering'
import type { SortState, SpecialistFilters } from './filtering'

/** Состояние фильтров и сортировки, хранящееся в URL query-параметрах. */
export function useSpecialistsQuery() {
  const [params, setParams] = useSearchParams()
  const state = useMemo(() => parseQueryState(params), [params])

  return {
    filters: state.filters,
    sort: state.sort,
    setFilters: (patch: Partial<SpecialistFilters>) =>
      setParams(toSearchParams({ ...state, filters: { ...state.filters, ...patch } }), {
        replace: true,
      }),
    setSort: (sort: SortState) =>
      setParams(toSearchParams({ ...state, sort }), { replace: true }),
    reset: () =>
      setParams(toSearchParams({ ...DEFAULT_STATE, sort: state.sort }), {
        replace: true,
      }),
  }
}
