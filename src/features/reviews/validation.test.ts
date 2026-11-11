import { describe, expect, it } from 'vitest'
import { validateReview } from './validation'

const valid = { authorName: 'Асель', rating: 5, text: 'Отличный специалист!' }

describe('validateReview', () => {
  it('валидный отзыв без ошибок', () => {
    expect(validateReview(valid)).toEqual({})
  })

  it('требует имя', () => {
    expect(validateReview({ ...valid, authorName: '   ' }).authorName).toBe(
      'nameRequired',
    )
  })

  it('ограничивает длину имени', () => {
    expect(validateReview({ ...valid, authorName: 'а'.repeat(61) }).authorName).toBe(
      'nameTooLong',
    )
  })

  it('требует оценку 1–5', () => {
    expect(validateReview({ ...valid, rating: null }).rating).toBe('ratingRequired')
    expect(validateReview({ ...valid, rating: 0 }).rating).toBe('ratingRequired')
    expect(validateReview({ ...valid, rating: 6 }).rating).toBe('ratingRequired')
    expect(validateReview({ ...valid, rating: 2.5 }).rating).toBe('ratingRequired')
  })

  it('проверяет длину текста после trim', () => {
    expect(validateReview({ ...valid, text: '  коротко  ' }).text).toBe('textTooShort')
    expect(validateReview({ ...valid, text: 'а'.repeat(1001) }).text).toBe('textTooLong')
  })
})
