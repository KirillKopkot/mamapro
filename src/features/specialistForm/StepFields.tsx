import { useTranslation } from 'react-i18next'
import { cities } from '../../config/cities'
import { useLang } from '../../i18n/useLang'
import type { SocialType, SpecialistFormValues, WorkFormat } from '../../types'
import { WORK_FORMATS } from '../specialists/filtering'
import { Field } from './Field'
import { SOCIAL_TYPES, needsLocation } from './validation'
import type { FormErrors } from './validation'
import styles from './SpecialistForm.module.css'

export interface StepProps {
  values: SpecialistFormValues
  errors: FormErrors
  update: (patch: Partial<SpecialistFormValues>) => void
}

const newId = () => crypto.randomUUID()

function patchItem<T extends { id: string }>(
  list: T[],
  id: string,
  patch: Partial<T>,
): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item))
}

export function BasicStep({ values: v, errors, update }: StepProps) {
  const { t } = useTranslation()
  const toggleFormat = (f: WorkFormat) =>
    update({
      formats: v.formats.includes(f)
        ? v.formats.filter((x) => x !== f)
        : [...v.formats, f],
    })

  return (
    <>
      <Field
        label={t('specialistForm.firstName')}
        value={v.firstName}
        error={errors.firstName}
        onChange={(x) => update({ firstName: x })}
      />
      <Field
        label={t('specialistForm.lastName')}
        value={v.lastName}
        error={errors.lastName}
        onChange={(x) => update({ lastName: x })}
      />
      <Field
        label={t('specialistForm.specializationRu')}
        value={v.specializationRu}
        error={errors.specializationRu}
        onChange={(x) => update({ specializationRu: x })}
      />
      <Field
        label={t('specialistForm.specializationKk')}
        value={v.specializationKk}
        error={errors.specializationKk}
        onChange={(x) => update({ specializationKk: x })}
      />
      <Field
        label={t('specialistForm.experience')}
        value={v.experienceYears}
        inputMode="numeric"
        error={errors.experienceYears}
        onChange={(x) => update({ experienceYears: x })}
      />
      <Field
        label={t('specialistForm.price')}
        value={v.price}
        inputMode="numeric"
        error={errors.price}
        onChange={(x) => update({ price: x })}
      />
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={v.priceFrom}
          onChange={(e) => update({ priceFrom: e.target.checked })}
        />
        <span>{t('specialistForm.priceFrom')}</span>
      </label>
      <fieldset
        className={styles.fieldset}
        aria-invalid={errors.formats ? true : undefined}
      >
        <legend>{t('formats.label')}</legend>
        {WORK_FORMATS.map((f) => (
          <label key={f} className={styles.check}>
            <input
              type="checkbox"
              checked={v.formats.includes(f)}
              onChange={() => toggleFormat(f)}
            />
            <span>{t(`formats.${f}`)}</span>
          </label>
        ))}
        {errors.formats && (
          <span role="alert" className={styles.error}>
            {t(`specialistForm.errors.${errors.formats}`)}
          </span>
        )}
      </fieldset>
    </>
  )
}

export function LocationStep({ values: v, errors, update }: StepProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const optional = !needsLocation(v)
  return (
    <>
      {optional && <p className={styles.muted}>{t('specialistForm.locationOptional')}</p>}
      <div className={styles.field}>
        <label htmlFor="sf-city">
          {t('specialists.city')}
          {optional && (
            <span className={styles.muted}> ({t('specialistForm.optional')})</span>
          )}
        </label>
        <select
          id="sf-city"
          value={v.city}
          aria-invalid={errors.city ? true : undefined}
          onChange={(e) =>
            update({ city: (e.target.value || '') as SpecialistFormValues['city'] })
          }
        >
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name[lang]}
            </option>
          ))}
        </select>
        {errors.city && (
          <span role="alert" className={styles.error}>
            {t(`specialistForm.errors.${errors.city}`)}
          </span>
        )}
      </div>
      <Field
        label={t('specialistForm.addressRu')}
        value={v.addressRu}
        optional={optional}
        error={errors.addressRu}
        onChange={(x) => update({ addressRu: x })}
      />
      <Field
        label={t('specialistForm.addressKk')}
        value={v.addressKk}
        optional={optional}
        error={errors.addressKk}
        onChange={(x) => update({ addressKk: x })}
      />
    </>
  )
}

export function AboutStep({ values: v, errors, update }: StepProps) {
  const { t } = useTranslation()
  return (
    <>
      <Field
        multiline
        label={t('specialistForm.bioRu')}
        value={v.bioRu}
        error={errors.bioRu}
        onChange={(x) => update({ bioRu: x })}
      />
      <Field
        multiline
        label={t('specialistForm.bioKk')}
        value={v.bioKk}
        error={errors.bioKk}
        onChange={(x) => update({ bioKk: x })}
      />
      <Field
        label={t('specialistForm.youtubeUrl')}
        value={v.youtubeUrl}
        optional
        inputMode="url"
        hint={t('specialistForm.youtubeHint')}
        error={errors.youtubeUrl}
        onChange={(x) => update({ youtubeUrl: x })}
      />
    </>
  )
}

export function EducationStep({ values: v, errors, update }: StepProps) {
  const { t } = useTranslation()
  return (
    <>
      <p className={styles.muted}>{t('specialistForm.listOptional')}</p>
      {v.education.map((item, i) => {
        const set = (patch: Partial<typeof item>) =>
          update({ education: patchItem(v.education, item.id, patch) })
        const key = (f: string) => errors[`education.${i}.${f}`]
        return (
          <fieldset key={item.id} className={styles.fieldset}>
            <legend>{t('specialistForm.educationItem', { n: i + 1 })}</legend>
            <Field
              label={t('specialistForm.institutionRu')}
              value={item.institutionRu}
              error={key('institutionRu')}
              onChange={(x) => set({ institutionRu: x })}
            />
            <Field
              label={t('specialistForm.institutionKk')}
              value={item.institutionKk}
              error={key('institutionKk')}
              onChange={(x) => set({ institutionKk: x })}
            />
            <Field
              label={t('specialistForm.programRu')}
              value={item.programRu}
              error={key('programRu')}
              onChange={(x) => set({ programRu: x })}
            />
            <Field
              label={t('specialistForm.programKk')}
              value={item.programKk}
              error={key('programKk')}
              onChange={(x) => set({ programKk: x })}
            />
            <Field
              label={t('specialistForm.year')}
              value={item.year}
              inputMode="numeric"
              error={key('year')}
              onChange={(x) => set({ year: x })}
            />
            <button
              type="button"
              className={styles.danger}
              onClick={() =>
                update({ education: v.education.filter((e) => e.id !== item.id) })
              }
            >
              {t('specialistForm.remove')}
            </button>
          </fieldset>
        )
      })}
      <button
        type="button"
        className={styles.secondary}
        onClick={() =>
          update({
            education: [
              ...v.education,
              {
                id: newId(),
                institutionRu: '',
                institutionKk: '',
                programRu: '',
                programKk: '',
                year: '',
              },
            ],
          })
        }
      >
        {t('specialistForm.add')}
      </button>
    </>
  )
}

export function CasesStep({ values: v, errors, update }: StepProps) {
  const { t } = useTranslation()
  return (
    <>
      <p className={styles.muted}>{t('specialistForm.listOptional')}</p>
      {v.cases.map((item, i) => {
        const set = (patch: Partial<typeof item>) =>
          update({ cases: patchItem(v.cases, item.id, patch) })
        const key = (f: string) => errors[`cases.${i}.${f}`]
        return (
          <fieldset key={item.id} className={styles.fieldset}>
            <legend>{t('specialistForm.caseItem', { n: i + 1 })}</legend>
            <Field
              label={t('specialistForm.titleRu')}
              value={item.titleRu}
              error={key('titleRu')}
              onChange={(x) => set({ titleRu: x })}
            />
            <Field
              label={t('specialistForm.titleKk')}
              value={item.titleKk}
              error={key('titleKk')}
              onChange={(x) => set({ titleKk: x })}
            />
            <Field
              multiline
              label={t('specialistForm.descriptionRu')}
              value={item.descriptionRu}
              error={key('descriptionRu')}
              onChange={(x) => set({ descriptionRu: x })}
            />
            <Field
              multiline
              label={t('specialistForm.descriptionKk')}
              value={item.descriptionKk}
              error={key('descriptionKk')}
              onChange={(x) => set({ descriptionKk: x })}
            />
            <Field
              multiline
              label={t('specialistForm.beforeRu')}
              value={item.beforeRu}
              error={key('beforeRu')}
              onChange={(x) => set({ beforeRu: x })}
            />
            <Field
              multiline
              label={t('specialistForm.beforeKk')}
              value={item.beforeKk}
              error={key('beforeKk')}
              onChange={(x) => set({ beforeKk: x })}
            />
            <Field
              multiline
              label={t('specialistForm.afterRu')}
              value={item.afterRu}
              error={key('afterRu')}
              onChange={(x) => set({ afterRu: x })}
            />
            <Field
              multiline
              label={t('specialistForm.afterKk')}
              value={item.afterKk}
              error={key('afterKk')}
              onChange={(x) => set({ afterKk: x })}
            />
            <Field
              optional
              inputMode="url"
              label={t('specialistForm.beforeImage')}
              value={item.beforeImage}
              error={key('beforeImage')}
              onChange={(x) => set({ beforeImage: x })}
            />
            <Field
              optional
              inputMode="url"
              label={t('specialistForm.afterImage')}
              value={item.afterImage}
              error={key('afterImage')}
              onChange={(x) => set({ afterImage: x })}
            />
            <button
              type="button"
              className={styles.danger}
              onClick={() => update({ cases: v.cases.filter((c) => c.id !== item.id) })}
            >
              {t('specialistForm.remove')}
            </button>
          </fieldset>
        )
      })}
      <button
        type="button"
        className={styles.secondary}
        onClick={() =>
          update({
            cases: [
              ...v.cases,
              {
                id: newId(),
                titleRu: '',
                titleKk: '',
                descriptionRu: '',
                descriptionKk: '',
                beforeRu: '',
                beforeKk: '',
                afterRu: '',
                afterKk: '',
                beforeImage: '',
                afterImage: '',
              },
            ],
          })
        }
      >
        {t('specialistForm.add')}
      </button>
    </>
  )
}

export function SocialsStep({ values: v, errors, update }: StepProps) {
  const { t } = useTranslation()
  return (
    <>
      <p className={styles.muted}>{t('specialistForm.listOptional')}</p>
      {v.socials.map((item, i) => {
        const set = (patch: Partial<typeof item>) =>
          update({ socials: patchItem(v.socials, item.id, patch) })
        return (
          <fieldset key={item.id} className={styles.fieldset}>
            <legend>{t('specialistForm.socialItem', { n: i + 1 })}</legend>
            <div className={styles.field}>
              <label htmlFor={`sf-social-${item.id}`}>
                {t('specialistForm.socialType')}
              </label>
              <select
                id={`sf-social-${item.id}`}
                value={item.type}
                onChange={(e) => set({ type: e.target.value as SocialType })}
              >
                {SOCIAL_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {t(`profile.social.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label={t('specialistForm.socialUrl')}
              value={item.url}
              inputMode="url"
              error={errors[`socials.${i}.url`]}
              onChange={(x) => set({ url: x })}
            />
            <button
              type="button"
              className={styles.danger}
              onClick={() =>
                update({ socials: v.socials.filter((s) => s.id !== item.id) })
              }
            >
              {t('specialistForm.remove')}
            </button>
          </fieldset>
        )
      })}
      <button
        type="button"
        className={styles.secondary}
        onClick={() =>
          update({ socials: [...v.socials, { id: newId(), type: 'instagram', url: '' }] })
        }
      >
        {t('specialistForm.add')}
      </button>
    </>
  )
}
