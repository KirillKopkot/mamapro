import { beforeEach, describe, expect, it } from 'vitest'
import { listReviews } from './reviews'
import { listPendingReviews, moderateReview } from './reviewModeration'
import {
  createSpecialist,
  listPendingSpecialists,
  listSpecialists,
  moderateSpecialist,
} from './specialists'
import type { NewSpecialist } from './specialists'
import { mockSpecialists } from '../mocks'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  apiConfig.delayMs = 0
})

const {
  id: _id,
  status: _s,
  rejectionReason: _r,
  ratingAvg: _a,
  reviewsCount: _c,
  ...base
} = mockSpecialists[0]!
void [_id, _s, _r, _a, _c]
const input: NewSpecialist = { ...base, firstName: 'Новый', lastName: 'Профиль' }
const reason = { ru: 'Недостаточно данных', kk: 'Деректер жеткіліксіз' }

describe('public specialists list', () => {
  it('contains only approved profiles from the mock data', async () => {
    const list = await listSpecialists()
    expect(list.every((s) => s.status === 'approved')).toBe(true)
    expect(list.some((s) => s.id === 'sp-4')).toBe(false) // pending в моках
  })

  it('does not show a newly created (pending) profile', async () => {
    const created = await createSpecialist(input)
    expect(created.status).toBe('pending')
    expect((await listSpecialists()).some((s) => s.id === created.id)).toBe(false)
    expect((await listPendingSpecialists()).some((s) => s.id === created.id)).toBe(true)
  })

  it('does not show rejected profiles and keeps the reason', async () => {
    const created = await createSpecialist(input)
    const rejected = await moderateSpecialist(created.id, { status: 'rejected', reason })
    expect(rejected.rejectionReason).toEqual(reason)
    expect((await listSpecialists()).some((s) => s.id === created.id)).toBe(false)
    expect((await listPendingSpecialists()).some((s) => s.id === created.id)).toBe(false)
  })

  it('shows a profile after approval', async () => {
    const created = await createSpecialist(input)
    await moderateSpecialist(created.id, { status: 'approved' })
    expect((await listSpecialists()).some((s) => s.id === created.id)).toBe(true)
  })
})

describe('review moderation', () => {
  it('pending reviews are not public until approved, and rating is recalculated', async () => {
    const pending = (await listPendingReviews())[0]!
    expect(
      (await listReviews(pending.specialistId)).some((r) => r.id === pending.id),
    ).toBe(false)
    await moderateReview(pending.id, { status: 'approved' })
    expect(
      (await listReviews(pending.specialistId)).some((r) => r.id === pending.id),
    ).toBe(true)
    expect((await listPendingReviews()).some((r) => r.id === pending.id)).toBe(false)
    const sp = (await listSpecialists()).find((s) => s.id === pending.specialistId)!
    expect(sp.reviewsCount).toBe(4)
  })

  it('rejected reviews stay hidden', async () => {
    const pending = (await listPendingReviews())[0]!
    const rejected = await moderateReview(pending.id, { status: 'rejected', reason })
    expect(rejected.rejectionReason).toEqual(reason)
    expect(
      (await listReviews(pending.specialistId)).some((r) => r.id === pending.id),
    ).toBe(false)
  })
})
