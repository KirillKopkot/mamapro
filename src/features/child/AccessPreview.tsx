import { useTranslation } from 'react-i18next'
import type { ChildSection, ChildView } from '../../types'
import { CHILD_SECTIONS } from './sections'
import styles from './Child.module.css'

interface AccessPreviewProps {
  view: ChildView
}

/** Показывает ровно то, что увидит специалист. */
export function AccessPreview({ view }: AccessPreviewProps) {
  const { t } = useTranslation()
  const visible = CHILD_SECTIONS.filter((s) => view[s] !== undefined)

  function renderValue(section: ChildSection) {
    if (section === 'documents') {
      const docs = view.documents ?? []
      return docs.length === 0 ? (
        <p className={styles.muted}>{t('child.access.preview.empty')}</p>
      ) : (
        <ul className={styles.docList}>
          {docs.map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      )
    }
    const text = view[section]
    return text ? (
      <p className={styles.previewText}>{text}</p>
    ) : (
      <p className={styles.muted}>{t('child.access.preview.empty')}</p>
    )
  }

  return (
    <div className={styles.preview}>
      <p className={styles.muted}>{t('child.access.preview.hiddenNote')}</p>
      {visible.length === 0 ? (
        <p>{t('child.access.preview.nothing')}</p>
      ) : (
        <dl>
          {visible.map((s) => (
            <div key={s}>
              <dt>{t(`child.sections.${s}`)}</dt>
              <dd>{renderValue(s)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
