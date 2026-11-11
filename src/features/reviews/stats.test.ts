import { describe, expect, it } from 'vitest'
import { calcRatingStats } from './stats'

describe('calcRatingStats', () => {
  it('пустой список', () => {
    expect(calcRatingStats([])).toEqual({
      count: 0,
      average: 0,
      distribution: [0, 0, 0, 0, 0],
    })
  })

  it('считает среднее и распределение', () => {
    const stats = calcRatingStats([
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 1 },
    ])
    expect(stats.count).toBe(4)
    expect(stats.average).toBe(3.75)
    expect(stats.distribution).toEqual([1, 0, 0, 1, 2])
  })

  it('игнорирует оценки вне диапазона 1–5', () => {
    const stats = calcRatingStats([{ rating: 0 }, { rating: 6 }, { rating: 3 }])
    expect(stats.count).toBe(1)
    expect(stats.average).toBe(3)
  })
})
