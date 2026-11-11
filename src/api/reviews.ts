import { mockReviews } from '../mocks'
import type { Review } from '../types'
import { delay, newId, readStorage, storageKeys, writeStorage } from './storage'

function readAll(): Review[] {
  return readStorage(storageKeys.reviews, () => mockReviews)
}

/** Одобренные отзывы специалиста, новые сверху. */
export async function listReviews(specialistId: string): Promise<Review[]> {
  await delay()
  return readAll()
    .filter((r) => r.specialistId === specialistId && r.status === 'approved')
    .sort((a, b) => b.date.localeCompare(a.date))
}

export type NewReview = Pick<Review, 'specialistId' | 'authorName' | 'rating' | 'text'>

/** Добавляет отзыв со статусом pending. */
export async function addReview(input: NewReview): Promise<Review> {
  await delay()
  if (input.rating < 1 || input.rating > 5) throw new Error('Rating must be 1-5')
  const review: Review = {
    ...input,
    id: newId('rv'),
    date: new Date().toISOString().slice(0, 10),
    status: 'pending',
  }
  writeStorage(storageKeys.reviews, [...readAll(), review])
  return review
}
