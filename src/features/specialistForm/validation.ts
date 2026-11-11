import type { NewSpecialist } from '../../api'
import type { SpecialistFormValues } from '../../types'
import { parseYoutubeId } from '../specialists/youtube'

export const STEP_IDS = [
  'basic',
  'location',
  'about',
  'education',
  'cases',
  'socials',
] as const
export type StepId = (typeof STEP_IDS)[number]

/** Ключ — путь к полю (например, `education.0.year`), значение — код ошибки для i18n. */
export type FormErrors = Record<string, string>

export const SOCIAL_TYPES = [
  'instagram',
  'facebook',
  'telegram',
  'youtube',
  'website',
] as const

export function emptyFormValues(): SpecialistFormValues {
  return {
    firstName: '',
    lastName: '',
    specializationRu: '',
    specializationKk: '',
    experienceYears: '',
    price: '',
    priceFrom: false,
    formats: [],
    city: '',
    addressRu: '',
    addressKk: '',
    bioRu: '',
    bioKk: '',
    youtubeUrl: '',
    education: [],
    cases: [],
    socials: [],
  }
}

const filled = (v: string) => v.trim() !== ''

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function parseInteger(value: string): number | null {
  return /^\d+$/.test(value.trim()) ? Number(value.trim()) : null
}

function required(errors: FormErrors, key: string, value: string, max: number) {
  if (!filled(value)) errors[key] = 'required'
  else if (value.trim().length > max) errors[key] = 'tooLong'
}

/** Нужен ли офлайн-адрес: специалист работает не только онлайн. */
export function needsLocation(values: Pick<SpecialistFormValues, 'formats'>): boolean {
  return values.formats.some((f) => f === 'clinic' || f === 'home')
}

export function validateStep(step: StepId, v: SpecialistFormValues): FormErrors {
  const e: FormErrors = {}
  switch (step) {
    case 'basic': {
      required(e, 'firstName', v.firstName, 50)
      required(e, 'lastName', v.lastName, 50)
      required(e, 'specializationRu', v.specializationRu, 100)
      required(e, 'specializationKk', v.specializationKk, 100)
      const exp = parseInteger(v.experienceYears)
      if (!filled(v.experienceYears)) e.experienceYears = 'required'
      else if (exp === null || exp > 60) e.experienceYears = 'invalidNumber'
      const price = parseInteger(v.price)
      if (!filled(v.price)) e.price = 'required'
      else if (price === null || price <= 0 || price > 10_000_000)
        e.price = 'invalidNumber'
      if (v.formats.length === 0) e.formats = 'formatsRequired'
      break
    }
    case 'location': {
      const hasAddress = filled(v.addressRu) || filled(v.addressKk)
      if (needsLocation(v)) {
        if (v.city === '') e.city = 'required'
      }
      if (needsLocation(v) || hasAddress) {
        required(e, 'addressRu', v.addressRu, 200)
        required(e, 'addressKk', v.addressKk, 200)
      }
      break
    }
    case 'about': {
      for (const key of ['bioRu', 'bioKk'] as const) {
        const len = v[key].trim().length
        if (len === 0) e[key] = 'required'
        else if (len < 20) e[key] = 'tooShort'
        else if (len > 2000) e[key] = 'tooLong'
      }
      if (filled(v.youtubeUrl) && parseYoutubeId(v.youtubeUrl) === null) {
        e.youtubeUrl = 'invalidYoutube'
      }
      break
    }
    case 'education': {
      const year = new Date().getFullYear()
      v.education.forEach((item, i) => {
        required(e, `education.${i}.institutionRu`, item.institutionRu, 150)
        required(e, `education.${i}.institutionKk`, item.institutionKk, 150)
        required(e, `education.${i}.programRu`, item.programRu, 150)
        required(e, `education.${i}.programKk`, item.programKk, 150)
        const y = parseInteger(item.year)
        if (!filled(item.year)) e[`education.${i}.year`] = 'required'
        else if (y === null || y < 1950 || y > year)
          e[`education.${i}.year`] = 'invalidYear'
      })
      break
    }
    case 'cases': {
      v.cases.forEach((c, i) => {
        required(e, `cases.${i}.titleRu`, c.titleRu, 100)
        required(e, `cases.${i}.titleKk`, c.titleKk, 100)
        for (const f of [
          'descriptionRu',
          'descriptionKk',
          'beforeRu',
          'beforeKk',
          'afterRu',
          'afterKk',
        ] as const) {
          required(e, `cases.${i}.${f}`, c[f], 2000)
        }
        for (const f of ['beforeImage', 'afterImage'] as const) {
          if (filled(c[f]) && !isHttpUrl(c[f])) e[`cases.${i}.${f}`] = 'invalidUrl'
        }
      })
      break
    }
    case 'socials': {
      v.socials.forEach((s, i) => {
        if (!filled(s.url)) e[`socials.${i}.url`] = 'required'
        else if (!isHttpUrl(s.url)) e[`socials.${i}.url`] = 'invalidUrl'
      })
      break
    }
  }
  return e
}

/** Первый шаг с ошибками или null, если вся форма корректна. */
export function findFirstInvalidStep(
  v: SpecialistFormValues,
): { step: StepId; errors: FormErrors } | null {
  for (const step of STEP_IDS) {
    const errors = validateStep(step, v)
    if (Object.keys(errors).length > 0) return { step, errors }
  }
  return null
}

/** Преобразует корректные значения формы в данные профиля. */
export function toNewSpecialist(v: SpecialistFormValues): NewSpecialist {
  const t = (s: string) => s.trim()
  const hasAddress = filled(v.addressRu) && filled(v.addressKk)
  return {
    firstName: t(v.firstName),
    lastName: t(v.lastName),
    specialization: { ru: t(v.specializationRu), kk: t(v.specializationKk) },
    experienceYears: Number(t(v.experienceYears)),
    price: Number(t(v.price)),
    priceFrom: v.priceFrom,
    formats: v.formats,
    city: v.city === '' ? undefined : v.city,
    address: hasAddress ? { ru: t(v.addressRu), kk: t(v.addressKk) } : undefined,
    bio: { ru: t(v.bioRu), kk: t(v.bioKk) },
    youtubeUrl: filled(v.youtubeUrl) ? t(v.youtubeUrl) : undefined,
    education: v.education.map((e) => ({
      institution: { ru: t(e.institutionRu), kk: t(e.institutionKk) },
      program: { ru: t(e.programRu), kk: t(e.programKk) },
      year: Number(t(e.year)),
    })),
    cases: v.cases.map((c) => ({
      id: c.id,
      title: { ru: t(c.titleRu), kk: t(c.titleKk) },
      description: { ru: t(c.descriptionRu), kk: t(c.descriptionKk) },
      resultBefore: { ru: t(c.beforeRu), kk: t(c.beforeKk) },
      resultAfter: { ru: t(c.afterRu), kk: t(c.afterKk) },
      beforeImage: filled(c.beforeImage) ? t(c.beforeImage) : undefined,
      afterImage: filled(c.afterImage) ? t(c.afterImage) : undefined,
    })),
    socials: v.socials.map((s) => ({ type: s.type, url: t(s.url) })),
  }
}
