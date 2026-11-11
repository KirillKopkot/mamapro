import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { SocialLink, SocialType } from '../../../types'
import { Section } from './Section'
import styles from './SocialsSection.module.css'

const icons: Record<SocialType, ReactElement> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />,
  telegram: <path d="M21 4 3 11l5 2 2 6 3-4 5 4 3-15zM8 13l9-6-7 8" />,
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
}

export function SocialsSection({ socials }: { socials: SocialLink[] }) {
  const { t } = useTranslation()
  if (socials.length === 0) return null

  return (
    <Section title={t('profile.socials')}>
      <ul className={styles.list}>
        {socials.map((s) => {
          const label = t(`profile.social.${s.type}`)
          return (
            <li key={`${s.type}-${s.url}`}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label={label}
                title={label}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {icons[s.type]}
                </svg>
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
