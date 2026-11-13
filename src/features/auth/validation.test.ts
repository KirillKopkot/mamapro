import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validateRegister,
} from './validation'

describe('validatePassword', () => {
  it('requires a value', () => expect(validatePassword('')).toBe('passwordRequired'))
  it('requires at least 8 characters', () =>
    expect(validatePassword('abc1234')).toBe('passwordTooShort'))
  it('requires letters and digits', () => {
    expect(validatePassword('abcdefgh')).toBe('passwordWeak')
    expect(validatePassword('12345678')).toBe('passwordWeak')
  })
  it('accepts letters and digits, including cyrillic', () => {
    expect(validatePassword('abcdefg1')).toBeNull()
    expect(validatePassword('пароль123')).toBeNull()
  })
})

describe('validateEmail / validateName', () => {
  it('validates e-mail', () => {
    expect(validateEmail('')).toBe('emailRequired')
    expect(validateEmail('name@')).toBe('emailInvalid')
    expect(validateEmail('a b@example.ru')).toBe('emailInvalid')
    expect(validateEmail(' name@example.ru ')).toBeNull()
  })
  it('validates name', () => {
    expect(validateName('  ')).toBe('nameRequired')
    expect(validateName('x'.repeat(81))).toBe('nameTooLong')
    expect(validateName('Айгуль')).toBeNull()
  })
})

describe('validateLogin / validateRegister', () => {
  it('login: does not apply complexity rules', () => {
    expect(validateLogin({ email: 'a@b.kz', password: 'x' })).toEqual({})
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'emailRequired',
      password: 'passwordRequired',
    })
  })
  it('register: requires both consents', () => {
    const base = {
      name: 'А',
      email: 'a@b.kz',
      password: 'abcdefg1',
      terms: true,
      consent: true,
    }
    expect(validateRegister(base)).toEqual({})
    expect(validateRegister({ ...base, terms: false, consent: false })).toEqual({
      terms: 'termsRequired',
      consent: 'consentRequired',
    })
  })
})
