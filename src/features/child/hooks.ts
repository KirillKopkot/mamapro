import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  clearChildDraft,
  deleteChild,
  getChildDraft,
  getChildForSpecialist,
  getChildren,
  saveChild,
  saveChildDraft,
} from '../../api'
import type { ChildDraft } from '../../types'

const childrenKey = ['children'] as const

export function useChildren() {
  return useQuery({ queryKey: childrenKey, queryFn: getChildren })
}

export function useSaveChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveChild,
    onSuccess: () => qc.invalidateQueries({ queryKey: childrenKey }),
  })
}

export function useDeleteChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteChild,
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: childrenKey }),
        qc.invalidateQueries({ queryKey: ['accessGrants'] }),
        qc.invalidateQueries({ queryKey: ['childDraft'] }),
        qc.invalidateQueries({ queryKey: ['childForSpecialist'] }),
      ]),
  })
}

/** Что видит конкретный специалист (null — доступа нет). */
export function useChildForSpecialist(childId: string, specialistId: string) {
  return useQuery({
    queryKey: ['childForSpecialist', childId, specialistId],
    queryFn: () => getChildForSpecialist(childId, specialistId),
    gcTime: 0,
  })
}

/** Черновик читается заново при каждом открытии формы. */
export function useChildDraft(key: string) {
  return useQuery({
    queryKey: ['childDraft', key],
    queryFn: () => getChildDraft(key),
    gcTime: 0,
    staleTime: Infinity,
  })
}

export function useSaveChildDraft(key: string) {
  return useMutation({ mutationFn: (draft: ChildDraft) => saveChildDraft(key, draft) })
}

export function useClearChildDraft() {
  return useMutation({ mutationFn: clearChildDraft })
}
