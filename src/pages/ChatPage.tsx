import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChatView } from '../features/community/ChatView'
import { SafetyNotice } from '../features/community/SafetyNotice'
import { useConsultant } from '../features/community/hooks'
import styles from '../features/community/Community.module.css'
import NotFoundPage from './NotFoundPage'

export default function ChatPage() {
  const { t } = useTranslation()
  const { consultantId = '' } = useParams()
  const consultant = useConsultant(consultantId)

  if (consultant.isPending) return <p role="status">{t('common.loading')}</p>
  if (consultant.isError) {
    return (
      <div role="alert">
        <p>{t('common.error')}</p>
        <button
          type="button"
          className={styles.button}
          onClick={() => void consultant.refetch()}
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }
  if (!consultant.data) return <NotFoundPage />

  return (
    <div className={styles.stack}>
      <Link to="/community">← {t('pages.community')}</Link>
      <h1>{t('community.chat.title', { name: consultant.data.name })}</h1>
      <SafetyNotice />
      <ChatView consultant={consultant.data} />
    </div>
  )
}
