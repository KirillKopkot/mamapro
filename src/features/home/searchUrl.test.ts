import { describe, expect, it } from 'vitest'
import { parseQueryState } from '../specialists/filtering'
import { buildDirectionUrl, buildSearchUrl } from './searchUrl'

function parse(url: string) {
  return parseQueryState(new URLSearchParams(url.split('?')[1] ?? ''))
}

describe('buildSearchUrl', () => {
  it('has no parameters by default', () => {
    expect(buildSearchUrl('  ', 'any')).toBe('/specialists')
  })
  it('passes the query and format', () => {
    const state = parse(buildSearchUrl('логопед', 'online'))
    expect(state.filters.query).toBe('логопед')
    expect(state.filters.formats).toEqual(['online'])
  })
  it('maps "offline" to clinic and home', () => {
    expect(parse(buildSearchUrl('', 'offline')).filters.formats).toEqual([
      'clinic',
      'home',
    ])
  })
})

describe('buildDirectionUrl', () => {
  it('presets several specializations', () => {
    const url = buildDirectionUrl('/specialists', ['Логопед', 'Дефектолог'])
    expect(parse(url).filters.specializations).toEqual(['Логопед', 'Дефектолог'])
  })
  it('keeps plain links without a filter', () => {
    expect(buildDirectionUrl('/support', [])).toBe('/support')
  })
})
