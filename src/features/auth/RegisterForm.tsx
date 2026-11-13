import { useId, useState, type FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthError } from '../../api'
import { Button, Checkbox, Input, Notice } from '../../components/ui'
import { safeNext } from './redirect'
import { useAuth } from './useAuth'
import { useFocusFirstError } from './useFocusFirstError'
import { validateRegister, type Errors, type RegisterValues } from './validation'
import { PasswordToggle } from './PasswordToggle'
import styles from './Auth.module.css'

export function RegisterForm() {
  const { t } = useTranslation()
  const { user, register } = useAuth()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const passwordId = useId()
  const { formRef, requestFocus } = useFocusFirstError()

  const [values, setValues] = useState<RegisterValues>({
    name: '',
    email: '',
    password: '',
    terms: false,
    consent: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors<keyof RegisterValues>>({})
  const [emailTaken, setEmailTaken] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={next} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setEmailTaken(false)
    const found = validateRegister(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestFocus()
      return
    }
    setSubmitting(true)
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
    } catch (error) {
      setSubmitting(false)
      if (error instanceof AuthError && error.code === 'emailTaken') {
        setEmailTaken(true)
        requestFocus()
      } else throw error
    }
  }

  const message = (key?: string) => (key ? t(`auth.errors.${key}`) : undefined)

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>{t('auth.register.title')}</h2>
      <p className={styles.formLead}>{t('auth.register.lead')}</p>
      <Input
        label={t('auth.register.name')}
        required
        name="name"
        autoComplete="name"
        placeholder={t('auth.register.namePlaceholder')}
        value={values.name}
        error={message(errors.name)}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
      />
      <Input
        label={t('auth.email')}
        required
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t('auth.emailPlaceholder')}
        value={values.email}
        error={emailTaken ? t('auth.errors.emailTaken') : message(errors.email)}
        onChange={(e) => {
          setEmailTaken(false)
          setValues({ ...values, email: e.target.value })
        }}
      />
      <Input
        id={passwordId}
        label={t('auth.password')}
        required
        type={showPassword ? 'text' : 'password'}
        name="password"
        autoComplete="new-password"
        placeholder={t('auth.register.passwordPlaceholder')}
        hint={t('auth.register.passwordHint')}
        value={values.password}
        error={message(errors.password)}
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />
      <PasswordToggle
        shown={showPassword}
        controls={passwordId}
        onToggle={() => setShowPassword((v) => !v)}
      />
      <Checkbox
        label={t('auth.register.terms')}
        checked={values.terms}
        error={message(errors.terms)}
        onChange={(e) => setValues({ ...values, terms: e.target.checked })}
      />
      <Checkbox
        label={t('auth.register.consent')}
        checked={values.consent}
        error={message(errors.consent)}
        onChange={(e) => setValues({ ...values, consent: e.target.checked })}
      />
      <Button type="submit" size="lg" fullWidth loading={submitting}>
        {t('auth.register.submit')}
      </Button>
      <Button to="/login" variant="link" className={styles.inline}>
        {t('auth.register.switch')}
      </Button>
      <Notice title={t('auth.register.noticeTitle')}>
        {t('auth.register.noticeText')}
      </Notice>
      <p className={styles.note}>{t('auth.register.requiredNote')}</p>
    </form>
  )
}
