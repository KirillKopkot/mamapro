import { describe, expect, it } from 'vitest'
import { mockSpecialists } from '../../mocks'
import type { Specialist } from '../../types'
import {
  DEFAULT_FILTERS,
  DEFAULT_STATE,
  countActiveFilters,
  filterSpecialists,
  getSpecializations,
  parseQueryState,
  sortSpecialists,
  toSearchParams,
} from './filtering'

function make(over: Partial<Specialist> & { id: string }): Specialist {
  return {
    ...mockSpecialists[0]!,
    cases: [],
    education: [],
    socials: [],
    ...over,
  }
}

const approved = mockSpecialists.filter((s) => s.status === 'approved')

describe('filterSpecialists', () => {
  it('returns everything with default filters', () => {
    expect(filterSpecialists(approved, DEFAULT_FILTERS)).toHaveLength(approved.length)
  })

  it('searches by name and by specialization in both languages', () => {
    const byName = filterSpecialists(approved, { ...DEFAULT_FILTERS, query: 'данияр' })
    expect(byName.map((s) => s.id)).toEqual(['sp-2'])
    const byRu = filterSpecialists(approved, { ...DEFAULT_FILTERS, query: 'дефектолог' })
    expect(byRu.every((s) => s.specialization.ru === 'Дефектолог')).toBe(true)
    const byKk = filterSpecialists(approved, { ...DEFAULT_FILTERS, query: 'нейропсих' })
    expect(byKk.length).toBeGreaterThan(0)
  })

  it('filters by city, keeping online specialists without a city', () => {
    const res = filterSpecialists(approved, { ...DEFAULT_FILTERS, city: 'astana' })
    expect(
      res.every((s) => s.city === 'astana' || (!s.city && s.formats.includes('online'))),
    ).toBe(true)
    expect(res.some((s) => s.city === 'almaty')).toBe(false)
    expect(res.some((s) => s.id === 'sp-5')).toBe(true)
  })

  it('filters by specialization', () => {
    const res = filterSpecialists(approved, {
      ...DEFAULT_FILTERS,
      specializations: ['Логопед'],
    })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((s) => s.specialization.ru === 'Логопед')).toBe(true)
  })

  it('filters by several specializations at once', () => {
    const res = filterSpecialists(approved, {
      ...DEFAULT_FILTERS,
      specializations: ['Логопед', 'Дефектолог'],
    })
    expect(res.some((s) => s.specialization.ru === 'Логопед')).toBe(true)
    expect(res.some((s) => s.specialization.ru === 'Дефектолог')).toBe(true)
    expect(
      res.every((s) => ['Логопед', 'Дефектолог'].includes(s.specialization.ru)),
    ).toBe(true)
  })

  it('formats filter matches any selected format', () => {
    const res = filterSpecialists(approved, { ...DEFAULT_FILTERS, formats: ['home'] })
    expect(res.every((s) => s.formats.includes('home'))).toBe(true)
    const both = filterSpecialists(approved, {
      ...DEFAULT_FILTERS,
      formats: ['home', 'online'],
    })
    expect(both.length).toBeGreaterThanOrEqual(res.length)
  })

  it('filters by price range, experience and rating', () => {
    const res = filterSpecialists(approved, {
      ...DEFAULT_FILTERS,
      priceMin: 7000,
      priceMax: 10000,
      minExperience: 5,
      minRating: 4.5,
    })
    expect(res.length).toBeGreaterThan(0)
    for (const s of res) {
      expect(s.price).toBeGreaterThanOrEqual(7000)
      expect(s.price).toBeLessThanOrEqual(10000)
      expect(s.experienceYears).toBeGreaterThanOrEqual(5)
      expect(s.ratingAvg).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterSpecialists(approved, { ...DEFAULT_FILTERS, query: 'zzzzz' })).toEqual(
      [],
    )
  })
})

describe('sortSpecialists', () => {
  it('does not mutate the input', () => {
    const copy = [...approved]
    sortSpecialists(approved, { key: 'price', dir: 'asc' }, 'ru')
    expect(approved).toEqual(copy)
  })

  it('sorts numbers in both directions', () => {
    const asc = sortSpecialists(approved, { key: 'price', dir: 'asc' }, 'ru').map(
      (s) => s.price,
    )
    expect(asc).toEqual([...asc].sort((a, b) => a - b))
    const desc = sortSpecialists(approved, { key: 'experience', dir: 'desc' }, 'ru').map(
      (s) => s.experienceYears,
    )
    expect(desc).toEqual([...desc].sort((a, b) => b - a))
  })

  it('sorts by rating and reviews count', () => {
    const r = sortSpecialists(approved, { key: 'rating', dir: 'desc' }, 'ru')
    expect(r[0]?.id).toBe('sp-7')
    const c = sortSpecialists(approved, { key: 'reviews', dir: 'desc' }, 'ru')
    expect(c[0]?.id).toBe('sp-9')
  })

  it('sorts strings with locale rules', () => {
    const list = ['Бауыржан', 'Әлия', 'Айгерим'].map((firstName, i) =>
      make({ id: `x${i}`, firstName }),
    )
    const kk = sortSpecialists(list, { key: 'firstName', dir: 'asc' }, 'kk').map(
      (s) => s.firstName,
    )
    expect(kk).toEqual(['Айгерим', 'Әлия', 'Бауыржан'])
    const desc = sortSpecialists(list, { key: 'firstName', dir: 'desc' }, 'kk').map(
      (s) => s.firstName,
    )
    expect(desc).toEqual(['Бауыржан', 'Әлия', 'Айгерим'])
  })

  it('uses the localized specialization for sorting', () => {
    const list = [
      make({ id: 'a', specialization: { ru: 'Я', kk: 'А' } }),
      make({ id: 'b', specialization: { ru: 'А', kk: 'Я' } }),
    ]
    expect(
      sortSpecialists(list, { key: 'specialization', dir: 'asc' }, 'ru').map((s) => s.id),
    ).toEqual(['b', 'a'])
    expect(
      sortSpecialists(list, { key: 'specialization', dir: 'asc' }, 'kk').map((s) => s.id),
    ).toEqual(['a', 'b'])
  })
})

describe('URL state', () => {
  it('uses defaults for empty params and omits defaults when serializing', () => {
    expect(parseQueryState(new URLSearchParams())).toEqual(DEFAULT_STATE)
    expect(toSearchParams(DEFAULT_STATE).toString()).toBe('')
  })

  it('round-trips a full state', () => {
    const state = {
      filters: {
        query: 'аб',
        city: 'almaty' as const,
        specializations: ['Логопед', 'Дефектолог'],
        formats: ['home' as const, 'online' as const],
        priceMin: 5000,
        priceMax: 12000,
        minExperience: 3,
        minRating: 4,
      },
      sort: { key: 'price' as const, dir: 'asc' as const },
    }
    expect(parseQueryState(toSearchParams(state))).toEqual(state)
  })

  it('ignores invalid values', () => {
    const state = parseQueryState(
      new URLSearchParams(
        'city=paris&formats=clinic,boat&priceMin=-5&exp=abc&rating=9&sort=x&dir=up',
      ),
    )
    expect(state.filters.city).toBeNull()
    expect(state.filters.formats).toEqual(['clinic'])
    expect(state.filters.priceMin).toBeNull()
    expect(state.filters.minExperience).toBeNull()
    expect(state.filters.minRating).toBe(5)
    expect(state.sort).toEqual(DEFAULT_STATE.sort)
  })

  it('counts active filters', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0)
    expect(
      countActiveFilters({ ...DEFAULT_FILTERS, city: 'astana', formats: ['home'] }),
    ).toBe(2)
  })
})

describe('getSpecializations', () => {
  it('returns unique localized options', () => {
    const opts = getSpecializations(approved, 'ru')
    expect(opts.map((o) => o.key).sort()).toEqual(
      ['ABA-терапевт', 'Дефектолог', 'Логопед', 'Нейропсихолог'].sort(),
    )
  })
})
