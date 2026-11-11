import { mockReviews, mockSpecialists } from '../mocks'
import type { LocalizedText, Review, Specialist } from '../types'
import { delay, readStorage, storageKeys, writeStorage } from './storage'

export async function listPendingReviews(): Promise<Review[]> {
  await delay()
  return readStorage<Review[]>(storageKeys.reviews, () => mockReviews).filter(
    (r) => r.status === 'pending',
  )
}

export type ReviewDecision =
  { status: 'approved' } | { status: 'rejected'; reason: LocalizedText }

/** Одобряет или отклоняет отзыв; пересчитывает рейтинг специалиста по одобренным отзывам. */
export async function moderateReview(
  id: string,
  decision: ReviewDecision,
): Promise<Review> {
  await delay()
  const reviews = readStorage<Review[]>(storageKeys.reviews, () => mockReviews)
  const found = reviews.find((r) => r.id === id)
  if (!found) throw new Error(`Review not found: ${id}`)
  const updated: Review =
    decision.status === 'approved'
      ? { ...found, status: 'approved', rejectionReason: undefined }
      : { ...found, status: 'rejected', rejectionReason: decision.reason }
  const next = reviews.map((r) => (r.id === id ? updated : r))
  writeStorage(storageKeys.reviews, next)

  const approved = next.filter(
    (r) => r.specialistId === found.specialistId && r.status === 'approved',
  )
  const specialists = readStorage<Specialist[]>(
    storageKeys.specialists,
    () => mockSpecialists,
  )
  writeStorage(
    storageKeys.specialists,
    specialists.map((s) =>
      s.id === found.specialistId
        ? {
            ...s,
            reviewsCount: approved.length,
            ratingAvg: approved.length
              ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
              : 0,
          }
        : s,
    ),
  )
  return updated
}
