import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { NEW_CHILD_DRAFT_KEY } from '../../api'
import type { Child, ChildDocument, ChildDraft } from '../../types'
import { DocumentsField } from './DocumentsField'
import {
  useChildDraft,
  useClearChildDraft,
  useSaveChild,
  useSaveChildDraft,
} from './hooks'
import { MAX_TEXT_LENGTH, parseAge, validateChildForm } from './validation'
import type { ChildField, ChildFormErrors } from './validation'
import styles from './Child.module.css'

const DRAFT_DELAY_MS = 600
const TEXT_FIELDS = ['features', 'manifestations', 'whatHelps', 'stressTriggers'] as const

function toDraft(child: Child | null): ChildDraft {
  return {
    name: child?.name ?? '',
    age: child ? String(child.age) : '',
    features: child?.features ?? '',
    manifestations: child?.manifestations ?? '',
    whatHelps: child?.whatHelps ?? '',
    stressTriggers: child?.stressTriggers ?? '',
  }
}

interface ChildFormProps {
  /** null — создание нового ребёнка */
  child: Child | null
  onSaved: (child: Child) => void
}

/** Загружает черновик и только потом показывает форму с начальными значениями. */
export function ChildForm({ child, onSaved }: ChildFormProps) {
  const { t } = useTranslation()
  const draftKey = child?.id ?? NEW_CHILD_DRAFT_KEY
  const draft = useChildDraft(draftKey)

  if (draft.isPending) return <p role="status">{t('common.loading')}</p>
  return (
    <ChildFormFields
      key={draftKey}
      child={child}
      draftKey={draftKey}
      draft={draft.data ?? null}
      onSaved={onSaved}
    />
  )
}

interface FieldsProps extends ChildFormProps {
  draftKey: string
  draft: ChildDraft | null
}

function ChildFormFields({ child, draftKey, draft, onSaved }: FieldsProps) {
  const { t } = useTranslation()
  const [values, setValues] = useState<ChildDraft>(draft ?? toDraft(child))
  const [documents, setDocuments] = useState<ChildDocument[]>(child?.documents ?? [])
  const [restored, setRestored] = useState(draft !== null)
  const [errors, setErrors] = useState<ChildFormErrors>({})
  const saveChild = useSaveChild()
  const saveDraft = useSaveChildDraft(draftKey)
  const clearDraft = useClearChildDraft()
  const dirty = useRef(false)
  const { mutate: persistDraft } = saveDraft

  // автосохранение черновика с задержкой после последнего изменения
  useEffect(() => {
    if (!dirty.current) return
    const timer = setTimeout(() => persistDraft(values), DRAFT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [values, persistDraft])

  function setField(field: ChildField, value: string) {
    dirty.current = true
    setValues((v) => ({ ...v, [field]: value }))
  }

  function discardDraft() {
    clearDraft.mutate(draftKey)
    dirty.current = false
    setValues(toDraft(child))
    setRestored(false)
    setErrors({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateChildForm(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const age = parseAge(values.age)
    if (age === null) return
    dirty.current = false
    try {
      const saved = await saveChild.mutateAsync({
        id: child?.id,
        name: values.name.trim(),
        age,
        features: values.features,
        manifestations: values.manifestations,
        whatHelps: values.whatHelps,
        stressTriggers: values.stressTriggers,
        documents,
      })
      await clearDraft.mutateAsync(draftKey)
      onSaved(saved)
    } catch {
      // ошибка показана через saveChild.isError
    }
  }

  const errorText = (field: ChildField) => {
    const key = errors[field]
    return key
      ? t(`child.errors.${key}`, { max: field === 'name' ? 50 : MAX_TEXT_LENGTH })
      : null
  }

  return (
    <form className={styles.form} onSubmit={(e) => void handleSubmit(e)} noValidate>
      {restored && (
        <div className={styles.notice} role="status">
          <span>{t('child.form.draftRestored')}</span>
          <button type="button" className={styles.linkButton} onClick={discardDraft}>
            {t('child.form.draftDiscard')}
          </button>
        </div>
      )}

      <label className={styles.field}>
        <span>{t('child.form.name')}</span>
        <input
          value={values.name}
          maxLength={200}
          autoComplete="off"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'child-name-error' : undefined}
          onChange={(e) => setField('name', e.target.value)}
        />
        {errors.name && (
          <span id="child-name-error" role="alert" className={styles.error}>
            {errorText('name')}
          </span>
        )}
      </label>

      <label className={styles.field}>
        <span>{t('child.form.age')}</span>
        <input
          value={values.age}
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={errors.age ? true : undefined}
          aria-describedby={errors.age ? 'child-age-error' : undefined}
          onChange={(e) => setField('age', e.target.value)}
        />
        {errors.age && (
          <span id="child-age-error" role="alert" className={styles.error}>
            {errorText('age')}
          </span>
        )}
      </label>

      {TEXT_FIELDS.map((field) => (
        <label key={field} className={styles.field}>
          <span>
            {t(`child.sections.${field}`)}{' '}
            <span className={styles.muted}>({t('child.optional')})</span>
          </span>
          <textarea
            rows={4}
            value={values[field]}
            aria-invalid={errors[field] ? true : undefined}
            aria-describedby={errors[field] ? `child-${field}-error` : undefined}
            onChange={(e) => setField(field, e.target.value)}
          />
          {errors[field] && (
            <span id={`child-${field}-error`} role="alert" className={styles.error}>
              {errorText(field)}
            </span>
          )}
        </label>
      ))}

      <DocumentsField documents={documents} onChange={setDocuments} />

      <div className={styles.actions}>
        <button type="submit" className={styles.primary} disabled={saveChild.isPending}>
          {t(saveChild.isPending ? 'child.form.saving' : 'child.form.save')}
        </button>
        {saveDraft.isSuccess && !saveChild.isPending && (
          <span className={styles.muted} role="status">
            {t('child.form.draftSaved')}
          </span>
        )}
      </div>
      {saveChild.isError && (
        <p role="alert" className={styles.error}>
          {t('child.form.saveError')}
        </p>
      )}
    </form>
  )
}
