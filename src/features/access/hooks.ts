import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAccessGrants, revokeAccessGrant, saveAccessGrant } from '../../api'

const accessKey = ['accessGrants'] as const

export function useAccessGrants(childId?: string) {
  return useQuery({
    queryKey: [...accessKey, childId ?? 'all'],
    queryFn: () => getAccessGrants(childId),
  })
}

export function useSaveAccessGrant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveAccessGrant,
    onSuccess: () => qc.invalidateQueries({ queryKey: accessKey }),
  })
}

export function useRevokeAccessGrant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { childId: string; specialistId: string }) =>
      revokeAccessGrant(v.childId, v.specialistId),
    onSuccess: () => qc.invalidateQueries({ queryKey: accessKey }),
  })
}
