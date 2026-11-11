import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunitiesTab } from '../features/community/CommunitiesTab'
import { CommunityRules } from '../features/community/CommunityRules'
import { ConsultantsTab } from '../features/community/ConsultantsTab'
import { SafetyNotice } from '../features/community/SafetyNotice'
import styles from '../features/community/Community.module.css'

type Tab = 'consultants' | 'groups'

export default function CommunityPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const tab: Tab = params.get('tab') === 'groups' ? 'groups' : 'consultants'

  return (
    <div className={styles.stack}>
      <h1>{t('pages.community')}</h1>
      <SafetyNotice />

      <nav className={styles.tabs} aria-label={t('community.tabsLabel')}>
        <Link
          to="/community"
          replace
          className={styles.tab}
          aria-current={tab === 'consultants' ? 'page' : undefined}
        >
          {t('community.tabs.consultants')}
        </Link>
        <Link
          to="/community?tab=groups"
          replace
          className={styles.tab}
          aria-current={tab === 'groups' ? 'page' : undefined}
        >
          {t('community.tabs.groups')}
        </Link>
      </nav>

      {tab === 'consultants' ? <ConsultantsTab /> : <CommunitiesTab />}
      <CommunityRules />
    </div>
  )
}
