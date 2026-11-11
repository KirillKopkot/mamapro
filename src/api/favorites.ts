import { delay, readStorage, storageKeys, writeStorage } from './storage'

function readIds(): string[] {
  return readStorage<string[]>(storageKeys.favorites, () => [])
}

/** Идентификаторы избранных специалистов. */
export async function listFavorites(): Promise<string[]> {
  await delay()
  return readIds()
}

/** Добавляет/убирает специалиста из избранного, возвращает новый список. */
export async function toggleFavorite(specialistId: string): Promise<string[]> {
  await delay()
  const ids = readIds()
  const next = ids.includes(specialistId)
    ? ids.filter((id) => id !== specialistId)
    : [...ids, specialistId]
  writeStorage(storageKeys.favorites, next)
  return next
}
