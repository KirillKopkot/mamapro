import { beforeEach, describe, expect, it } from 'vitest'
import { listFavorites, toggleFavorite } from './favorites'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  apiConfig.delayMs = 0
})

describe('favorites', () => {
  it('starts empty', async () => {
    expect(await listFavorites()).toEqual([])
  })

  it('adds and removes a specialist', async () => {
    expect(await toggleFavorite('sp-1')).toEqual(['sp-1'])
    expect(await toggleFavorite('sp-2')).toEqual(['sp-1', 'sp-2'])
    expect(await toggleFavorite('sp-1')).toEqual(['sp-2'])
    expect(await listFavorites()).toEqual(['sp-2'])
  })

  it('persists in localStorage with project prefix', async () => {
    await toggleFavorite('sp-1')
    expect(localStorage.getItem('mamaProPix:favorites')).toBe('["sp-1"]')
  })
})
