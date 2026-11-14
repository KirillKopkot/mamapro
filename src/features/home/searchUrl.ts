import { DEFAULT_FILTERS, DEFAULT_SORT, toSearchParams } from '../specialists/filtering'
import { formatChoiceToFormats, type FormatChoice } from './content'

/** Адрес страницы специалистов по запросу с главной (параметры q и formats). */
export function buildSearchUrl(query: string, format: FormatChoice): string {
  const params = toSearchParams({
    filters: { ...DEFAULT_FILTERS, query, formats: formatChoiceToFormats[format] },
    sort: DEFAULT_SORT,
  })
  const search = params.toString()
  return search ? `/specialists?${search}` : '/specialists'
}

/** Адрес страницы специалистов с предустановленным фильтром специализаций. */
export function buildDirectionUrl(
  to: string,
  specializations: readonly string[],
): string {
  if (specializations.length === 0) return to
  const params = toSearchParams({
    filters: { ...DEFAULT_FILTERS, specializations: [...specializations] },
    sort: DEFAULT_SORT,
  })
  return `${to}?${params.toString()}`
}
