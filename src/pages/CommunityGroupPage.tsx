import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityRules } from '../features/community/CommunityRules'
import { DemoBanner } from '../features/community/DemoBanner'
import { JoinButton } from '../features/community/JoinButton'
import { SafetyNotice } from '../features/community/SafetyNotice'
import { useCommunity, useCommunityPosts } from '../features/community/hooks'
import { useLang } from '../i18n/useLang'
import styles from '../features/community/Community.module.css'
import NotFoundPage from './NotFoundPage'

export default function CommunityGroupPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const { groupId = '' } = useParams()
  const community = useCommunity(groupId)
  const posts = useCommunityPosts(groupId)

  if (community.isPending) return <p role="status">{t('common.loading')}</p>
  if (community.isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button
          type="button"
          className={styles.button}
          onClick={() => void community.refetch()}
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }
  if (!community.data) return <NotFoundPage />
  const c = community.data

  return (
    <div className={styles.stack}>
      <Link to="/community?tab=groups">← {t('community.tabs.groups')}</Link>
      <h1>{c.title[lang]}</h1>
      <p>{c.description[lang]}</p>
      <div>
        <JoinButton communityId={c.id} />
      </div>
      <SafetyNotice />
      <DemoBanner messageKey="community.demoFeed" />

      <section aria-labelledby="feed-title">
        <h2 id="feed-title">{t('community.feed')}</h2>
        {posts.isPending && <p role="status">{t('common.loading')}</p>}
        {posts.isError && <p role="alert">{t('common.error')}</p>}
        {posts.data && posts.data.length === 0 && <p>{t('community.feedEmpty')}</p>}
        {posts.data && posts.data.length > 0 && (
          <ul className={styles.feed}>
            {posts.data.map((p) => (
              <li key={p.id} className={styles.post}>
                <strong>{p.authorName}</strong>{' '}
                <time dateTime={p.date} className={styles.muted}>
                  {new Date(p.date).toLocaleDateString(lang)}
                </time>
                <p>{p.text[lang]}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <CommunityRules />
    </div>
  )
}
