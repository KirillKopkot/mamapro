import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cities } from '../../config/cities'
import { useLang } from '../../i18n/useLang'
import type { Specialist } from '../../types'
import { ProfilePreview } from '../specialists/profile/ProfilePreview'
import { useModerateSpecialist } from './hooks'
import { RejectForm } from './RejectForm'
import styles from './Moderation.module.css'

export function SpecialistModerationCard({ specialist: s }: { specialist: Specialist }) {
  const { t } = useTranslation()
  const lang = useLang()
  const moderate = useModerateSpecialist()
  const [open, setOpen] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const city = cities.find((c) => c.id === s.city)

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>
        {s.firstName} {s.lastName}
      </h3>
      <p className={styles.muted}>
        {s.specialization[lang]}
        {city ? ` · ${city.name[lang]}` : ''}
      </p>

      <button
        type="button"
        className={styles.secondary}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {t(open ? 'moderation.hideDetails' : 'moderation.details')}
      </button>

      {open && (
        <div className={styles.details}>
          <section
            className={styles.bilingual}
            aria-label={t('moderation.bothLanguages')}
          >
            <h4>{t('moderation.bothLanguages')}</h4>
            {(['ru', 'kk'] as const).map((l) => (
              <dl key={l}>
                <dt>{t(`lang.${l}`)}</dt>
                <dd>
                  <strong>{s.specialization[l]}</strong>
                  {s.address ? <p>{s.address[l]}</p> : null}
                  <p>{s.bio[l]}</p>
                </dd>
              </dl>
            ))}
          </section>
          <ProfilePreview specialist={s} />
        </div>
      )}

      {rejecting ? (
        <RejectForm
          pending={moderate.isPending}
          onCancel={() => setRejecting(false)}
          onConfirm={(reason) =>
            moderate.mutate({ id: s.id, decision: { status: 'rejected', reason } })
          }
        />
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            disabled={moderate.isPending}
            onClick={() =>
              moderate.mutate({ id: s.id, decision: { status: 'approved' } })
            }
          >
            {t('moderation.approve')}
          </button>
          <button
            type="button"
            className={styles.danger}
            disabled={moderate.isPending}
            onClick={() => setRejecting(true)}
          >
            {t('moderation.reject')}
          </button>
        </div>
      )}
      {moderate.isError && (
        <p role="alert" className={styles.error}>
          {t('common.error')}
        </p>
      )}
    </article>
  )
}
