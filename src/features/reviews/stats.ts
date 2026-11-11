import type { Review } from '../../types'

export interface RatingStats {
  count: number
  average: number
  /** Количество отзывов по оценкам: индекс 0 → 1 звезда, индекс 4 → 5 звёзд. */
  distribution: [number, number, number, number, number]
}

export function calcRatingStats(reviews: readonly Pick<Review, 'rating'>[]): RatingStats {
  const distribution: RatingStats['distribution'] = [0, 0, 0, 0, 0]
  let sum = 0
  for (const { rating } of reviews) {
    const index = Math.round(rating) - 1
    if (index < 0 || index > 4) continue
    distribution[index] = (distribution[index] ?? 0) + 1
    sum += index + 1
  }
  const count = distribution.reduce((a, b) => a + b, 0)
  return { count, average: count ? sum / count : 0, distribution }
}
