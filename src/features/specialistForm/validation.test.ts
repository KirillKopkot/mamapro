import { describe, expect, it } from 'vitest'
import type { SpecialistFormValues } from '../../types'
import {
  emptyFormValues,
  findFirstInvalidStep,
  isHttpUrl,
  toNewSpecialist,
  validateStep,
} from './validation'

const valid: SpecialistFormValues = {
  ...emptyFormValues(),
  firstName: 'Айгуль',
  lastName: 'Тестова',
  specializationRu: 'Логопед',
  specializationKk: 'Логопед',
  experienceYears: '5',
  price: '8000',
  formats: ['clinic'],
  city: 'astana',
  addressRu: 'ул. Примерная, 1',
  addressKk: 'Үлгілі к-сі, 1',
  bioRu: 'Работаю с детьми более пяти лет.',
  bioKk: 'Балалармен бес жылдан астам жұмыс істеймін.',
}

describe('validateStep', () => {
  it('accepts a valid form on every step', () => {
    expect(findFirstInvalidStep(valid)).toBeNull()
  })

  it('basic: requires fields, numbers and at least one format', () => {
    const e = validateStep('basic', emptyFormValues())
    expect(Object.keys(e).sort()).toEqual(
      [
        'experienceYears',
        'firstName',
        'formats',
        'lastName',
        'price',
        'specializationKk',
        'specializationRu',
      ].sort(),
    )
    expect(
      validateStep('basic', { ...valid, experienceYears: '-1', price: '0' }),
    ).toEqual({
      experienceYears: 'invalidNumber',
      price: 'invalidNumber',
    })
    expect(validateStep('basic', { ...valid, price: '8000.5' }).price).toBe(
      'invalidNumber',
    )
  })

  it('location: required for clinic/home, optional for online-only', () => {
    const offline = { ...valid, city: '' as const, addressRu: '', addressKk: '' }
    expect(Object.keys(validateStep('location', offline)).sort()).toEqual([
      'addressKk',
      'addressRu',
      'city',
    ])
    const online = { ...offline, formats: ['online' as const] }
    expect(validateStep('location', online)).toEqual({})
    // если адрес начали заполнять — нужны оба языка
    expect(validateStep('location', { ...online, addressRu: 'Адрес' })).toEqual({
      addressKk: 'required',
    })
  })

  it('about: bio length and youtube link', () => {
    expect(validateStep('about', { ...valid, bioRu: 'коротко', bioKk: '' })).toEqual({
      bioRu: 'tooShort',
      bioKk: 'required',
    })
    expect(
      validateStep('about', { ...valid, youtubeUrl: 'https://example.com/x' }),
    ).toEqual({
      youtubeUrl: 'invalidYoutube',
    })
    expect(
      validateStep('about', { ...valid, youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ' }),
    ).toEqual({})
  })

  it('education: every field of an added item is required, year is bounded', () => {
    const item = {
      id: '1',
      institutionRu: '',
      institutionKk: '',
      programRu: '',
      programKk: '',
      year: '1900',
    }
    const e = validateStep('education', { ...valid, education: [item] })
    expect(e['education.0.institutionRu']).toBe('required')
    expect(e['education.0.year']).toBe('invalidYear')
  })

  it('cases and socials validate nested items and urls', () => {
    const c = {
      id: '1',
      titleRu: 'a',
      titleKk: 'a',
      descriptionRu: 'a',
      descriptionKk: 'a',
      beforeRu: 'a',
      beforeKk: 'a',
      afterRu: '',
      afterKk: 'a',
      beforeImage: 'not-a-url',
      afterImage: '',
    }
    const e = validateStep('cases', { ...valid, cases: [c] })
    expect(e).toEqual({
      'cases.0.afterRu': 'required',
      'cases.0.beforeImage': 'invalidUrl',
    })
    const s = validateStep('socials', {
      ...valid,
      socials: [
        { id: '1', type: 'website', url: 'ftp://x' },
        { id: '2', type: 'telegram', url: '' },
      ],
    })
    expect(s).toEqual({ 'socials.0.url': 'invalidUrl', 'socials.1.url': 'required' })
  })
})

describe('findFirstInvalidStep', () => {
  it('returns the first failing step', () => {
    expect(findFirstInvalidStep({ ...valid, bioRu: '' })?.step).toBe('about')
    expect(findFirstInvalidStep(emptyFormValues())?.step).toBe('basic')
  })
})

describe('toNewSpecialist', () => {
  it('builds bilingual data and omits empty optional fields', () => {
    const s = toNewSpecialist({ ...valid, firstName: '  Айгуль ', priceFrom: true })
    expect(s.firstName).toBe('Айгуль')
    expect(s.specialization).toEqual({ ru: 'Логопед', kk: 'Логопед' })
    expect(s.experienceYears).toBe(5)
    expect(s.price).toBe(8000)
    expect(s.priceFrom).toBe(true)
    expect(s.city).toBe('astana')
    expect(s.youtubeUrl).toBeUndefined()
    expect(s.education).toEqual([])
    expect('status' in s).toBe(false)
  })

  it('omits city and address for an online specialist without them', () => {
    const s = toNewSpecialist({
      ...valid,
      formats: ['online'],
      city: '',
      addressRu: '',
      addressKk: '',
    })
    expect(s.city).toBeUndefined()
    expect(s.address).toBeUndefined()
  })
})

describe('isHttpUrl', () => {
  it('accepts only http(s)', () => {
    expect(isHttpUrl('https://a.kz/x')).toBe(true)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpUrl('abc')).toBe(false)
  })
})
