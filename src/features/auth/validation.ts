export type AuthErrorKey =
  | 'nameRequired'
  | 'nameTooLong'
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordTooShort'
  | 'passwordWeak'
  | 'termsRequired'
  | 'consentRequired'

export const PASSWORD_MIN_LENGTH = 8
export const NAME_MAX_LENGTH = 80

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(name: string): AuthErrorKey | null {
  const value = name.trim()
  if (!value) return 'nameRequired'
  if (value.length > NAME_MAX_LENGTH) return 'nameTooLong'
  return null
}

export function validateEmail(email: string): AuthErrorKey | null {
  const value = email.trim()
  if (!value) return 'emailRequired'
  return EMAIL_RE.test(value) ? null : 'emailInvalid'
}

/** Пароль для регистрации: не менее 8 символов, есть буква и цифра. */
export function validatePassword(password: string): AuthErrorKey | null {
  if (!password) return 'passwordRequired'
  if (password.length < PASSWORD_MIN_LENGTH) return 'passwordTooShort'
  if (!/\p{L}/u.test(password) || !/\d/.test(password)) return 'passwordWeak'
  return null
}

export interface LoginValues {
  email: string
  password: string
}

export interface RegisterValues {
  name: string
  email: string
  password: string
  terms: boolean
  consent: boolean
}

export type Errors<K extends string> = Partial<Record<K, AuthErrorKey>>

export function validateLogin(values: LoginValues): Errors<keyof LoginValues> {
  const errors: Errors<keyof LoginValues> = {}
  const email = validateEmail(values.email)
  if (email) errors.email = email
  // при входе правила сложности не проверяем: только что пароль введён
  if (!values.password) errors.password = 'passwordRequired'
  return errors
}

export function validateRegister(values: RegisterValues): Errors<keyof RegisterValues> {
  const errors: Errors<keyof RegisterValues> = {}
  const name = validateName(values.name)
  if (name) errors.name = name
  const email = validateEmail(values.email)
  if (email) errors.email = email
  const password = validatePassword(values.password)
  if (password) errors.password = password
  if (!values.terms) errors.terms = 'termsRequired'
  if (!values.consent) errors.consent = 'consentRequired'
  return errors
}
