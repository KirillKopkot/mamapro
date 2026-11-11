import { useTranslation } from 'react-i18next'

interface PageStubProps {
  titleKey: string
}

export function PageStub({ titleKey }: PageStubProps) {
  const { t } = useTranslation()
  return <h1>{t(titleKey)}</h1>
}
