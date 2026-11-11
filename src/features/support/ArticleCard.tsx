import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import type { SupportArticle } from '../../types'
import { useChecklistState, useToggleChecklistItem } from './hooks'
import styles from './Support.module.css'

export function ArticleCard({ article }: { article: SupportArticle }) {
  const { t } = useTranslation()
  const lang = useLang()
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const checklist = useChecklistState()
  const toggle = useToggleChecklistItem()
  const checked = checklist.data?.[article.id] ?? []

  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>
        <button
          type="button"
          className={styles.accordionButton}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{article.title[lang]}</span>
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
      </h2>
      <p className={styles.muted}>{article.summary[lang]}</p>

      {open && (
        <div id={panelId} className={styles.panel}>
          <p className={styles.demo} role="note">
            {t('support.demoNotice')}
          </p>

          <h3>{t('support.steps')}</h3>
          <ol className={styles.steps}>
            {article.steps.map((s, i) => (
              <li key={i}>{s[lang]}</li>
            ))}
          </ol>

          <h3>{t('support.documentsChecklist')}</h3>
          <p className={styles.muted}>
            {t('support.checkedCount', {
              done: checked.length,
              total: article.documents.length,
            })}
          </p>
          <ul className={styles.checklist}>
            {article.documents.map((d) => (
              <li key={d.id}>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={checked.includes(d.id)}
                    onChange={() =>
                      toggle.mutate({ articleId: article.id, itemId: d.id })
                    }
                  />
                  <span>{d.text[lang]}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
