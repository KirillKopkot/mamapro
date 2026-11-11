import { describe, expect, it } from 'vitest'
import type { ChildDraft } from '../../types'
import {
  MAX_FILE_BYTES,
  parseAge,
  validateChildForm,
  validateDocumentFile,
} from './validation'

const ok: ChildDraft = {
  name: 'Алия',
  age: '6',
  features: '',
  manifestations: '',
  whatHelps: '',
  stressTriggers: '',
}

describe('parseAge', () => {
  it('accepts integers 0–18', () => {
    expect(parseAge('0')).toBe(0)
    expect(parseAge(' 7 ')).toBe(7)
    expect(parseAge('18')).toBe(18)
  })
  it('rejects everything else', () => {
    for (const v of ['', '19', '-1', '3.5', 'abc', '100']) expect(parseAge(v)).toBeNull()
  })
})

describe('validateChildForm', () => {
  it('passes valid values', () => {
    expect(validateChildForm(ok)).toEqual({})
  })
  it('requires name and age', () => {
    expect(validateChildForm({ ...ok, name: '  ', age: '' })).toEqual({
      name: 'nameRequired',
      age: 'ageRequired',
    })
  })
  it('rejects invalid age and long values', () => {
    const errors = validateChildForm({
      ...ok,
      name: 'a'.repeat(51),
      age: '25',
      whatHelps: 'x'.repeat(2001),
    })
    expect(errors).toEqual({
      name: 'nameTooLong',
      age: 'ageInvalid',
      whatHelps: 'textTooLong',
    })
  })
})

describe('validateDocumentFile', () => {
  it('accepts pdf, jpg, png within 5 MB', () => {
    for (const type of ['application/pdf', 'image/jpeg', 'image/png']) {
      expect(validateDocumentFile({ type, size: MAX_FILE_BYTES })).toBeNull()
    }
  })
  it('rejects other types and big files', () => {
    expect(validateDocumentFile({ type: 'image/gif', size: 10 })).toBe('type')
    expect(
      validateDocumentFile({ type: 'application/pdf', size: MAX_FILE_BYTES + 1 }),
    ).toBe('size')
  })
})
