import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ReviewsSection } from '../features/reviews/ReviewsSection'
import { useSpecialist } from '../features/specialists/hooks'
import { AboutSection } from '../features/specialists/profile/AboutSection'
import { CasesSection } from '../features/specialists/profile/CasesSection'
import { EducationSection } from '../features/specialists/profile/EducationSection'
import { ProfileHeader } from '../features/specialists/profile/ProfileHeader'
import { SocialsSection } from '../features/specialists/profile/SocialsSection'
import { VideoSection } from '../features/specialists/profile/VideoSection'
import NotFoundPage from './NotFoundPage'
import styles from './SpecialistDetailsPage.module.css'

export default function SpecialistDetailsPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const { data: specialist, isPending, isError, refetch } = useSpecialist(id)

  if (isPending) return <p role="status">{t('common.loading')}</p>
  if (isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button type="button" className={styles.button} onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </div>
    )
  }
  if (!specialist || specialist.status !== 'approved') return <NotFoundPage />

  return (
    <div className={styles.page}>
      <Link to="/specialists" className={styles.back}>
        ← {t('pages.specialists')}
      </Link>
      <ProfileHeader specialist={specialist} />
      <VideoSection url={specialist.youtubeUrl} />
      <AboutSection bio={specialist.bio} />
      <CasesSection cases={specialist.cases} />
      <EducationSection education={specialist.education} />
      <SocialsSection socials={specialist.socials} />
      <ReviewsSection specialistId={specialist.id} />
    </div>
  )
}
