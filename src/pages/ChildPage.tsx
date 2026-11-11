import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessManager } from '../features/child/AccessManager'
import { ChildForm } from '../features/child/ChildForm'
import { DeleteChild } from '../features/child/DeleteChild'
import { useChildren } from '../features/child/hooks'
import childStyles from '../features/child/Child.module.css'
import styles from './ChildPage.module.css'

const NEW = 'new'

export default function ChildPage() {
  const { t } = useTranslation()
  const { data: children, isPending, isError, refetch } = useChildren()
  // выбранный ребёнок хранится только в состоянии, а не в URL
  const [selection, setSelection] = useState<string | null>(null)

  if (isPending) return <p role="status">{t('common.loading')}</p>
  if (isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button
          type="button"
          className={childStyles.secondary}
          onClick={() => void refetch()}
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }

  const adding = children.length === 0 || selection === NEW
  const current = adding
    ? null
    : (children.find((c) => c.id === selection) ?? children[0] ?? null)

  return (
    <div className={styles.page}>
      <h1>{t('pages.child')}</h1>
      <p className={childStyles.privacy}>{t('child.privacy')}</p>

      {children.length > 0 && (
        <nav aria-label={t('child.tabsLabel')}>
          <ul className={childStyles.tabs}>
            {children.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={childStyles.tab}
                  aria-pressed={current?.id === c.id}
                  onClick={() => setSelection(c.id)}
                >
                  {c.name}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={childStyles.tab}
                aria-pressed={adding}
                onClick={() => setSelection(NEW)}
              >
                + {t('child.addChild')}
              </button>
            </li>
          </ul>
        </nav>
      )}

      <section className={childStyles.card} aria-labelledby="child-form-title">
        <h2 id="child-form-title">
          {t(current ? 'child.form.editTitle' : 'child.form.newTitle')}
        </h2>
        <ChildForm child={current} onSaved={(saved) => setSelection(saved.id)} />
      </section>

      {current && (
        <>
          <AccessManager key={current.id} child={current} />
          <div>
            <DeleteChild
              key={current.id}
              child={current}
              onDeleted={() => setSelection(null)}
            />
          </div>
        </>
      )}
    </div>
  )
}
