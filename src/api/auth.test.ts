import { beforeEach, describe, expect, it } from 'vitest'
import { AuthError, getCurrentUser, hashPassword, login, logout, register } from './auth'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  apiConfig.delayMs = 0
})

const input = { name: ' Айгуль ', email: ' Mama@Example.ru ', password: 'secret123' }

describe('register', () => {
  it('creates a user, normalizes data and opens a session', async () => {
    const user = await register(input)
    expect(user.name).toBe('Айгуль')
    expect(user.email).toBe('mama@example.ru')
    expect(user).not.toHaveProperty('passwordHash')
    expect(await getCurrentUser()).toEqual(user)
  })

  it('does not store the password in plain text', async () => {
    await register(input)
    const raw = localStorage.getItem('mamaProPix:users') ?? ''
    expect(raw).not.toContain('secret123')
    expect(raw).toContain(await hashPassword('mama@example.ru', 'secret123'))
  })

  it('rejects a duplicate e-mail regardless of case', async () => {
    await register(input)
    await expect(register({ ...input, email: 'MAMA@example.ru' })).rejects.toMatchObject({
      code: 'emailTaken',
    })
  })
})

describe('login', () => {
  it('logs in with the right password', async () => {
    const created = await register(input)
    await logout()
    expect(await getCurrentUser()).toBeNull()
    const user = await login({
      email: 'mama@example.ru',
      password: 'secret123',
      remember: true,
    })
    expect(user.id).toBe(created.id)
    expect(await getCurrentUser()).toEqual(created)
  })

  it('gives the same error for unknown user and wrong password', async () => {
    await register(input)
    const wrong = login({
      email: 'mama@example.ru',
      password: 'nope12345',
      remember: true,
    })
    const unknown = login({
      email: 'who@example.ru',
      password: 'secret123',
      remember: true,
    })
    await expect(wrong).rejects.toBeInstanceOf(AuthError)
    await expect(wrong).rejects.toMatchObject({ code: 'invalidCredentials' })
    await expect(unknown).rejects.toMatchObject({ code: 'invalidCredentials' })
  })

  it('stores the session in localStorage when remember is on', async () => {
    await register(input)
    await login({ email: 'mama@example.ru', password: 'secret123', remember: true })
    expect(localStorage.getItem('mamaProPix:session')).not.toBeNull()
    expect(sessionStorage.getItem('mamaProPix:session')).toBeNull()
  })

  it('stores the session in sessionStorage when remember is off', async () => {
    await register(input)
    await login({ email: 'mama@example.ru', password: 'secret123', remember: false })
    expect(localStorage.getItem('mamaProPix:session')).toBeNull()
    expect(sessionStorage.getItem('mamaProPix:session')).not.toBeNull()
    expect(await getCurrentUser()).not.toBeNull()
  })
})

describe('logout', () => {
  it('clears the session', async () => {
    await register(input)
    await logout()
    expect(await getCurrentUser()).toBeNull()
  })
})
