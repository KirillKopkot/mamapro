import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Specialist, SpecialistFormValues } from '../../types'
import { useCreateSpecialist } from '../specialists/hooks'
import { ProfilePreview } from '../specialists/profile/ProfilePreview'
import {
  useClearSpecialistDraft,
  useSaveSpecialistDraft,
  useSpecialistDraft,
} from './hooks'
import {
  AboutStep,
  BasicStep,
  CasesStep,
  EducationStep,
  LocationStep,
  SocialsStep,
} from './StepFields'
import type { StepProps } from './StepFields'
import {
  STEP_IDS,
  emptyFormValues,
  findFirstInvalidStep,
  toNewSpecialist,
  validateStep,
} from './validation'
import type { FormErrors, StepId } from './validation'
import styles from './SpecialistForm.module.css'

const DRAFT_DELAY_MS = 600
const TOTAL_STEPS = STEP_IDS.length + 1 // + предпросмотр

const stepComponents: Record<StepId, (p: StepProps) => React.JSX.Element> = {
  basic: BasicStep,
  location: LocationStep,
  about: AboutStep,
  education: EducationStep,
  cases: CasesStep,
  socials: SocialsStep,
}

/** Загружает черновик и только потом показывает мастер. */
export function SpecialistWizard() {
  const { t } = useTranslation()
  const draft = useSpecialistDraft()
  if (draft.isPending) return <p role="status">{t('common.loading')}</p>
  return <Wizard draft={draft.data ?? null} />
}

function previewSpecialist(values: SpecialistFormValues): Specialist {
  return {
    ...toNewSpecialist(values),
    id: 'preview',
    status: 'pending',
    ratingAvg: 0,
    reviewsCount: 0,
  }
}

function Wizard({ draft }: { draft: SpecialistFormValues | null }) {
  const { t } = useTranslation()
  const [values, setValues] = useState<SpecialistFormValues>(draft ?? emptyFormValues())
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [restored, setRestored] = useState(draft !== null)
  const [submitted, setSubmitted] = useState(false)
  const create = useCreateSpecialist()
  const saveDraft = useSaveSpecialistDraft()
  const clearDraft = useClearSpecialistDraft()
  const dirty = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { mutate: persistDraft } = saveDraft

  useEffect(() => {
    if (!dirty.current) return
    const timer = setTimeout(() => persistDraft(values), DRAFT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [values, persistDraft])

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  function update(patch: Partial<SpecialistFormValues>) {
    dirty.current = true
    setValues((v) => ({ ...v, ...patch }))
  }

  function discardDraft() {
    clearDraft.mutate()
    dirty.current = false
    setValues(emptyFormValues())
    setErrors({})
    setStep(0)
    setRestored(false)
  }

  const isPreview = step === STEP_IDS.length
  const stepId = STEP_IDS[step]

  function next() {
    if (stepId) {
      const found = validateStep(stepId, values)
      setErrors(found)
      if (Object.keys(found).length > 0) return
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  function back() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const invalid = findFirstInvalidStep(values)
    if (invalid) {
      setErrors(invalid.errors)
      setStep(STEP_IDS.indexOf(invalid.step))
      return
    }
    dirty.current = false
    try {
      await create.mutateAsync(toNewSpecialist(values))
      await clearDraft.mutateAsync()
      setSubmitted(true)
    } catch {
      // ошибка показана через create.isError
    }
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <h2>{t('specialistForm.success.title')}</h2>
        <p>{t('specialistForm.success.text')}</p>
        <Link to="/specialists" className={styles.primary}>
          {t('specialistForm.success.link')}
        </Link>
      </div>
    )
  }

  const StepComponent = stepId ? stepComponents[stepId] : null
  const stepTitle = t(`specialistForm.steps.${stepId ?? 'preview'}`)
  const percent = Math.round(((step + 1) / TOTAL_STEPS) * 100)

  return (
    <form className={styles.form} onSubmit={(e) => void submit(e)} noValidate>
      <div>
        <p id="wizard-progress" className={styles.progressLabel}>
          {t('specialistForm.progress', { current: step + 1, total: TOTAL_STEPS })}
        </p>
        <div
          className={styles.progress}
          role="progressbar"
          aria-labelledby="wizard-progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {restored && (
        <div className={styles.notice} role="status">
          <span>{t('specialistForm.draftRestored')}</span>
          <button type="button" className={styles.linkButton} onClick={discardDraft}>
            {t('specialistForm.draftDiscard')}
          </button>
        </div>
      )}

      <h2 ref={headingRef} tabIndex={-1} className={styles.stepTitle}>
        {stepTitle}
      </h2>

      {StepComponent ? (
        <StepComponent values={values} errors={errors} update={update} />
      ) : (
        <>
          <p className={styles.muted}>{t('specialistForm.previewNote')}</p>
          <ProfilePreview specialist={previewSpecialist(values)} />
          <p className={styles.muted}>{t('specialistForm.moderationNote')}</p>
        </>
      )}

      {Object.keys(errors).length > 0 && (
        <p role="alert" className={styles.error}>
          {t('specialistForm.fixErrors')}
        </p>
      )}
      {create.isError && (
        <p role="alert" className={styles.error}>
          {t('common.error')}
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          onClick={back}
          disabled={step === 0}
        >
          {t('specialistForm.back')}
        </button>
        {isPreview ? (
          <button type="submit" className={styles.primary} disabled={create.isPending}>
            {t(create.isPending ? 'specialistForm.submitting' : 'specialistForm.submit')}
          </button>
        ) : (
          <button type="button" className={styles.primary} onClick={next}>
            {t('specialistForm.next')}
          </button>
        )}
        {saveDraft.isSuccess && (
          <span className={styles.muted} role="status">
            {t('specialistForm.draftSaved')}
          </span>
        )}
      </div>
    </form>
  )
}
