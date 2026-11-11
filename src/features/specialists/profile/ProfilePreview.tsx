import type { Specialist } from '../../../types'
import { CompareSummary } from '../../compare/CompareSummary'
import { FormatsAndLocation } from '../../compare/FormatsAndLocation'
import { AboutSection } from './AboutSection'
import { CasesSection } from './CasesSection'
import { EducationSection } from './EducationSection'
import { SocialsSection } from './SocialsSection'
import { VideoSection } from './VideoSection'
import styles from './ProfilePreview.module.css'

/** Полный просмотр профиля без избранного и отзывов (для предпросмотра и модерации). */
export function ProfilePreview({ specialist: s }: { specialist: Specialist }) {
  return (
    <div className={styles.root}>
      <CompareSummary
        specialist={s}
        best={{ experience: false, price: false, rating: false }}
      />
      <FormatsAndLocation specialist={s} />
      <VideoSection url={s.youtubeUrl} />
      <AboutSection bio={s.bio} />
      <CasesSection cases={s.cases} />
      <EducationSection education={s.education} />
      <SocialsSection socials={s.socials} />
    </div>
  )
}
