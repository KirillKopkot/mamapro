import { useTranslation } from 'react-i18next'
import { getYoutubeEmbedUrl } from '../youtube'
import { Section } from './Section'
import styles from './VideoSection.module.css'

export function VideoSection({ url }: { url?: string }) {
  const { t } = useTranslation()
  const embedUrl = getYoutubeEmbedUrl(url)
  if (!embedUrl) return null

  return (
    <Section title={t('profile.video')}>
      <div className={styles.frame}>
        <iframe
          src={embedUrl}
          title={t('profile.videoTitle')}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Section>
  )
}
