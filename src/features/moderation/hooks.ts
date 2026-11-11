import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listPendingSpecialists, moderateSpecialist } from '../../api'
import type { ModerationDecision } from '../../api'

const pendingKey = ['specialists', 'pending'] as const

export function usePendingSpecialists() {
  return useQuery({ queryKey: pendingKey, queryFn: listPendingSpecialists })
}

export function useModerateSpecialist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; decision: ModerationDecision }) =>
      moderateSpecialist(v.id, v.decision),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['specialists'] }),
  })
}
