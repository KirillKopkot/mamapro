import { mockSpecialists } from '../mocks'
import type { LocalizedText, Specialist } from '../types'
import { delay, newId, readStorage, storageKeys, writeStorage } from './storage'

function readAll(): Specialist[] {
  return readStorage(storageKeys.specialists, () => mockSpecialists)
}

/** Только одобренные специалисты. */
export async function listSpecialists(): Promise<Specialist[]> {
  await delay()
  return readAll().filter((s) => s.status === 'approved')
}

export async function getSpecialist(id: string): Promise<Specialist | null> {
  await delay()
  return readAll().find((s) => s.id === id) ?? null
}

export type NewSpecialist = Omit<
  Specialist,
  'id' | 'status' | 'rejectionReason' | 'ratingAvg' | 'reviewsCount'
>

/** Создаёт специалиста со статусом pending. */
export async function createSpecialist(input: NewSpecialist): Promise<Specialist> {
  await delay()
  const specialist: Specialist = {
    ...input,
    id: newId('sp'),
    status: 'pending',
    ratingAvg: 0,
    reviewsCount: 0,
  }
  writeStorage(storageKeys.specialists, [...readAll(), specialist])
  return specialist
}

export async function listPendingSpecialists(): Promise<Specialist[]> {
  await delay()
  return readAll().filter((s) => s.status === 'pending')
}

export type ModerationDecision =
  { status: 'approved' } | { status: 'rejected'; reason: LocalizedText }

export async function moderateSpecialist(
  id: string,
  decision: ModerationDecision,
): Promise<Specialist> {
  await delay()
  const all = readAll()
  const found = all.find((s) => s.id === id)
  if (!found) throw new Error(`Specialist not found: ${id}`)
  const updated: Specialist =
    decision.status === 'approved'
      ? { ...found, status: 'approved', rejectionReason: undefined }
      : { ...found, status: 'rejected', rejectionReason: decision.reason }
  writeStorage(
    storageKeys.specialists,
    all.map((s) => (s.id === id ? updated : s)),
  )
  return updated
}
