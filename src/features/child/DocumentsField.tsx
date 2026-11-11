import { useId, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChildDocument } from '../../types'
import { ALLOWED_FILE_TYPES, validateDocumentFile } from './validation'
import styles from './Child.module.css'

interface DocumentsFieldProps {
  documents: ChildDocument[]
  onChange: (documents: ChildDocument[]) => void
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(file)
  })
}

export function DocumentsField({ documents, onChange }: DocumentsFieldProps) {
  const { t } = useTranslation()
  const inputId = useId()
  const [errorKey, setErrorKey] = useState<'type' | 'size' | 'read' | null>(null)

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    setErrorKey(null)
    const added: ChildDocument[] = []
    for (const file of files) {
      const problem = validateDocumentFile(file)
      if (problem) {
        setErrorKey(problem)
        continue
      }
      try {
        added.push({
          id: crypto.randomUUID(),
          name: file.name,
          dataUrl: await readAsDataUrl(file),
        })
      } catch {
        setErrorKey('read')
      }
    }
    if (added.length > 0) onChange([...documents, ...added])
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>
        {t('child.sections.documents')}{' '}
        <span className={styles.muted}>({t('child.optional')})</span>
      </legend>
      <p className={styles.warning} role="note">
        {t('child.documents.tempWarning')}
      </p>
      <p className={styles.muted}>{t('child.documents.hint')}</p>
      <input
        id={inputId}
        type="file"
        multiple
        accept={ALLOWED_FILE_TYPES.join(',')}
        onChange={(e) => void handleFiles(e)}
        aria-label={t('child.documents.add')}
        aria-describedby={errorKey ? `${inputId}-error` : undefined}
      />
      {errorKey && (
        <p id={`${inputId}-error`} role="alert" className={styles.error}>
          {t(`child.documents.errors.${errorKey}`)}
        </p>
      )}
      {documents.length > 0 && (
        <ul className={styles.docList}>
          {documents.map((d) => (
            <li key={d.id}>
              <span>{d.name}</span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => onChange(documents.filter((x) => x.id !== d.id))}
              >
                {t('child.documents.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}
