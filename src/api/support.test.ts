import { beforeEach, describe, expect, it } from 'vitest'
import {
  getChecklistState,
  getRouteProgress,
  listRouteSteps,
  listSupportArticles,
  toggleChecklistItem,
  toggleRouteStep,
} from './support'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  apiConfig.delayMs = 0
})

describe('support api', () => {
  it('lists articles by category', async () => {
    const docs = await listSupportArticles('documents')
    expect(docs.length).toBeGreaterThan(0)
    expect(docs.every((a) => a.category === 'documents')).toBe(true)
    expect((await listSupportArticles('benefits')).length).toBeGreaterThan(0)
  })

  it('toggles checklist items per article', async () => {
    await toggleChecklistItem('a1', 'x')
    await toggleChecklistItem('a1', 'y')
    await toggleChecklistItem('a2', 'x')
    expect(await getChecklistState()).toEqual({ a1: ['x', 'y'], a2: ['x'] })
    await toggleChecklistItem('a1', 'x')
    expect((await getChecklistState()).a1).toEqual(['y'])
  })

  it('toggles route steps', async () => {
    expect(await getRouteProgress()).toEqual([])
    expect(await toggleRouteStep('s1')).toEqual(['s1'])
    expect(await toggleRouteStep('s1')).toEqual([])
  })

  it('route has 6 steps with unique ids', async () => {
    const steps = await listRouteSteps()
    expect(steps).toHaveLength(6)
    expect(new Set(steps.map((s) => s.id)).size).toBe(6)
  })
})
