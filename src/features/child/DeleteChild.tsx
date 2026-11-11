import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Child } from '../../types'
import { useDeleteChild } from './hooks'
import styles from './Child.module.css'

export function DeleteChild({
  child,
  onDeleted,
}: {
  child: Child
  onDeleted: () => void
}) {
  const { t } = useTranslation()
  const [confirming, setConfirming] = useState(false)
  const del = useDeleteChild()

  async function confirm() {
    try {
      await del.mutateAsync(child.id)
      onDeleted()
    } catch {
      // ошибка показана ниже
    }
  }

  if (!confirming) {
    return (
      <button type="button" className={styles.danger} onClick={() => setConfirming(true)}>
        {t('child.delete.button')}
      </button>
    )
  }
  return (
    <div
      className={styles.confirm}
      role="alertdialog"
      aria-labelledby="delete-confirm-text"
    >
      <p id="delete-confirm-text">{t('child.delete.confirmText')}</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.danger}
          disabled={del.isPending}
          onClick={() => void confirm()}
        >
          {t('child.delete.confirm')}
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => setConfirming(false)}
        >
          {t('child.delete.cancel')}
        </button>
      </div>
      {del.isError && (
        <p role="alert" className={styles.error}>
          {t('common.error')}
        </p>
      )}
    </div>
  )
}
