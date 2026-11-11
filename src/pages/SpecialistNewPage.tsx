import { useTranslation } from 'react-i18next'
import { SpecialistWizard } from '../features/specialistForm/SpecialistWizard'

export default function SpecialistNewPage() {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t('pages.specialistNew')}</h1>
      <SpecialistWizard />
    </div>
  )
}
