import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import styles from './Auth.module.css'

interface PasswordToggleProps {
  shown: boolean
  controls: string
  onToggle: () => void
}

/** Красная ссылка «Показать пароль» / «Скрыть пароль». */
export function PasswordToggle({ shown, controls, onToggle }: PasswordToggleProps) {
  const { t } = useTranslation()
  return (
    <Button
      variant="link"
      className={styles.inline}
      aria-pressed={shown}
      aria-controls={controls}
      onClick={onToggle}
    >
      {t(shown ? 'auth.hidePassword' : 'auth.showPassword')}
    </Button>
  )
}
