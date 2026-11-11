import {
  mockCannedReplies,
  mockCommunities,
  mockCommunityPosts,
  mockConsultants,
} from '../mocks/community'
import type { ChatMessage, Community, CommunityPost, Consultant, Lang } from '../types'
import {
  apiConfig,
  delay,
  newId,
  readStorage,
  storageKeys,
  writeStorage,
} from './storage'

export const MAX_CHAT_MESSAGE_LENGTH = 1000

export async function listConsultants(): Promise<Consultant[]> {
  await delay()
  return mockConsultants
}

export async function getConsultant(id: string): Promise<Consultant | null> {
  await delay()
  return mockConsultants.find((c) => c.id === id) ?? null
}

export async function listCommunities(): Promise<Community[]> {
  await delay()
  return mockCommunities
}

export async function getCommunity(id: string): Promise<Community | null> {
  await delay()
  return mockCommunities.find((c) => c.id === id) ?? null
}

/** Лента демо-сообщений сообщества, новые сверху. */
export async function listCommunityPosts(communityId: string): Promise<CommunityPost[]> {
  await delay()
  return mockCommunityPosts
    .filter((p) => p.communityId === communityId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** id сообществ, в которые вступил пользователь. */
export async function listMemberships(): Promise<string[]> {
  await delay()
  return readStorage<string[]>(storageKeys.communityMemberships, () => [])
}

export async function toggleMembership(communityId: string): Promise<string[]> {
  await delay()
  const ids = readStorage<string[]>(storageKeys.communityMemberships, () => [])
  const next = ids.includes(communityId)
    ? ids.filter((id) => id !== communityId)
    : [...ids, communityId]
  writeStorage(storageKeys.communityMemberships, next)
  return next
}

type ChatStore = Record<string, ChatMessage[]>

function readChats(): ChatStore {
  return readStorage<ChatStore>(storageKeys.chatMessages, () => ({}))
}

function append(consultantId: string, message: ChatMessage): ChatMessage {
  const chats = readChats()
  writeStorage(storageKeys.chatMessages, {
    ...chats,
    [consultantId]: [...(chats[consultantId] ?? []), message],
  })
  return message
}

export async function listChatMessages(consultantId: string): Promise<ChatMessage[]> {
  await delay()
  return readChats()[consultantId] ?? []
}

/** Сохраняет сообщение пользователя (демо: без отправки куда-либо). */
export async function sendChatMessage(
  consultantId: string,
  text: string,
): Promise<ChatMessage> {
  await delay()
  const trimmed = text.trim()
  if (trimmed === '' || trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    throw new Error('Invalid message')
  }
  return append(consultantId, {
    id: newId('msg'),
    consultantId,
    from: 'me',
    text: trimmed,
    date: new Date().toISOString(),
  })
}

/** Заготовленная реплика по порядковому номеру ответа (по кругу). */
export function pickCannedReply(replyIndex: number, lang: Lang): string {
  const reply = mockCannedReplies[replyIndex % mockCannedReplies.length]
  return reply ? reply[lang] : ''
}

/** Имитация ответа консультанта: после короткой задержки добавляет заготовленную реплику. */
export async function receiveDemoReply(
  consultantId: string,
  lang: Lang,
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, apiConfig.replyDelayMs))
  const replies = (readChats()[consultantId] ?? []).filter((m) => m.from === 'consultant')
  return append(consultantId, {
    id: newId('msg'),
    consultantId,
    from: 'consultant',
    text: pickCannedReply(replies.length, lang),
    date: new Date().toISOString(),
  })
}
