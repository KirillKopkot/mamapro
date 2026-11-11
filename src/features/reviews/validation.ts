export const REVIEW_LIMITS = {
  nameMax: 60,
  textMin: 10,
  textMax: 1000,
} as const

export interface ReviewDraft {
  authorName: string
  rating: number | null
  text: string
}

/** Ключи ошибок — суффиксы для `reviews.errors.*` в словарях i18n. */
export type ReviewErrorKey =
  'nameRequired' | 'nameTooLong' | 'ratingRequired' | 'textTooShort' | 'textTooLong'

export type ReviewErrors = Partial<
  Record<'authorName' | 'rating' | 'text', ReviewErrorKey>
>

export function validateReview(draft: ReviewDraft): ReviewErrors {
  const errors: ReviewErrors = {}
  const name = draft.authorName.trim()
  const text = draft.text.trim()
  if (!name) errors.authorName = 'nameRequired'
  else if (name.length > REVIEW_LIMITS.nameMax) errors.authorName = 'nameTooLong'
  if (
    draft.rating === null ||
    !Number.isInteger(draft.rating) ||
    draft.rating < 1 ||
    draft.rating > 5
  ) {
    errors.rating = 'ratingRequired'
  }
  if (text.length < REVIEW_LIMITS.textMin) errors.text = 'textTooShort'
  else if (text.length > REVIEW_LIMITS.textMax) errors.text = 'textTooLong'
  return errors
}
