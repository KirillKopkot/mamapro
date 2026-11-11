import type { AccessGrant } from '../types'
import { delay, readStorage, storageKeys, writeStorage } from './storage'

function readAll(): AccessGrant[] {
  return readStorage<AccessGrant[]>(storageKeys.accessGrants, () => [])
}

/** Доступы ко всем детям или к одному ребёнку. */
export async function getAccessGrants(childId?: string): Promise<AccessGrant[]> {
  await delay()
  const all = readAll()
  return childId ? all.filter((g) => g.childId === childId) : all
}

/** Создаёт или заменяет доступ пары (ребёнок, специалист). Пустой список разделов = отзыв доступа. */
export async function saveAccessGrant(grant: AccessGrant): Promise<AccessGrant[]> {
  await delay()
  const rest = readAll().filter(
    (g) => !(g.childId === grant.childId && g.specialistId === grant.specialistId),
  )
  const next = grant.sections.length > 0 ? [...rest, grant] : rest
  writeStorage(storageKeys.accessGrants, next)
  return next
}

export async function revokeAccessGrant(
  childId: string,
  specialistId: string,
): Promise<AccessGrant[]> {
  await delay()
  const next = readAll().filter(
    (g) => !(g.childId === childId && g.specialistId === specialistId),
  )
  writeStorage(storageKeys.accessGrants, next)
  return next
}
