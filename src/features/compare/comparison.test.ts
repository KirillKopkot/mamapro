import { describe, expect, it } from 'vitest'
import { mockSpecialists } from '../../mocks'
import type { Specialist } from '../../types'
import {
  canCompare,
  getBestValues,
  getSelectBlockReason,
  isSameSpecialization,
  resolveComparison,
} from './comparison'

const byId = (id: string): Specialist => {
  const s = mockSpecialists.find((x) => x.id === id)
  if (!s) throw new Error(id)
  return s
}
// sp-1, sp-5, sp-9 — логопеды; sp-2 — нейропсихолог; sp-4 — pending
const [sp1, sp2, sp4, sp5, sp9] = ['sp-1', 'sp-2', 'sp-4', 'sp-5', 'sp-9'].map(byId) as [
  Specialist,
  Specialist,
  Specialist,
  Specialist,
  Specialist,
]

describe('isSameSpecialization', () => {
  it('compares by specialization', () => {
    expect(isSameSpecialization(sp1, sp5)).toBe(true)
    expect(isSameSpecialization(sp1, sp2)).toBe(false)
  })
})

describe('getSelectBlockReason', () => {
  it('allows anything when nothing is selected', () => {
    expect(getSelectBlockReason([], sp1)).toBeNull()
  })
  it('blocks other specializations after the first selection', () => {
    expect(getSelectBlockReason([sp1], sp2)).toBe('differentSpecialization')
    expect(getSelectBlockReason([sp1], sp5)).toBeNull()
  })
  it('blocks a third specialist', () => {
    expect(getSelectBlockReason([sp1, sp5], sp9)).toBe('maxReached')
  })
  it('always allows deselecting a selected specialist', () => {
    expect(getSelectBlockReason([sp1, sp5], sp1)).toBeNull()
  })
})

describe('canCompare', () => {
  it('requires exactly two of the same specialization', () => {
    expect(canCompare([])).toBe(false)
    expect(canCompare([sp1])).toBe(false)
    expect(canCompare([sp1, sp5])).toBe(true)
    expect(canCompare([sp1, sp2])).toBe(false)
    expect(canCompare([sp1, sp1])).toBe(false)
  })
})

describe('resolveComparison', () => {
  it('succeeds for two approved specialists of one specialization', () => {
    expect(resolveComparison('sp-1', 'sp-5', sp1, sp5)).toEqual({
      ok: true,
      a: sp1,
      b: sp5,
    })
  })
  it('reports missing and identical ids', () => {
    expect(resolveComparison('', 'sp-5', null, sp5)).toEqual({
      ok: false,
      error: 'missing',
    })
    expect(resolveComparison('sp-1', 'sp-1', sp1, sp1)).toEqual({
      ok: false,
      error: 'same',
    })
  })
  it('reports not found and non-approved specialists', () => {
    expect(resolveComparison('sp-1', 'zzz', sp1, null)).toEqual({
      ok: false,
      error: 'unavailable',
    })
    expect(resolveComparison('sp-1', 'sp-4', sp1, sp4)).toEqual({
      ok: false,
      error: 'unavailable',
    })
  })
  it('reports different specializations', () => {
    expect(resolveComparison('sp-1', 'sp-2', sp1, sp2)).toEqual({
      ok: false,
      error: 'differentSpecialization',
    })
  })
})

describe('getBestValues', () => {
  it('picks higher experience, lower price, higher rating', () => {
    const a = {
      ...sp1,
      experienceYears: 10,
      price: 9000,
      ratingAvg: 4.5,
      reviewsCount: 2,
    }
    const b = { ...sp5, experienceYears: 4, price: 6000, ratingAvg: 4.9, reviewsCount: 3 }
    expect(getBestValues(a, b)).toEqual({ experience: 'a', price: 'b', rating: 'b' })
  })
  it('returns null on ties', () => {
    const a = { ...sp1, experienceYears: 5, price: 1000, ratingAvg: 4, reviewsCount: 1 }
    expect(getBestValues(a, { ...a, id: 'other' })).toEqual({
      experience: null,
      price: null,
      rating: null,
    })
  })
  it('does not highlight rating when someone has no reviews', () => {
    const a = { ...sp1, ratingAvg: 4.5, reviewsCount: 2 }
    const b = { ...sp5, ratingAvg: 0, reviewsCount: 0 }
    expect(getBestValues(a, b).rating).toBeNull()
  })
})
