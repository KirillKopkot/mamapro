import type { AccessGrant, Child, ChildView } from '../types'
import { pickSections } from './childView'
import {
  delay,
  newId,
  readStorage,
  storageKeys,
  writeStorage,
  writeStorageStrict,
} from './storage'

export type ChildInput = Omit<Child, 'id'> & { id?: string }

function readChildren(): Child[] {
  return readStorage<Child[]>(storageKeys.children, () => [])
}

export async function getChildren(): Promise<Child[]> {
  await delay()
  return readChildren()
}

/** Создаёт ребёнка (без id) или обновляет существующего. Бросает ошибку, если хранилище переполнено. */
export async function saveChild(input: ChildInput): Promise<Child> {
  await delay()
  const all = readChildren()
  const child: Child = { ...input, id: input.id ?? newId('child') }
  const exists = all.some((c) => c.id === child.id)
  writeStorageStrict(
    storageKeys.children,
    exists ? all.map((c) => (c.id === child.id ? child : c)) : [...all, child],
  )
  return child
}

/** Удаляет ребёнка вместе с его доступами и черновиком. */
export async function deleteChild(childId: string): Promise<void> {
  await delay()
  writeStorage(
    storageKeys.children,
    readChildren().filter((c) => c.id !== childId),
  )
  writeStorage(
    storageKeys.accessGrants,
    readStorage<AccessGrant[]>(storageKeys.accessGrants, () => []).filter(
      (g) => g.childId !== childId,
    ),
  )
  const drafts = readStorage<Record<string, unknown>>(storageKeys.childDrafts, () => ({}))
  const { [childId]: _removed, ...rest } = drafts
  void _removed
  writeStorage(storageKeys.childDrafts, rest)
}

/**
 * Данные ребёнка глазами специалиста: только разделы, открытые через AccessGrant.
 * Без доступа возвращает null — не раскрывается ничего, включая имя и возраст.
 */
export async function getChildForSpecialist(
  childId: string,
  specialistId: string,
): Promise<ChildView | null> {
  await delay()
  const grant = readStorage<AccessGrant[]>(storageKeys.accessGrants, () => []).find(
    (g) => g.childId === childId && g.specialistId === specialistId,
  )
  if (!grant || grant.sections.length === 0) return null
  const child = readChildren().find((c) => c.id === childId)
  if (!child) return null
  return pickSections(child, grant.sections)
}
