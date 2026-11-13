import { useId, useState, type FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthError } from '../../api'
import { Button, Checkbox, Input, Notice } from '../../components/ui'
import { safeNext } from './redirect'
import { useAuth } from './useAuth'
import { useFocusFirstError } from './useFocusFirstError'
import { validateLogin, type Errors, type LoginValues } from './validation'
import { PasswordToggle } from './PasswordToggle'
import styles from './Auth.module.css'

export function LoginForm() {
  const { t } = useTranslation()
  const { user, login } = useAuth()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const passwordId = useId()
  const { formRef, requestFocus } = useFocusFirstError()

  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors<keyof LoginValues>>({})
  const [formError, setFormError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={next} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(false)
    const found = validateLogin(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestFocus()
      return
    }
    setSubmitting(true)
    try {
      await login({ ...values, remember })
    } catch (error) {
      setSubmitting(false)
      if (error instanceof AuthError) setFormError(true)
      else throw error
    }
  }

  const message = (key?: string) => (key ? t(`auth.errors.${key}`) : undefined)

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>{t('auth.login.title')}</h2>
      {formError && (
        <Notice variant="pink" role="alert" title={t('auth.errors.invalidCredentials')}>
          {t('auth.errors.invalidCredentialsHint')}
        </Notice>
      )}
      <Input
        label={t('auth.email')}
        required
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t('auth.emailPlaceholder')}
        value={values.email}
        error={message(errors.email)}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
      />
      <Input
        id={passwordId}
        label={t('auth.password')}
        required
        type={showPassword ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        placeholder={t('auth.login.passwordPlaceholder')}
        value={values.password}
        error={message(errors.password)}
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />
      <PasswordToggle
        shown={showPassword}
        controls={passwordId}
        onToggle={() => setShowPassword((v) => !v)}
      />
      <Button to="/forgot-password" variant="link" className={styles.inline}>
        {t('auth.forgot')}
      </Button>
      <Checkbox
        label={t('auth.remember')}
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
      />
      <Button type="submit" size="lg" fullWidth loading={submitting}>
        {t('auth.login.submit')}
      </Button>
      <Button to="/register" variant="link" className={styles.inline}>
        {t('auth.login.switch')}
      </Button>
      <Notice title={t('auth.login.noticeTitle')}>{t('auth.login.noticeText')}</Notice>
      <p className={styles.note}>{t('auth.requiredNote')}</p>
    </form>
  )
}
