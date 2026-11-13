import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Eyebrow,
  Input,
  Notice,
  SectionTitle,
  Select,
  Tag,
  Textarea,
} from '../components/ui'
import styles from './UiKitPage.module.css'

const PALETTE = [
  ['primary', 'var(--color-primary)'],
  ['primary-hover', 'var(--color-primary-hover)'],
  ['pink', 'var(--color-pink)'],
  ['green', 'var(--color-green)'],
  ['green-text', 'var(--color-green-text)'],
  ['surface', 'var(--color-surface)'],
  ['lavender', 'var(--color-lavender)'],
  ['text', 'var(--color-text)'],
  ['text-secondary', 'var(--color-text-secondary)'],
  ['border', 'var(--color-border)'],
] as const

const SLOTS = ['10:00', '11:30', '14:00', '16:30'] as const

/** Dev-страница `/_ui`: примеры всех компонентов UI-кита. Доступна только в dev-режиме. */
export default function UiKitPage() {
  const { t } = useTranslation()
  const [slot, setSlot] = useState<string>(SLOTS[0])
  const [agreed, setAgreed] = useState(false)

  return (
    <div className={styles.page}>
      <Breadcrumbs
        label={t('breadcrumbs.label')}
        items={[{ label: t('nav.home'), to: '/' }, { label: t('devUi.title') }]}
      />
      <SectionTitle as="h1" description={t('devUi.description')}>
        {t('devUi.title')}
      </SectionTitle>

      <section className={styles.section} aria-labelledby="ui-colors">
        <h2 id="ui-colors">{t('devUi.colors')}</h2>
        <div className={`${styles.grid} ${styles.palette}`}>
          {PALETTE.map(([name, value]) => (
            <div key={name} className={styles.swatch} style={{ background: value }}>
              <span
                style={{
                  color:
                    name === 'primary' || name === 'primary-hover' || name === 'text'
                      ? 'var(--color-white)'
                      : 'var(--color-text)',
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ui-typo">
        <h2 id="ui-typo">{t('devUi.typography')}</h2>
        <div className={styles.hero}>
          <Eyebrow>{t('devUi.eyebrow')}</Eyebrow>
          <p
            className={styles.heroTitle}
            style={{ fontWeight: 'var(--font-weight-bold)' }}
          >
            {t('devUi.heroTitle')}
          </p>
          <p>{t('devUi.kazakhLetters')}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ui-buttons">
        <h2 id="ui-buttons">{t('devUi.buttons')}</h2>
        <div className={styles.row}>
          <Button>{t('devUi.primary')}</Button>
          <Button variant="secondary">{t('devUi.secondary')}</Button>
          <Button variant="link">{t('devUi.link')}</Button>
        </div>
        <div className={styles.row}>
          <Button size="lg">{t('devUi.primary')}</Button>
          <Button size="lg" variant="secondary">
            {t('devUi.secondary')}
          </Button>
        </div>
        <div className={styles.row}>
          <Button disabled>{t('devUi.disabled')}</Button>
          <Button variant="secondary" disabled>
            {t('devUi.disabled')}
          </Button>
          <Button loading>{t('devUi.loading')}</Button>
          <Button to="/" variant="secondary">
            {t('devUi.asLink')}
          </Button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ui-fields">
        <h2 id="ui-fields">{t('devUi.fields')}</h2>
        <div className={styles.form}>
          <Input
            label={t('devUi.email')}
            hint={t('devUi.hint')}
            placeholder="name@example.ru"
            type="email"
            required
          />
          <Input
            label={t('devUi.email')}
            error={t('devUi.errorText')}
            defaultValue="name@"
            required
          />
          <Input label={t('devUi.disabled')} disabled defaultValue="…" />
          <Select label={t('devUi.city')} defaultValue="astana">
            <option value="astana">{t('devUi.astana')}</option>
            <option value="almaty">{t('devUi.almaty')}</option>
          </Select>
          <Textarea label={t('devUi.about')} hint={t('devUi.hint')} />
          <Checkbox
            label={t('devUi.consent')}
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ui-cards">
        <h2 id="ui-cards">{t('devUi.cards')}</h2>
        <div className={styles.grid}>
          <Card>
            <h3>{t('devUi.cardDefault')}</h3>
          </Card>
          <Card variant="white">
            <h3>{t('devUi.cardWhite')}</h3>
          </Card>
          <Card variant="pink">
            <h3>{t('devUi.cardPink')}</h3>
          </Card>
          <Card variant="green">
            <h3>{t('devUi.cardGreen')}</h3>
          </Card>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ui-chips">
        <h2 id="ui-chips">{t('devUi.tagsChips')}</h2>
        <div className={styles.row}>
          <Tag>{t('formats.online')}</Tag>
          <Tag>{t('formats.clinic')}</Tag>
        </div>
        <div className={styles.row} role="group" aria-label={t('devUi.time')}>
          {SLOTS.map((value) => (
            <Chip key={value} selected={slot === value} onClick={() => setSlot(value)}>
              {value}
            </Chip>
          ))}
          <Chip disabled>18:00</Chip>
        </div>
        <p>{t('devUi.timezone')}</p>
        <p>{t('price.from', { price: '7 000' })}</p>
      </section>

      <section className={styles.section} aria-labelledby="ui-notices">
        <h2 id="ui-notices">{t('devUi.notices')}</h2>
        <Notice title={t('devUi.noticeGreenTitle')}>{t('devUi.noticeText')}</Notice>
        <Notice variant="pink" title={t('devUi.noticePinkTitle')}>
          {t('devUi.noticeText')}
        </Notice>
      </section>
    </div>
  )
}
