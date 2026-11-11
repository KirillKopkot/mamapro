import type { Child } from '../types'
import { delay, newId, readStorage, storageKeys, writeStorage } from './storage'

export type ChildInput = Omit<Child, 'id'> & { id?: string }

export async function getChildren(): Promise<Child[]> {
  await delay()
  return readStorage<Child[]>(storageKeys.children, () => [])
}

/** Создаёт ребёнка (без id) или обновляет существующего. */
export async function saveChild(input: ChildInput): Promise<Child> {
  await delay()
  const all = readStorage<Child[]>(storageKeys.children, () => [])
  const child: Child = { ...input, id: input.id ?? newId('child') }
  const exists = all.some((c) => c.id === child.id)
  writeStorage(
    storageKeys.children,
    exists ? all.map((c) => (c.id === child.id ? child : c)) : [...all, child],
  )
  return child
}
