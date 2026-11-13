import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'white' | 'pink' | 'green'
  as?: 'div' | 'section' | 'article' | 'li' | 'aside'
}

export function Card({
  variant = 'default',
  as: Component = 'div',
  className,
  ...rest
}: CardProps) {
  return (
    <Component
      {...rest}
      className={[styles.card, styles[variant], className].filter(Boolean).join(' ')}
    />
  )
}
