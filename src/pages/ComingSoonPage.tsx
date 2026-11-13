import { useTranslation } from 'react-i18next'
import { Button, Card } from '../components/ui'

interface ComingSoonPageProps {
  titleKey: string
  textKey: string
  backTo: string
  backKey: string
}

/** Страница-заглушка: функция появится позже (восстановление пароля, запись на консультацию). */
export default function ComingSoonPage({
  titleKey,
  textKey,
  backTo,
  backKey,
}: ComingSoonPageProps) {
  const { t } = useTranslation()
  return (
    <Card variant="pink" as="section" style={{ maxWidth: 560 }}>
      <h1>{t(titleKey)}</h1>
      <p style={{ margin: 'var(--space-3) 0 var(--space-4)' }}>{t(textKey)}</p>
      <Button to={backTo} variant="secondary">
        {t(backKey)}
      </Button>
    </Card>
  )
}
