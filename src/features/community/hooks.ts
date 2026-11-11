import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCommunity,
  getConsultant,
  listChatMessages,
  listCommunities,
  listCommunityPosts,
  listConsultants,
  listMemberships,
  receiveDemoReply,
  sendChatMessage,
  toggleMembership,
} from '../../api'
import type { Lang } from '../../types'

const membershipsKey = ['memberships'] as const
const chatKey = (consultantId: string) => ['chat', consultantId] as const

export function useConsultants() {
  return useQuery({ queryKey: ['consultants'], queryFn: listConsultants })
}

export function useConsultant(id: string) {
  return useQuery({ queryKey: ['consultants', id], queryFn: () => getConsultant(id) })
}

export function useCommunities() {
  return useQuery({ queryKey: ['communities'], queryFn: listCommunities })
}

export function useCommunity(id: string) {
  return useQuery({ queryKey: ['communities', id], queryFn: () => getCommunity(id) })
}

export function useCommunityPosts(communityId: string) {
  return useQuery({
    queryKey: ['communityPosts', communityId],
    queryFn: () => listCommunityPosts(communityId),
  })
}

export function useMemberships() {
  return useQuery({ queryKey: membershipsKey, queryFn: listMemberships })
}

export function useToggleMembership() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleMembership,
    onSuccess: (ids) => qc.setQueryData(membershipsKey, ids),
  })
}

export function useChatMessages(consultantId: string) {
  return useQuery({
    queryKey: chatKey(consultantId),
    queryFn: () => listChatMessages(consultantId),
  })
}

export function useSendChatMessage(consultantId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => sendChatMessage(consultantId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKey(consultantId) }),
  })
}

/** Имитация ответа консультанта (isPending — «печатает…»). */
export function useDemoReply(consultantId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (lang: Lang) => receiveDemoReply(consultantId, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKey(consultantId) }),
  })
}
