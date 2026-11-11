import type { ChildDraft } from '../../types'

export const MAX_NAME_LENGTH = 50
export const MAX_TEXT_LENGTH = 2000
export const MAX_AGE = 18
export const MAX_FILE_BYTES = 5 * 1024 * 1024
export const ALLOWED_FILE_TYPES: readonly string[] = [
  'application/pdf',
  'image/jpeg',
  'image/png',
]

export type ChildField = keyof ChildDraft
export type ChildErrorKey =
  'nameRequired' | 'nameTooLong' | 'ageRequired' | 'ageInvalid' | 'textTooLong'
export type ChildFormErrors = Partial<Record<ChildField, ChildErrorKey>>

const TEXT_FIELDS = ['features', 'manifestations', 'whatHelps', 'stressTriggers'] as const

/** Возраст в годах: целое число 0–18 или null. */
export function parseAge(value: string): number | null {
  const trimmed = value.trim()
  if (!/^\d{1,2}$/.test(trimmed)) return null
  const n = Number(trimmed)
  return n <= MAX_AGE ? n : null
}

export function validateChildForm(values: ChildDraft): ChildFormErrors {
  const errors: ChildFormErrors = {}
  const name = values.name.trim()
  if (name === '') errors.name = 'nameRequired'
  else if (name.length > MAX_NAME_LENGTH) errors.name = 'nameTooLong'

  if (values.age.trim() === '') errors.age = 'ageRequired'
  else if (parseAge(values.age) === null) errors.age = 'ageInvalid'

  for (const field of TEXT_FIELDS) {
    if (values[field].length > MAX_TEXT_LENGTH) errors[field] = 'textTooLong'
  }
  return errors
}

export type FileErrorKey = 'type' | 'size'

export function validateDocumentFile(file: {
  type: string
  size: number
}): FileErrorKey | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return 'type'
  if (file.size > MAX_FILE_BYTES) return 'size'
  return null
}
