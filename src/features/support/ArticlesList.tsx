import { useTranslation } from 'react-i18next'
import type { SupportCategory } from '../../types'
import { ArticleCard } from './ArticleCard'
import { useSupportArticles } from './hooks'
import styles from './Support.module.css'

export function ArticlesList({ category }: { category: SupportCategory }) {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = useSupportArticles(category)

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
  if (data.length === 0) return <p>{t('support.noArticles')}</p>
  return (
    <div className={styles.list}>
      {data.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  )
}
