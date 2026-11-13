import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'link'
type Size = 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { to?: undefined }
type ButtonAsLink = CommonProps & Omit<LinkProps, 'children'> & { to: LinkProps['to'] }

export type ButtonProps = ButtonAsButton | ButtonAsLink

/** Кнопка. С пропом `to` рендерится как ссылка роутера с теми же стилями. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', loading = false, fullWidth = false } = props
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (props.to !== undefined) {
    const {
      variant: _v,
      size: _s,
      loading: _l,
      fullWidth: _f,
      children,
      className: extra,
      ...linkProps
    } = props
    void [_v, _s, _l, _f]
    return (
      <Link {...linkProps} className={[className, extra].filter(Boolean).join(' ')}>
        {children}
      </Link>
    )
  }

  const {
    variant: _v,
    size: _s,
    loading: _l,
    fullWidth: _f,
    children,
    className: extra,
    disabled,
    type = 'button',
    ...buttonProps
  } = props
  void [_v, _s, _l, _f]
  return (
    <button
      {...buttonProps}
      type={type}
      className={[className, extra].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  )
}
