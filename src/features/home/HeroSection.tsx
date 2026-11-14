import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Eyebrow } from '../../components/ui'
import type { FormatChoice } from './content'
import { buildSearchUrl } from './searchUrl'
import styles from './Home.module.css'

const FORMAT_CHOICES: readonly FormatChoice[] = ['any', 'online', 'offline']

export function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState<FormatChoice>('any')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    navigate(buildSearchUrl(query, format))
  }

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Eyebrow className={styles.onlyMobile}>{t('home.hero.eyebrow')}</Eyebrow>
      <h1 id="home-title" className={styles.heroTitle}>
        <span className={styles.heroLine}>{t('home.hero.titleLine1')}</span>
        <span className={styles.heroLine}>{t('home.hero.titleLine2')}</span>
      </h1>
      <p className={`${styles.heroLead} ${styles.onlyDesktop}`}>
        {t('home.hero.leadDesktop')}
      </p>
      <p className={`${styles.heroLead} ${styles.onlyMobile}`}>
        {t('home.hero.leadMobile')}
      </p>

      {/* мобильные: кнопка и ссылка на поддержку для мамы */}
      <div className={`${styles.heroCta} ${styles.onlyMobile}`}>
        <Button to="/specialists" size="lg" fullWidth>
          {t('home.hero.cta')}
        </Button>
      </div>
      <div className={`${styles.heroHelp} ${styles.onlyMobile}`}>
        <p>{t('home.hero.forYourself')}</p>
        <Button to="/community" variant="link">
          {t('home.hero.momLink')} <span aria-hidden="true">→</span>
        </Button>
      </div>

      {/* десктоп: панель поиска */}
      <form
        className={`${styles.search} ${styles.onlyDesktop}`}
        role="search"
        aria-label={t('home.search.label')}
        onSubmit={onSubmit}
      >
        <div className={styles.searchField}>
          <label htmlFor="home-query" className={styles.searchLabel}>
            {t('home.search.who')}
          </label>
          <input
            id="home-query"
            type="search"
            className={styles.searchControl}
            placeholder={t('home.search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.searchField}>
          <label htmlFor="home-format" className={styles.searchLabel}>
            {t('home.search.format')}
          </label>
          <select
            id="home-format"
            className={styles.searchControl}
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatChoice)}
          >
            {FORMAT_CHOICES.map((choice) => (
              <option key={choice} value={choice}>
                {t(`home.search.formats.${choice}`)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="lg">
          {t('home.search.submit')}
        </Button>
      </form>
    </section>
  )
}
