import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { Lang } from '../types'
import ru from './ru.json'
import kk from './kk.json'

export const LANG_STORAGE_KEY = 'lang'
export const DEFAULT_LANG: Lang = 'ru'
export const LANGS: readonly Lang[] = ['ru', 'kk']

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored === 'ru' || stored === 'kk') return stored
  } catch {
    // localStorage недоступен — используем язык по умолчанию
  }
  return DEFAULT_LANG
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    // игнорируем
  }
  void i18n.changeLanguage(lang)
}

void i18n.use(initReactI18next).init({
  resources: { ru: { translation: ru }, kk: { translation: kk } },
  lng: readStoredLang(),
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.language

export default i18n
