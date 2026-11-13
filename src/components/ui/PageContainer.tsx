import type { HTMLAttributes } from 'react'
import styles from './PageContainer.module.css'

interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'main' | 'section' | 'header' | 'footer'
}

/** Контейнер: max-width 1200px, боковые отступы 16px (32px от 768px). */
export function PageContainer({
  as: Component = 'div',
  className,
  ...rest
}: PageContainerProps) {
  return (
    <Component
      {...rest}
      className={[styles.container, className].filter(Boolean).join(' ')}
    />
  )
}
