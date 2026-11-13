import type { ReactNode } from 'react'
import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  children: ReactNode
  description?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
}

/** Заголовок раздела (H2 по умолчанию) с необязательным пояснением. */
export function SectionTitle({
  children,
  description,
  as: Heading = 'h2',
}: SectionTitleProps) {
  return (
    <div className={styles.root}>
      <Heading className={styles.title}>{children}</Heading>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
