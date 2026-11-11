import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cities } from '../../config/cities'
import { useLang } from '../../i18n/useLang'
import { DemoBanner } from './DemoBanner'
import { useConsultants } from './hooks'
import styles from './Community.module.css'

export function ConsultantsTab() {
  const { t } = useTranslation()
  const lang = useLang()
  const { data, isPending, isError, refetch } = useConsultants()

  if (isPending) return <p role="status">{t('common.loading')}</p>
  if (isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button type="button" className={styles.button} onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.stack}>
      <DemoBanner messageKey="community.demoProfiles" />
      <ul className={styles.grid}>
        {data.map((c) => (
          <li key={c.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{c.name}</h3>
            <p className={styles.muted}>
              {cities.find((x) => x.id === c.city)?.name[lang]} · {c.experience[lang]}
            </p>
            <p>{c.story[lang]}</p>
            <ul className={styles.chips}>
              {c.topics.map((topic, i) => (
                <li key={i} className={styles.chip}>
                  {topic[lang]}
                </li>
              ))}
            </ul>
            <Link to={`/community/chat/${c.id}`} className={styles.primary}>
              {t('community.write')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
