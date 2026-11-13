import type { HTMLAttributes } from 'react'
import styles from './Eyebrow.module.css'

/** Красная заглавная надпись над заголовком. */
export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...rest} className={[styles.eyebrow, className].filter(Boolean).join(' ')} />
}
