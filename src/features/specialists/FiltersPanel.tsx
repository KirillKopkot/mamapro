import { useTranslation } from 'react-i18next'
import { cities } from '../../config/cities'
import { useLang } from '../../i18n/useLang'
import type { City, Specialist, WorkFormat } from '../../types'
import { WORK_FORMATS, getSpecializations } from './filtering'
import type { SpecialistFilters } from './filtering'
import styles from './FiltersPanel.module.css'

interface FiltersPanelProps {
  specialists: Specialist[]
  filters: SpecialistFilters
  open: boolean
  onChange: (patch: Partial<SpecialistFilters>) => void
  onReset: () => void
  onClose: () => void
}

const RATING_OPTIONS = [3, 4, 4.5]

function toNumberOrNull(value: string): number | null {
  if (value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/** Служебное значение select, когда выбрано несколько специализаций (например, из главной). */
const MULTI_VALUE = '__multiple__'

export function FiltersPanel({
  specialists,
  filters,
  open,
  onChange,
  onReset,
  onClose,
}: FiltersPanelProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const specializations = getSpecializations(specialists, lang)

  function toggleFormat(format: WorkFormat) {
    const next = filters.formats.includes(format)
      ? filters.formats.filter((f) => f !== format)
      : [...filters.formats, format]
    onChange({ formats: next })
  }

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}
      <section
        className={`${styles.panel} ${open ? styles.open : ''}`}
        aria-label={t('specialists.filtersTitle')}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{t('specialists.filtersTitle')}</h2>
          <button type="button" className={styles.link} onClick={onReset}>
            {t('specialists.reset')}
          </button>
        </div>

        <label className={styles.field}>
          <span>{t('specialists.city')}</span>
          <select
            value={filters.city ?? ''}
            onChange={(e) => onChange({ city: (e.target.value || null) as City | null })}
          >
            <option value="">{t('common.all')}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[lang]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{t('specialists.specialization')}</span>
          <select
            value={
              filters.specializations.length > 1
                ? MULTI_VALUE
                : (filters.specializations[0] ?? '')
            }
            onChange={(e) =>
              onChange({ specializations: e.target.value ? [e.target.value] : [] })
            }
          >
            <option value="">{t('common.all')}</option>
            {filters.specializations.length > 1 && (
              <option value={MULTI_VALUE} disabled>
                {t('specialists.multipleSpecs', {
                  count: filters.specializations.length,
                })}
              </option>
            )}
            {specializations.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className={styles.fieldset}>
          <legend>{t('formats.label')}</legend>
          {WORK_FORMATS.map((f) => (
            <label key={f} className={styles.check}>
              <input
                type="checkbox"
                checked={filters.formats.includes(f)}
                onChange={() => toggleFormat(f)}
              />
              <span>{t(`formats.${f}`)}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>{t('specialists.priceRange')}</legend>
          <div className={styles.range}>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              aria-label={t('specialists.priceMin')}
              placeholder={t('specialists.priceMin')}
              value={filters.priceMin ?? ''}
              onChange={(e) => onChange({ priceMin: toNumberOrNull(e.target.value) })}
            />
            <input
              type="number"
              min={0}
              inputMode="numeric"
              aria-label={t('specialists.priceMax')}
              placeholder={t('specialists.priceMax')}
              value={filters.priceMax ?? ''}
              onChange={(e) => onChange({ priceMax: toNumberOrNull(e.target.value) })}
            />
          </div>
        </fieldset>

        <label className={styles.field}>
          <span>{t('specialists.minExperience')}</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={filters.minExperience ?? ''}
            onChange={(e) => onChange({ minExperience: toNumberOrNull(e.target.value) })}
          />
        </label>

        <label className={styles.field}>
          <span>{t('specialists.minRating')}</span>
          <select
            value={filters.minRating ?? ''}
            onChange={(e) => onChange({ minRating: toNumberOrNull(e.target.value) })}
          >
            <option value="">{t('common.any')}</option>
            {RATING_OPTIONS.map((r) => (
              <option key={r} value={r}>
                ★ {r}+
              </option>
            ))}
          </select>
        </label>

        <button type="button" className={styles.apply} onClick={onClose}>
          {t('specialists.showResults')}
        </button>
      </section>
    </>
  )
}
