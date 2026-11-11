import { describe, expect, it } from 'vitest'
import { getYoutubeEmbedUrl, parseYoutubeId } from './youtube'

const ID = 'dQw4w9WgXcQ'

describe('parseYoutubeId', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=30s`,
    `https://www.youtube.com/watch?feature=share&v=${ID}`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://music.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    `https://www.youtube.com/v/${ID}`,
    `http://www.youtube.com/watch?v=${ID}`,
    `youtube.com/watch?v=${ID}`,
    `  https://youtu.be/${ID}  `,
  ])('разбирает %s', (url) => {
    expect(parseYoutubeId(url)).toBe(ID)
  })

  it.each([
    undefined,
    null,
    '',
    '   ',
    'not a url',
    'https://example.com/watch?v=dQw4w9WgXcQ',
    'https://evil.com/youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch',
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQtoolong',
    'https://www.youtube.com/channel/UC12345678901',
    'https://www.youtube.com/',
    'https://youtu.be/',
    'javascript:alert(1)',
  ])('возвращает null для %s', (url) => {
    expect(parseYoutubeId(url)).toBeNull()
  })
})

describe('getYoutubeEmbedUrl', () => {
  it('строит адрес youtube-nocookie', () => {
    expect(getYoutubeEmbedUrl(`https://youtu.be/${ID}`)).toBe(
      `https://www.youtube-nocookie.com/embed/${ID}`,
    )
  })

  it('возвращает null для невалидной ссылки', () => {
    expect(getYoutubeEmbedUrl('https://example.com')).toBeNull()
  })
})
