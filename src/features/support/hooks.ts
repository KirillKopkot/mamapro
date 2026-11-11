import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getChecklistState,
  getRouteProgress,
  listRouteSteps,
  listSupportArticles,
  toggleChecklistItem,
  toggleRouteStep,
} from '../../api'
import type { SupportCategory } from '../../types'

const checklistKey = ['supportChecklists'] as const
const progressKey = ['routeProgress'] as const

export function useSupportArticles(category: SupportCategory) {
  return useQuery({
    queryKey: ['supportArticles', category],
    queryFn: () => listSupportArticles(category),
  })
}

export function useChecklistState() {
  return useQuery({ queryKey: checklistKey, queryFn: getChecklistState })
}

export function useToggleChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { articleId: string; itemId: string }) =>
      toggleChecklistItem(v.articleId, v.itemId),
    onSuccess: (state) => qc.setQueryData(checklistKey, state),
  })
}

export function useRouteSteps() {
  return useQuery({ queryKey: ['routeSteps'], queryFn: listRouteSteps })
}

export function useRouteProgress() {
  return useQuery({ queryKey: progressKey, queryFn: getRouteProgress })
}

export function useToggleRouteStep() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleRouteStep,
    onSuccess: (done) => qc.setQueryData(progressKey, done),
  })
}
