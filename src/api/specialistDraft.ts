import type { SpecialistFormValues } from '../types'
import { delay, readStorage, storageKeys, writeStorage } from './storage'

export async function getSpecialistDraft(): Promise<SpecialistFormValues | null> {
  await delay()
  return readStorage<SpecialistFormValues | null>(storageKeys.specialistDraft, () => null)
}

export async function saveSpecialistDraft(values: SpecialistFormValues): Promise<void> {
  await delay()
  writeStorage(storageKeys.specialistDraft, values)
}

export async function clearSpecialistDraft(): Promise<void> {
  await delay()
  try {
    localStorage.removeItem(storageKeys.specialistDraft)
  } catch {
    // хранилище недоступно
  }
}
