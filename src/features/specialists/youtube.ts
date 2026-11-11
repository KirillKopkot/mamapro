const VIDEO_ID = /^[\w-]{11}$/

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
])

function validId(value: string | null | undefined): string | null {
  return value && VIDEO_ID.test(value) ? value : null
}

/**
 * Достаёт ID видео из ссылки YouTube.
 * Поддерживает watch?v=, youtu.be/, /embed/, /shorts/, /live/, /v/ и youtube-nocookie.com.
 * Возвращает null, если ссылка пустая или невалидная.
 */
export function parseYoutubeId(input: string | undefined | null): string | null {
  const raw = input?.trim()
  if (!raw) return null
  let url: URL
  try {
    url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  const host = url.hostname.toLowerCase()
  const segments = url.pathname.split('/').filter(Boolean)

  if (host === 'youtu.be' || host === 'www.youtu.be') return validId(segments[0])
  if (!YOUTUBE_HOSTS.has(host)) return null
  if (segments[0] === 'watch') return validId(url.searchParams.get('v'))
  if (['embed', 'shorts', 'live', 'v'].includes(segments[0] ?? '')) {
    return validId(segments[1])
  }
  return null
}

/** Адрес для iframe (без cookies) или null, если ссылка невалидна. */
export function getYoutubeEmbedUrl(input: string | undefined | null): string | null {
  const id = parseYoutubeId(input)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
