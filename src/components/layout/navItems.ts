export interface NavItem {
  to: string
  labelKey: string
  end?: boolean
}

/** Ссылки в шапке (десктоп). */
export const headerNav: readonly NavItem[] = [
  { to: '/specialists', labelKey: 'nav.specialists' },
  { to: '/support', labelKey: 'nav.support' },
  { to: '/favorites', labelKey: 'nav.favorites' },
]

/** Пункты нижней панели (мобильные). */
export const bottomNav: readonly NavItem[] = [
  { to: '/', labelKey: 'nav.home', end: true },
  { to: '/specialists', labelKey: 'nav.search' },
  { to: '/favorites', labelKey: 'nav.favorites' },
  { to: '/support', labelKey: 'nav.help' },
]
