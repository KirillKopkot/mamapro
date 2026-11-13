import type { HTMLAttributes } from 'react'
import styles from './Tag.module.css'

/** Маленький зелёный чип (формат приёма и т. п.). */
export function Tag({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={[styles.tag, className].filter(Boolean).join(' ')} />
}
