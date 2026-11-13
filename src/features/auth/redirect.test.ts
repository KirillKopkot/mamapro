import { describe, expect, it } from 'vitest'
import { loginUrl, safeNext } from './redirect'

describe('safeNext', () => {
  it('keeps internal paths', () => expect(safeNext('/child?x=1')).toBe('/child?x=1'))
  it('falls back to / for empty or external targets', () => {
    expect(safeNext(null)).toBe('/')
    expect(safeNext('https://evil.example')).toBe('/')
    expect(safeNext('//evil.example')).toBe('/')
    expect(safeNext('/\\evil.example')).toBe('/')
  })
  it('builds a login url with encoded next', () =>
    expect(loginUrl('/a?b=1')).toBe('/login?next=%2Fa%3Fb%3D1'))
})
