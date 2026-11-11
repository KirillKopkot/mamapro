import type { ChildDraft } from '../types'
import { delay, readStorage, storageKeys, writeStorage } from './storage'

/** Ключ черновика нового ребёнка */
export const NEW_CHILD_DRAFT_KEY = 'new'

type Drafts = Record<string, ChildDraft>

function readDrafts(): Drafts {
  return readStorage<Drafts>(storageKeys.childDrafts, () => ({}))
}

export async function getChildDraft(key: string): Promise<ChildDraft | null> {
  await delay()
  return readDrafts()[key] ?? null
}

export async function saveChildDraft(key: string, draft: ChildDraft): Promise<void> {
  await delay()
  writeStorage(storageKeys.childDrafts, { ...readDrafts(), [key]: draft })
}

export async function clearChildDraft(key: string): Promise<void> {
  await delay()
  const { [key]: _removed, ...rest } = readDrafts()
  void _removed
  writeStorage(storageKeys.childDrafts, rest)
}
