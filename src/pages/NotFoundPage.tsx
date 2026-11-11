import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageStub } from '../components/PageStub/PageStub'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <>
      <PageStub titleKey="pages.notFound" />
      <p>{t('notFound.hint')}</p>
      <Link to="/specialists">{t('notFound.toSpecialists')}</Link>
    </>
  )
}
