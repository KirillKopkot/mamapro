import { useTranslation } from 'react-i18next'
import { AccessPreview } from './AccessPreview'
import { useChildForSpecialist } from './hooks'

/** Предпросмотр выданного доступа через api (так, как данные получит специалист). */
export function GrantPreview({
  childId,
  specialistId,
}: {
  childId: string
  specialistId: string
}) {
  const { t } = useTranslation()
  const { data, isPending, isError } = useChildForSpecialist(childId, specialistId)
  if (isPending) return <p role="status">{t('common.loading')}</p>
  if (isError) return <p role="alert">{t('common.error')}</p>
  return <AccessPreview view={data ?? { childId }} />
}
