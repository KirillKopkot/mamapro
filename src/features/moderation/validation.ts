import type { LocalizedText } from '../../types'

export type RejectionErrors = Partial<Record<keyof LocalizedText, 'required' | 'tooLong'>>

export const MAX_REASON_LENGTH = 500

/** Причина отклонения обязательна на обоих языках. */
export function validateRejectionReason(reason: LocalizedText): RejectionErrors {
  const errors: RejectionErrors = {}
  for (const lang of ['ru', 'kk'] as const) {
    const v = reason[lang].trim()
    if (v === '') errors[lang] = 'required'
    else if (v.length > MAX_REASON_LENGTH) errors[lang] = 'tooLong'
  }
  return errors
}
