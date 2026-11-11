import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_CHAT_MESSAGE_LENGTH } from '../../api'
import { useLang } from '../../i18n/useLang'
import type { Consultant } from '../../types'
import { DemoBanner } from './DemoBanner'
import { useChatMessages, useDemoReply, useSendChatMessage } from './hooks'
import styles from './Chat.module.css'

export function ChatView({ consultant }: { consultant: Consultant }) {
  const { t } = useTranslation()
  const lang = useLang()
  const messages = useChatMessages(consultant.id)
  const send = useSendChatMessage(consultant.id)
  const reply = useDemoReply(consultant.id)
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const count = messages.data?.length ?? 0

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' })
  }, [count, reply.isPending])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = text.trim()
    if (value === '' || send.isPending) return
    setText('')
    try {
      await send.mutateAsync(value)
      reply.mutate(lang)
    } catch {
      setText(value)
    }
  }

  return (
    <div className={styles.chat}>
      <DemoBanner messageKey="community.chat.demoBanner" />

      <div
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-label={t('community.chat.log')}
      >
        {messages.isPending && <p role="status">{t('common.loading')}</p>}
        {messages.isError && <p role="alert">{t('common.error')}</p>}
        {messages.data && messages.data.length === 0 && (
          <p className={styles.empty}>
            {t('community.chat.empty', { name: consultant.name })}
          </p>
        )}
        {messages.data?.map((m) => (
          <div key={m.id} className={m.from === 'me' ? styles.rowMe : styles.rowOther}>
            <div className={m.from === 'me' ? styles.bubbleMe : styles.bubbleOther}>
              <span className="visually-hidden">
                {m.from === 'me' ? t('community.chat.you') : consultant.name}:{' '}
              </span>
              {m.text}
              <time className={styles.time} dateTime={m.date}>
                {new Date(m.date).toLocaleTimeString(lang, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>
        ))}
        {reply.isPending && (
          <p className={styles.typing} role="status">
            {t('community.chat.typing', { name: consultant.name })}
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form className={styles.inputBar} onSubmit={(e) => void handleSubmit(e)}>
        <input
          className={styles.input}
          value={text}
          maxLength={MAX_CHAT_MESSAGE_LENGTH}
          autoComplete="off"
          aria-label={t('community.chat.inputLabel')}
          placeholder={t('community.chat.placeholder')}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className={styles.send}
          disabled={text.trim() === '' || send.isPending}
        >
          {t('community.chat.send')}
        </button>
      </form>
      {send.isError && (
        <p role="alert" className={styles.error}>
          {t('community.chat.sendError')}
        </p>
      )}
    </div>
  )
}
