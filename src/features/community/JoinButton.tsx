import { useTranslation } from 'react-i18next'
import { useMemberships, useToggleMembership } from './hooks'
import styles from './Community.module.css'

export function JoinButton({ communityId }: { communityId: string }) {
  const { t } = useTranslation()
  const memberships = useMemberships()
  const toggle = useToggleMembership()
  const joined = memberships.data?.includes(communityId) ?? false

  return (
    <button
      type="button"
      className={joined ? styles.button : styles.primary}
      aria-pressed={joined}
      disabled={memberships.isPending || toggle.isPending}
      onClick={() => toggle.mutate(communityId)}
    >
      {t(joined ? 'community.leave' : 'community.join')}
    </button>
  )
}
