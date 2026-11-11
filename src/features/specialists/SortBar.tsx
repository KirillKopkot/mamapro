import { useTranslation } from 'react-i18next'
import { SORT_KEYS } from './filtering'
import type { SortDir, SortKey, SortState } from './filtering'
import styles from './SortBar.module.css'

interface SortBarProps {
  sort: SortState
  onChange: (sort: SortState) => void
}

export function SortBar({ sort, onChange }: SortBarProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.root}>
      <select
        className={styles.select}
        aria-label={t('specialists.sort.label')}
        value={sort.key}
        onChange={(e) => onChange({ ...sort, key: e.target.value as SortKey })}
      >
        {SORT_KEYS.map((k) => (
          <option key={k} value={k}>
            {t(`specialists.sort.${k}`)}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        aria-label={t('specialists.sort.direction')}
        value={sort.dir}
        onChange={(e) => onChange({ ...sort, dir: e.target.value as SortDir })}
      >
        <option value="asc">{t('specialists.sort.asc')}</option>
        <option value="desc">{t('specialists.sort.desc')}</option>
      </select>
    </div>
  )
}
