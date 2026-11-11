import type { Specialist } from '../../types'

export const MAX_COMPARE = 2

export function isSameSpecialization(a: Specialist, b: Specialist): boolean {
  return a.specialization.ru === b.specialization.ru
}

export type SelectBlockReason = 'maxReached' | 'differentSpecialization'

/**
 * Почему specialist нельзя добавить к выбранным для сравнения (null — можно).
 * Уже выбранного специалиста всегда можно снять.
 */
export function getSelectBlockReason(
  selected: readonly Specialist[],
  candidate: Specialist,
): SelectBlockReason | null {
  if (selected.some((s) => s.id === candidate.id)) return null
  const first = selected[0]
  if (first && !isSameSpecialization(first, candidate)) return 'differentSpecialization'
  if (selected.length >= MAX_COMPARE) return 'maxReached'
  return null
}

/** Можно ли перейти к сравнению: ровно два специалиста одной специализации. */
export function canCompare(selected: readonly Specialist[]): boolean {
  const [a, b] = selected
  return (
    selected.length === MAX_COMPARE &&
    !!a &&
    !!b &&
    a.id !== b.id &&
    isSameSpecialization(a, b)
  )
}

export type CompareError = 'missing' | 'same' | 'unavailable' | 'differentSpecialization'

export type CompareResolution =
  { ok: true; a: Specialist; b: Specialist } | { ok: false; error: CompareError }

/** Проверяет параметры страницы сравнения и загруженных специалистов. */
export function resolveComparison(
  idA: string,
  idB: string,
  a: Specialist | null | undefined,
  b: Specialist | null | undefined,
): CompareResolution {
  if (!idA || !idB) return { ok: false, error: 'missing' }
  if (idA === idB) return { ok: false, error: 'same' }
  if (!a || !b || a.status !== 'approved' || b.status !== 'approved') {
    return { ok: false, error: 'unavailable' }
  }
  if (!isSameSpecialization(a, b)) return { ok: false, error: 'differentSpecialization' }
  return { ok: true, a, b }
}

export type Side = 'a' | 'b' | null

function best(a: number, b: number, prefer: 'higher' | 'lower'): Side {
  if (a === b) return null
  const aWins = prefer === 'higher' ? a > b : a < b
  return aWins ? 'a' : 'b'
}

export interface BestValues {
  experience: Side
  price: Side
  rating: Side
}

/** Кто лучше по числовым параметрам: больший стаж, меньшая цена, больший рейтинг. null — ничья. */
export function getBestValues(a: Specialist, b: Specialist): BestValues {
  return {
    experience: best(a.experienceYears, b.experienceYears, 'higher'),
    price: best(a.price, b.price, 'lower'),
    // специалист без отзывов не получает отметку «лучший рейтинг»
    rating:
      a.reviewsCount === 0 || b.reviewsCount === 0
        ? null
        : best(a.ratingAvg, b.ratingAvg, 'higher'),
  }
}
