import { describe, expect, it } from 'vitest'
import { validateRejectionReason } from './validation'

describe('validateRejectionReason', () => {
  it('requires both languages', () => {
    expect(validateRejectionReason({ ru: '', kk: ' ' })).toEqual({
      ru: 'required',
      kk: 'required',
    })
    expect(validateRejectionReason({ ru: 'Причина', kk: '' })).toEqual({ kk: 'required' })
  })
  it('accepts filled reasons and limits length', () => {
    expect(validateRejectionReason({ ru: 'a', kk: 'b' })).toEqual({})
    expect(validateRejectionReason({ ru: 'a'.repeat(501), kk: 'b' })).toEqual({
      ru: 'tooLong',
    })
  })
})
