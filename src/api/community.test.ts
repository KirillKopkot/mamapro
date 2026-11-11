import { beforeEach, describe, expect, it } from 'vitest'
import {
  listChatMessages,
  listCommunities,
  listCommunityPosts,
  listMemberships,
  pickCannedReply,
  receiveDemoReply,
  sendChatMessage,
  toggleMembership,
} from './community'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  apiConfig.delayMs = 0
  apiConfig.replyDelayMs = 0
})

describe('community api', () => {
  it('toggles membership', async () => {
    expect(await toggleMembership('cm-1')).toEqual(['cm-1'])
    expect(await listMemberships()).toEqual(['cm-1'])
    expect(await toggleMembership('cm-1')).toEqual([])
  })

  it('lists posts of one community, newest first', async () => {
    const posts = await listCommunityPosts('cm-1')
    expect(posts.length).toBeGreaterThan(1)
    expect(posts.every((p) => p.communityId === 'cm-1')).toBe(true)
    expect(posts.map((p) => p.date)).toEqual(
      [...posts.map((p) => p.date)].sort().reverse(),
    )
    expect((await listCommunities()).length).toBeGreaterThanOrEqual(3)
  })
})

describe('chat', () => {
  it('stores user messages per consultant and rejects invalid text', async () => {
    await sendChatMessage('mc-1', '  Привет  ')
    expect((await listChatMessages('mc-1')).map((m) => m.text)).toEqual(['Привет'])
    expect(await listChatMessages('mc-2')).toEqual([])
    await expect(sendChatMessage('mc-1', '   ')).rejects.toThrow()
    await expect(sendChatMessage('mc-1', 'x'.repeat(1001))).rejects.toThrow()
  })

  it('consultant answers with canned replies in the requested language, cycling', async () => {
    await sendChatMessage('mc-1', 'a')
    const first = await receiveDemoReply('mc-1', 'ru')
    expect(first.from).toBe('consultant')
    expect(first.text).toBe(pickCannedReply(0, 'ru'))
    const second = await receiveDemoReply('mc-1', 'kk')
    expect(second.text).toBe(pickCannedReply(1, 'kk'))
    expect(pickCannedReply(4, 'ru')).toBe(pickCannedReply(0, 'ru'))
    expect(await listChatMessages('mc-1')).toHaveLength(3)
  })
})
