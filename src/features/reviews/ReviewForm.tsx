import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAddReview } from './hooks'
import { REVIEW_LIMITS, validateReview } from './validation'
import type { ReviewErrors } from './validation'
import styles from './ReviewForm.module.css'

export function ReviewForm({ specialistId }: { specialistId: string }) {
  const { t } = useTranslation()
  const uid = useId()
  const addReview = useAddReview()
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<ReviewErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateReview({ authorName, rating, text })
    setErrors(found)
    if (Object.keys(found).length > 0 || rating === null) return
    addReview.mutate(
      { specialistId, authorName: authorName.trim(), rating, text: text.trim() },
      {
        onSuccess: () => {
          setSubmitted(true)
          setAuthorName('')
          setRating(null)
          setText('')
        },
      },
    )
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <p>{t('reviews.success')}</p>
        <button
          type="button"
          className={styles.button}
          onClick={() => setSubmitted(false)}
        >
          {t('reviews.writeAnother')}
        </button>
      </div>
    )
  }

  const nameId = `${uid}-name`
  const textId = `${uid}-text`
  const ratingErrId = `${uid}-rating-err`

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.title}>{t('reviews.formTitle')}</h3>

      <div className={styles.field}>
        <label htmlFor={nameId}>{t('reviews.name')}</label>
        <input
          id={nameId}
          className={styles.input}
          value={authorName}
          maxLength={REVIEW_LIMITS.nameMax + 20}
          autoComplete="given-name"
          aria-invalid={Boolean(errors.authorName)}
          aria-describedby={errors.authorName ? `${nameId}-err` : undefined}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        {errors.authorName && (
          <p id={`${nameId}-err`} className={styles.error} role="alert">
            {t(`reviews.errors.${errors.authorName}`, { max: REVIEW_LIMITS.nameMax })}
          </p>
        )}
      </div>

      <fieldset
        className={styles.rating}
        aria-describedby={errors.rating ? ratingErrId : undefined}
      >
        <legend>{t('reviews.rating')}</legend>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={styles.star}>
              <input
                type="radio"
                name={`${uid}-rating`}
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
              />
              <span>
                <span aria-hidden="true">★</span> {n}
              </span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <p id={ratingErrId} className={styles.error} role="alert">
            {t(`reviews.errors.${errors.rating}`)}
          </p>
        )}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={textId}>{t('reviews.text')}</label>
        <textarea
          id={textId}
          className={styles.input}
          rows={4}
          value={text}
          aria-invalid={Boolean(errors.text)}
          aria-describedby={errors.text ? `${textId}-err` : undefined}
          onChange={(e) => setText(e.target.value)}
        />
        {errors.text && (
          <p id={`${textId}-err`} className={styles.error} role="alert">
            {t(`reviews.errors.${errors.text}`, {
              min: REVIEW_LIMITS.textMin,
              max: REVIEW_LIMITS.textMax,
            })}
          </p>
        )}
      </div>

      {addReview.isError && (
        <p className={styles.error} role="alert">
          {t('reviews.submitError')}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={addReview.isPending}>
        {t(addReview.isPending ? 'reviews.submitting' : 'reviews.submit')}
      </button>
    </form>
  )
}
