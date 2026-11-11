import { useTranslation } from 'react-i18next'
import styles from './Compare.module.css'

/** Отметка лучшего значения: иконка + текст, не только цвет. */
export function BestMark() {
  const { t } = useTranslation()
  return (
    <span className={styles.best}>
      <span aria-hidden="true">✓</span> {t('compare.best')}
    </span>
  )
}
