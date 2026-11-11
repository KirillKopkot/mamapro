import type { ReactNode } from 'react'
import type { Specialist } from '../../types'
import { AboutSection } from '../specialists/profile/AboutSection'
import { CasesSection } from '../specialists/profile/CasesSection'
import { EducationSection } from '../specialists/profile/EducationSection'
import { SocialsSection } from '../specialists/profile/SocialsSection'
import { VideoSection } from '../specialists/profile/VideoSection'
import { parseYoutubeId } from '../specialists/youtube'
import { CompareReviews } from './CompareReviews'
import { FormatsAndLocation } from './FormatsAndLocation'

export interface CompareRow {
  key: string
  hasData: (s: Specialist) => boolean
  render: (s: Specialist) => ReactNode
}

/** Разделы подробной информации. На десктопе выравниваются по строкам, на мобильных — идут подряд. */
export const compareRows: readonly CompareRow[] = [
  {
    key: 'formats',
    hasData: () => true,
    render: (s) => <FormatsAndLocation specialist={s} />,
  },
  {
    key: 'video',
    hasData: (s) => parseYoutubeId(s.youtubeUrl) !== null,
    render: (s) => <VideoSection url={s.youtubeUrl} />,
  },
  {
    key: 'about',
    hasData: (s) => s.bio.ru !== '' || s.bio.kk !== '',
    render: (s) => <AboutSection bio={s.bio} />,
  },
  {
    key: 'education',
    hasData: (s) => s.education.length > 0,
    render: (s) => <EducationSection education={s.education} />,
  },
  {
    key: 'cases',
    hasData: (s) => s.cases.length > 0,
    render: (s) => <CasesSection cases={s.cases} />,
  },
  {
    key: 'socials',
    hasData: (s) => s.socials.length > 0,
    render: (s) => <SocialsSection socials={s.socials} />,
  },
  {
    key: 'reviews',
    hasData: () => true,
    render: (s) => <CompareReviews specialistId={s.id} />,
  },
]
