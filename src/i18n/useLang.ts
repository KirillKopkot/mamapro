import { useTranslation } from 'react-i18next'
import type { Lang } from '../types'

/** Текущий язык интерфейса. */
export function useLang(): Lang {
  const { i18n } = useTranslation()
  return i18n.resolvedLanguage === 'kk' ? 'kk' : 'ru'
}
