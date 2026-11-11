import { useId } from 'react'
import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  const id = useId()
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {children}
    </section>
  )
}
