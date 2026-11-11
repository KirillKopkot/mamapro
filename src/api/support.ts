import { mockRouteSteps, mockSupportArticles } from '../mocks/support'
import type { RouteStep, SupportArticle, SupportCategory } from '../types'
import { delay, readStorage, storageKeys, writeStorage } from './storage'

export async function listSupportArticles(
  category: SupportCategory,
): Promise<SupportArticle[]> {
  await delay()
  return mockSupportArticles.filter((a) => a.category === category)
}

export async function listRouteSteps(): Promise<RouteStep[]> {
  await delay()
  return mockRouteSteps
}

/** Отметки чек-листов: id статьи → id отмеченных документов. */
export type ChecklistState = Record<string, string[]>

export async function getChecklistState(): Promise<ChecklistState> {
  await delay()
  return readStorage<ChecklistState>(storageKeys.supportChecklists, () => ({}))
}

export async function toggleChecklistItem(
  articleId: string,
  itemId: string,
): Promise<ChecklistState> {
  await delay()
  const state = readStorage<ChecklistState>(storageKeys.supportChecklists, () => ({}))
  const checked = state[articleId] ?? []
  const next = {
    ...state,
    [articleId]: checked.includes(itemId)
      ? checked.filter((id) => id !== itemId)
      : [...checked, itemId],
  }
  writeStorage(storageKeys.supportChecklists, next)
  return next
}

/** id выполненных этапов маршрута. */
export async function getRouteProgress(): Promise<string[]> {
  await delay()
  return readStorage<string[]>(storageKeys.routeProgress, () => [])
}

export async function toggleRouteStep(stepId: string): Promise<string[]> {
  await delay()
  const done = readStorage<string[]>(storageKeys.routeProgress, () => [])
  const next = done.includes(stepId)
    ? done.filter((id) => id !== stepId)
    : [...done, stepId]
  writeStorage(storageKeys.routeProgress, next)
  return next
}
