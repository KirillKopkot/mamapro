import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Notice.module.css'

interface NoticeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'green' | 'pink'
  title?: ReactNode
}

/** Информационный блок (зелёный или розовый). */
export function Notice({
  variant = 'green',
  title,
  children,
  className,
  ...rest
}: NoticeProps) {
  return (
    <div
      {...rest}
      className={[styles.notice, styles[variant], className].filter(Boolean).join(' ')}
    >
      {title && <p className={styles.title}>{title}</p>}
      <div>{children}</div>
    </div>
  )
}
