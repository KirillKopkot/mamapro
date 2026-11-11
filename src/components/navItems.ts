export interface NavItem {
  to: string
  labelKey: string
  end?: boolean
}

export const navItems: readonly NavItem[] = [
  { to: '/', labelKey: 'nav.home', end: true },
  { to: '/specialists', labelKey: 'nav.specialists' },
  { to: '/favorites', labelKey: 'nav.favorites' },
  { to: '/support', labelKey: 'nav.support' },
  { to: '/child', labelKey: 'nav.profile' },
]
