import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import { useRouteProgress, useRouteSteps, useToggleRouteStep } from './hooks'
import styles from './Support.module.css'

export function RouteStepper() {
  const { t } = useTranslation()
  const lang = useLang()
  const steps = useRouteSteps()
  const progress = useRouteProgress()
  const toggle = useToggleRouteStep()
  const [openIds, setOpenIds] = useState<string[]>([])

  if (steps.isPending || progress.isPending)
    return <p role="status">{t('common.loading')}</p>
  if (steps.isError || progress.isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            void steps.refetch()
            void progress.refetch()
          }}
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }

  const done = progress.data
  const total = steps.data.length
  const doneCount = steps.data.filter((s) => done.includes(s.id)).length
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  return (
    <div className={styles.list}>
      <p className={styles.demo} role="note">
        {t('support.demoNotice')}
      </p>

      <div>
        <p id="route-progress-label" className={styles.progressLabel}>
          {t('support.route.progress', { done: doneCount, total })} · {percent}%
        </p>
        <div
          className={styles.progress}
          role="progressbar"
          aria-labelledby="route-progress-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ol className={styles.timeline}>
        {steps.data.map((step, index) => {
          const isDone = done.includes(step.id)
          const open = openIds.includes(step.id)
          const panelId = `route-step-${step.id}`
          return (
            <li
              key={step.id}
              className={`${styles.step} ${isDone ? styles.stepDone : ''}`}
            >
              <div className={styles.stepHead}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {isDone ? '✓' : index + 1}
                </span>
                <h2 className={styles.stepTitle}>
                  <button
                    type="button"
                    className={styles.accordionButton}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIds((ids) =>
                        ids.includes(step.id)
                          ? ids.filter((i) => i !== step.id)
                          : [...ids, step.id],
                      )
                    }
                  >
                    <span>
                      <span className="visually-hidden">{index + 1}. </span>
                      {step.title[lang]}
                    </span>
                    <span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                </h2>
              </div>
              <p className={styles.muted}>{step.summary[lang]}</p>
              {isDone && <p className={styles.doneLabel}>{t('support.route.done')}</p>}

              {open && (
                <div id={panelId} className={styles.panel}>
                  <h3>{t('support.route.actions')}</h3>
                  <ul>
                    {step.actions.map((a, i) => (
                      <li key={i}>{a[lang]}</li>
                    ))}
                  </ul>
                  {step.documents.length > 0 && (
                    <>
                      <h3>{t('support.route.documents')}</h3>
                      <ul>
                        {step.documents.map((d, i) => (
                          <li key={i}>{d[lang]}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {step.links.length > 0 && (
                    <>
                      <h3>{t('support.route.related')}</h3>
                      <ul className={styles.links}>
                        {step.links.map((l) => (
                          <li key={l.to}>
                            <Link to={l.to}>{l.label[lang]}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={isDone}
                  disabled={toggle.isPending}
                  onChange={() => toggle.mutate(step.id)}
                />
                <span>{t('support.route.markDone')}</span>
              </label>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
