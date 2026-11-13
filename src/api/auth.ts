import type { PublicUser, User } from '../types'
import { delay, newId, readStorage, storageKeys, writeStorage } from './storage'

/*
 * ДЕМО-авторизация без бэкенда. Пароль хранится как SHA-256 — это НЕ настоящая защита
 * (хэш лежит в localStorage рядом с сессией). Всё будет заменено на бэкенд.
 */

export type AuthErrorCode = 'emailTaken' | 'invalidCredentials'

export class AuthError extends Error {
  readonly code: AuthErrorCode
  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  /** true — сессия в localStorage, false — в sessionStorage. */
  remember?: boolean
}

export interface LoginInput {
  email: string
  password: string
  remember: boolean
}

interface Session {
  userId: string
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** SHA-256 (hex) пароля; e-mail выступает «солью». */
export async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`${normalizeEmail(email)}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join(
    '',
  )
}

function readUsers(): User[] {
  return readStorage<User[]>(storageKeys.users, () => [])
}

function toPublic({ passwordHash: _hash, ...user }: User): PublicUser {
  void _hash
  return user
}

function writeSession(userId: string, remember: boolean): void {
  const value = JSON.stringify({ userId } satisfies Session)
  try {
    localStorage.removeItem(storageKeys.session)
    sessionStorage.removeItem(storageKeys.session)
    ;(remember ? localStorage : sessionStorage).setItem(storageKeys.session, value)
  } catch {
    // хранилище недоступно — сессия не сохранится
  }
}

function readSession(): Session | null {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const raw = store.getItem(storageKeys.session)
      if (raw) return JSON.parse(raw) as Session
    } catch {
      // повреждённая сессия игнорируется
    }
  }
  return null
}

/** Создаёт пользователя и сразу открывает сессию. Бросает AuthError('emailTaken'). */
export async function register(input: RegisterInput): Promise<PublicUser> {
  await delay()
  const email = normalizeEmail(input.email)
  const users = readUsers()
  if (users.some((u) => u.email === email)) throw new AuthError('emailTaken')
  const user: User = {
    id: newId('user'),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(email, input.password),
    createdAt: new Date().toISOString(),
  }
  writeStorage(storageKeys.users, [...users, user])
  writeSession(user.id, input.remember ?? true)
  return toPublic(user)
}

/** Вход. «Пользователь не найден» и «неверный пароль» неразличимы: AuthError('invalidCredentials'). */
export async function login(input: LoginInput): Promise<PublicUser> {
  await delay()
  const email = normalizeEmail(input.email)
  const user = readUsers().find((u) => u.email === email)
  const hash = await hashPassword(email, input.password)
  if (!user || user.passwordHash !== hash) throw new AuthError('invalidCredentials')
  writeSession(user.id, input.remember)
  return toPublic(user)
}

export async function logout(): Promise<void> {
  await delay()
  try {
    localStorage.removeItem(storageKeys.session)
    sessionStorage.removeItem(storageKeys.session)
  } catch {
    // игнорируем
  }
}

/** Текущий пользователь или null. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  await delay()
  const session = readSession()
  if (!session) return null
  const user = readUsers().find((u) => u.id === session.userId)
  return user ? toPublic(user) : null
}
