import { cities } from '../../config/cities'
import type { City, Lang, Specialist, WorkFormat } from '../../types'

export const WORK_FORMATS: readonly WorkFormat[] = ['clinic', 'home', 'online']

export type SortKey =
  | 'firstName'
  | 'lastName'
  | 'specialization'
  | 'experience'
  | 'price'
  | 'rating'
  | 'reviews'
export type SortDir = 'asc' | 'desc'

export const SORT_KEYS: readonly SortKey[] = [
  'firstName',
  'lastName',
  'specialization',
  'experience',
  'price',
  'rating',
  'reviews',
]

export interface SpecialistFilters {
  query: string
  city: City | null
  /** Русские названия специализаций (служат ключами); пусто — любая */
  specializations: string[]
  formats: WorkFormat[]
  priceMin: number | null
  priceMax: number | null
  minExperience: number | null
  minRating: number | null
}

export interface SortState {
  key: SortKey
  dir: SortDir
}

export interface SpecialistsQueryState {
  filters: SpecialistFilters
  sort: SortState
}

export const DEFAULT_FILTERS: SpecialistFilters = {
  query: '',
  city: null,
  specializations: [],
  formats: [],
  priceMin: null,
  priceMax: null,
  minExperience: null,
  minRating: null,
}

export const DEFAULT_SORT: SortState = { key: 'rating', dir: 'desc' }

export const DEFAULT_STATE: SpecialistsQueryState = {
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,
}

/** Количество применённых фильтров (без сортировки). */
export function countActiveFilters(f: SpecialistFilters): number {
  return [
    f.query.trim() !== '',
    f.city !== null,
    f.specializations.length > 0,
    f.formats.length > 0,
    f.priceMin !== null,
    f.priceMax !== null,
    f.minExperience !== null,
    f.minRating !== null,
  ].filter(Boolean).length
}

function parseNumber(value: string | null): number | null {
  if (value === null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/** Разбирает query-параметры URL; некорректные значения игнорируются. */
export function parseQueryState(params: URLSearchParams): SpecialistsQueryState {
  const cityParam = params.get('city')
  const city = cities.find((c) => c.id === cityParam)?.id ?? null
  const formats = (params.get('formats') ?? '')
    .split(',')
    .filter((f): f is WorkFormat => WORK_FORMATS.some((w) => w === f))
  const sortParam = params.get('sort')
  const key = SORT_KEYS.find((k) => k === sortParam) ?? DEFAULT_SORT.key
  const dirParam = params.get('dir')
  const dir: SortDir =
    dirParam === 'asc' || dirParam === 'desc' ? dirParam : DEFAULT_SORT.dir
  const ratingRaw = parseNumber(params.get('rating'))

  return {
    filters: {
      query: params.get('q') ?? '',
      city,
      specializations: [
        ...new Set(
          (params.get('spec') ?? '')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
        ),
      ],
      formats: [...new Set(formats)],
      priceMin: parseNumber(params.get('priceMin')),
      priceMax: parseNumber(params.get('priceMax')),
      minExperience: parseNumber(params.get('exp')),
      minRating: ratingRaw === null ? null : Math.min(ratingRaw, 5),
    },
    sort: { key, dir },
  }
}

/** Сериализует состояние в query-параметры; значения по умолчанию опускаются. */
export function toSearchParams(state: SpecialistsQueryState): URLSearchParams {
  const { filters: f, sort } = state
  const params = new URLSearchParams()
  if (f.query.trim() !== '') params.set('q', f.query)
  if (f.city) params.set('city', f.city)
  if (f.specializations.length > 0) params.set('spec', f.specializations.join(','))
  if (f.formats.length > 0) params.set('formats', f.formats.join(','))
  if (f.priceMin !== null) params.set('priceMin', String(f.priceMin))
  if (f.priceMax !== null) params.set('priceMax', String(f.priceMax))
  if (f.minExperience !== null) params.set('exp', String(f.minExperience))
  if (f.minRating !== null) params.set('rating', String(f.minRating))
  if (sort.key !== DEFAULT_SORT.key) params.set('sort', sort.key)
  if (sort.dir !== DEFAULT_SORT.dir) params.set('dir', sort.dir)
  return params
}

/** Уникальные специализации (по русскому названию), отсортированные для заданного языка. */
export function getSpecializations(list: Specialist[], lang: Lang) {
  const byRu = new Map<string, Specialist['specialization']>()
  for (const s of list) byRu.set(s.specialization.ru, s.specialization)
  const collator = new Intl.Collator(lang)
  return [...byRu.entries()]
    .map(([key, text]) => ({ key, label: text[lang] }))
    .sort((a, b) => collator.compare(a.label, b.label))
}

function matchesQuery(s: Specialist, query: string): boolean {
  const q = query.trim().toLocaleLowerCase()
  if (q === '') return true
  const haystack = [s.firstName, s.lastName, s.specialization.ru, s.specialization.kk]
  return haystack.some((h) => h.toLocaleLowerCase().includes(q))
}

function matchesCity(s: Specialist, city: City | null): boolean {
  if (city === null) return true
  if (s.city === city) return true
  // онлайн-специалист без города доступен из любого города
  return s.city === undefined && s.formats.includes('online')
}

export function filterSpecialists(
  list: Specialist[],
  f: SpecialistFilters,
): Specialist[] {
  return list.filter(
    (s) =>
      matchesQuery(s, f.query) &&
      matchesCity(s, f.city) &&
      (f.specializations.length === 0 ||
        f.specializations.includes(s.specialization.ru)) &&
      (f.formats.length === 0 || f.formats.some((fmt) => s.formats.includes(fmt))) &&
      (f.priceMin === null || s.price >= f.priceMin) &&
      (f.priceMax === null || s.price <= f.priceMax) &&
      (f.minExperience === null || s.experienceYears >= f.minExperience) &&
      (f.minRating === null || s.ratingAvg >= f.minRating),
  )
}

export function sortSpecialists(
  list: Specialist[],
  sort: SortState,
  lang: Lang,
): Specialist[] {
  const collator = new Intl.Collator(lang)
  const compare = (a: Specialist, b: Specialist): number => {
    switch (sort.key) {
      case 'firstName':
        return collator.compare(a.firstName, b.firstName)
      case 'lastName':
        return collator.compare(a.lastName, b.lastName)
      case 'specialization':
        return collator.compare(a.specialization[lang], b.specialization[lang])
      case 'experience':
        return a.experienceYears - b.experienceYears
      case 'price':
        return a.price - b.price
      case 'rating':
        return a.ratingAvg - b.ratingAvg
      case 'reviews':
        return a.reviewsCount - b.reviewsCount
    }
  }
  const sign = sort.dir === 'asc' ? 1 : -1
  return [...list].sort((a, b) => sign * compare(a, b))
}
