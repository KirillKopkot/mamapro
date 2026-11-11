import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pickSections } from '../../api'
import { useLang } from '../../i18n/useLang'
import type { Child, ChildSection, Specialist } from '../../types'
import {
  useAccessGrants,
  useRevokeAccessGrant,
  useSaveAccessGrant,
} from '../access/hooks'
import { useFavorites } from '../favorites/hooks'
import { useSpecialists } from '../specialists/hooks'
import { AccessPreview } from './AccessPreview'
import { GrantPreview } from './GrantPreview'
import { CHILD_SECTIONS } from './sections'
import styles from './Child.module.css'

const MAX_RESULTS = 8

function fullName(s: Specialist) {
  return `${s.firstName} ${s.lastName}`
}

export function AccessManager({ child }: { child: Child }) {
  const { t } = useTranslation()
  const lang = useLang()
  const grants = useAccessGrants(child.id)
  const specialists = useSpecialists()
  const favorites = useFavorites()
  const saveGrant = useSaveAccessGrant()
  const revoke = useRevokeAccessGrant()

  const [query, setQuery] = useState('')
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [sections, setSections] = useState<ChildSection[]>([])
  const [previewId, setPreviewId] = useState<string | null>(null)

  const all = specialists.data ?? []
  const byId = new Map(all.map((s) => [s.id, s]))
  const picked = pickedId ? (byId.get(pickedId) ?? null) : null
  const q = query.trim().toLocaleLowerCase()
  const candidates =
    q === ''
      ? all.filter((s) => favorites.data?.includes(s.id))
      : all
          .filter((s) =>
            [s.firstName, s.lastName, s.specialization.ru, s.specialization.kk].some(
              (v) => v.toLocaleLowerCase().includes(q),
            ),
          )
          .slice(0, MAX_RESULTS)

  function pick(s: Specialist) {
    setPickedId(s.id)
    const existing = grants.data?.find((g) => g.specialistId === s.id)
    setSections(existing ? existing.sections : [])
  }

  function toggleSection(section: ChildSection) {
    setSections((cur) =>
      cur.includes(section) ? cur.filter((s) => s !== section) : [...cur, section],
    )
  }

  async function handleGrant() {
    if (!picked || sections.length === 0) return
    await saveGrant.mutateAsync({ childId: child.id, specialistId: picked.id, sections })
    setPickedId(null)
    setSections([])
    setQuery('')
  }

  const alreadyGranted = picked
    ? grants.data?.some((g) => g.specialistId === picked.id)
    : false

  return (
    <section className={styles.card} aria-labelledby="access-title">
      <h2 id="access-title">{t('child.access.title')}</h2>
      <p className={styles.privacy}>{t('child.access.explain')}</p>

      <h3>{t('child.access.grantedTitle')}</h3>
      {grants.isPending && <p role="status">{t('common.loading')}</p>}
      {grants.isError && <p role="alert">{t('common.error')}</p>}
      {grants.data && grants.data.length === 0 && <p>{t('child.access.none')}</p>}
      {grants.data && grants.data.length > 0 && (
        <ul className={styles.grantList}>
          {grants.data.map((g) => {
            const s = byId.get(g.specialistId)
            const previewOpen = previewId === g.specialistId
            return (
              <li key={g.specialistId} className={styles.grant}>
                <div>
                  <strong>{s ? fullName(s) : t('child.access.unknownSpecialist')}</strong>
                  {s && <span className={styles.muted}> · {s.specialization[lang]}</span>}
                  <p className={styles.muted}>
                    {g.sections.map((sec) => t(`child.sections.${sec}`)).join(', ')}
                  </p>
                </div>
                <div className={styles.grantActions}>
                  <button
                    type="button"
                    className={styles.secondary}
                    aria-expanded={previewOpen}
                    onClick={() => setPreviewId(previewOpen ? null : g.specialistId)}
                  >
                    {t('child.access.previewButton')}
                  </button>
                  <button
                    type="button"
                    className={styles.danger}
                    disabled={revoke.isPending}
                    onClick={() =>
                      revoke.mutate({ childId: child.id, specialistId: g.specialistId })
                    }
                  >
                    {t('child.access.revoke')}
                  </button>
                </div>
                {previewOpen && (
                  <GrantPreview childId={child.id} specialistId={g.specialistId} />
                )}
              </li>
            )
          })}
        </ul>
      )}

      <h3>{t('child.access.addTitle')}</h3>
      <label className={styles.field}>
        <span>{t('child.access.searchLabel')}</span>
        <input
          type="search"
          value={query}
          placeholder={t('child.access.searchPlaceholder')}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className={styles.muted}>
        {t(q === '' ? 'child.access.fromFavorites' : 'child.access.searchResults')}
      </p>
      {specialists.isPending || favorites.isPending ? (
        <p role="status">{t('common.loading')}</p>
      ) : candidates.length === 0 ? (
        <p>{t(q === '' ? 'child.access.noFavorites' : 'child.access.noResults')}</p>
      ) : (
        <ul className={styles.candidates}>
          {candidates.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={styles.candidate}
                aria-pressed={pickedId === s.id}
                onClick={() => pick(s)}
              >
                {fullName(s)} · {s.specialization[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}

      {picked && (
        <div className={styles.grantForm}>
          <fieldset className={styles.fieldset}>
            <legend>{t('child.access.sectionsFor', { name: fullName(picked) })}</legend>
            {CHILD_SECTIONS.map((sec) => (
              <label key={sec} className={styles.check}>
                <input
                  type="checkbox"
                  checked={sections.includes(sec)}
                  onChange={() => toggleSection(sec)}
                />
                <span>{t(`child.sections.${sec}`)}</span>
              </label>
            ))}
          </fieldset>

          <h4>{t('child.access.preview.title', { name: fullName(picked) })}</h4>
          <AccessPreview view={pickSections(child, sections)} />

          {sections.length === 0 && (
            <p className={styles.muted}>{t('child.access.pickSections')}</p>
          )}
          <button
            type="button"
            className={styles.primary}
            disabled={sections.length === 0 || saveGrant.isPending}
            onClick={() => void handleGrant()}
          >
            {t(alreadyGranted ? 'child.access.update' : 'child.access.grant')}
          </button>
          {saveGrant.isError && (
            <p role="alert" className={styles.error}>
              {t('common.error')}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
