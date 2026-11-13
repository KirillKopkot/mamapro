/** Разрешает только внутренние пути вида `/...` (защита от open redirect); иначе `/`. */
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\'))
    return '/'
  return raw
}

export function loginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`
}
