// Внутренний слой хранения для реализации api. Не использовать из компонентов.
export const STORAGE_PREFIX = 'mamaProPix:'

export const storageKeys = {
  specialists: `${STORAGE_PREFIX}specialists`,
  reviews: `${STORAGE_PREFIX}reviews`,
  favorites: `${STORAGE_PREFIX}favorites`,
  children: `${STORAGE_PREFIX}children`,
  accessGrants: `${STORAGE_PREFIX}accessGrants`,
} as const

export const apiConfig = { delayMs: 200 }

export function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, apiConfig.delayMs))
}

/** Читает значение; если его нет или оно повреждено — возвращает initial(). */
export function readStorage<T>(key: string, initial: () => T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) return JSON.parse(raw) as T
  } catch {
    // повреждённые данные или недоступное хранилище — начинаем с initial
  }
  return initial()
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // хранилище недоступно или переполнено
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
