import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../i18n/useLang'
import { JoinButton } from './JoinButton'
import { DemoBanner } from './DemoBanner'
import { useCommunities, useMemberships } from './hooks'
import styles from './Community.module.css'

export function CommunitiesTab() {
  const { t } = useTranslation()
  const lang = useLang()
  const { data, isPending, isError, refetch } = useCommunities()
  const memberships = useMemberships()

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
      <DemoBanner messageKey="community.demoGroups" />
      <ul className={styles.grid}>
        {data.map((c) => {
          const joined = memberships.data?.includes(c.id) ?? false
          return (
            <li key={c.id} className={styles.card}>
              <h3 className={styles.cardTitle}>
                <Link to={`/community/groups/${c.id}`}>{c.title[lang]}</Link>
              </h3>
              <p>{c.description[lang]}</p>
              <p className={styles.muted}>
                {t('community.members', { count: c.membersCount + (joined ? 1 : 0) })}
              </p>
              <JoinButton communityId={c.id} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
