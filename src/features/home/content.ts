import type { WorkFormat } from '../../types'

/** Карточки «Помощь, с которой можно начать» (десктоп): направление → фильтр специализаций (русские названия). */
export const directions = [
  {
    id: 'speech',
    to: '/specialists',
    specializations: ['Логопед', 'Дефектолог', 'Нейропсихолог'],
  },
  { id: 'health', to: '/specialists', specializations: ['Невролог'] },
  { id: 'emotions', to: '/specialists', specializations: ['Психолог'] },
  { id: 'mom', to: '/support', specializations: [], pink: true },
] as const

/** Карточки «С чего начать?» (мобильные). */
export const startQuestions = [
  { id: 'doctor', to: '/specialists' },
  { id: 'documents', to: '/support/documents' },
  { id: 'child', to: '/support/route' },
  { id: 'self', to: '/community', pink: true },
] as const

export const steps = ['situation', 'documents', 'search', 'self'] as const

export const faqItems = ['whom', 'choose', 'strength', 'repeat'] as const

export type FormatChoice = 'any' | 'online' | 'offline'

/** Выбор формата на главной → значения параметра `formats` страницы /specialists. */
export const formatChoiceToFormats: Record<FormatChoice, WorkFormat[]> = {
  any: [],
  online: ['online'],
  offline: ['clinic', 'home'],
}
