export type Lang = 'ru' | 'kk'

/** Двуязычный контент, который хранится в данных. */
export interface LocalizedText {
  ru: string
  kk: string
}

export type City = 'astana' | 'almaty'
export type WorkFormat = 'clinic' | 'home' | 'online'
export type ModerationStatus = 'pending' | 'approved' | 'rejected'
export type SocialType = 'instagram' | 'facebook' | 'telegram' | 'youtube' | 'website'

export interface Education {
  institution: LocalizedText
  program: LocalizedText
  year: number
}

export interface SpecialistCase {
  id: string
  title: LocalizedText
  description: LocalizedText
  resultBefore: LocalizedText
  resultAfter: LocalizedText
  beforeImage?: string
  afterImage?: string
}

export interface SocialLink {
  type: SocialType
  url: string
}

export interface Specialist {
  id: string
  firstName: string
  lastName: string
  specialization: LocalizedText
  experienceYears: number
  /** Цена в тенге */
  price: number
  priceFrom: boolean
  formats: WorkFormat[]
  city?: City
  /** Не требуется для формата online */
  address?: LocalizedText
  bio: LocalizedText
  /** Видео до 3 минут */
  youtubeUrl?: string
  education: Education[]
  cases: SpecialistCase[]
  socials: SocialLink[]
  status: ModerationStatus
  rejectionReason?: LocalizedText
  ratingAvg: number
  reviewsCount: number
}

export interface Review {
  id: string
  specialistId: string
  authorName: string
  /** 1–5 */
  rating: number
  text: string
  /** ISO-дата */
  date: string
  status: ModerationStatus
}

export interface ChildDocument {
  id: string
  name: string
  dataUrl?: string
}

export interface Child {
  id: string
  name: string
  age: number
  features: string
  manifestations: string
  whatHelps: string
  stressTriggers: string
  documents: ChildDocument[]
}

export type ChildSection =
  'features' | 'manifestations' | 'whatHelps' | 'stressTriggers' | 'documents'

export interface AccessGrant {
  childId: string
  specialistId: string
  sections: ChildSection[]
}

/** Что специалист видит о ребёнке: только открытые разделы, без имени и возраста. */
export interface ChildView {
  childId: string
  features?: string
  manifestations?: string
  whatHelps?: string
  stressTriggers?: string
  documents?: ChildDocument[]
}

/** Черновик формы ребёнка (текстовые поля; документы в черновик не попадают). */
export interface ChildDraft {
  name: string
  age: string
  features: string
  manifestations: string
  whatHelps: string
  stressTriggers: string
}

export type SupportCategory = 'documents' | 'benefits'

export interface SupportArticle {
  id: string
  category: SupportCategory
  title: LocalizedText
  summary: LocalizedText
  steps: LocalizedText[]
  /** Необходимые документы (чек-лист) */
  documents: { id: string; text: LocalizedText }[]
}

export interface RouteLink {
  /** Внутренний маршрут приложения */
  to: string
  label: LocalizedText
}

export interface RouteStep {
  id: string
  title: LocalizedText
  summary: LocalizedText
  actions: LocalizedText[]
  documents: LocalizedText[]
  links: RouteLink[]
}
