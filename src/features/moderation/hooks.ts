import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listPendingReviews,
  listPendingSpecialists,
  moderateReview,
  moderateSpecialist,
} from '../../api'
import type { ModerationDecision, ReviewDecision } from '../../api'

const pendingKey = ['specialists', 'pending'] as const
const pendingReviewsKey = ['reviews', 'pending'] as const

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

export function usePendingReviews() {
  return useQuery({ queryKey: pendingReviewsKey, queryFn: listPendingReviews })
}

export function useModerateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; decision: ReviewDecision }) =>
      moderateReview(v.id, v.decision),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ['reviews'] }),
        qc.invalidateQueries({ queryKey: ['specialists'] }),
      ]),
  })
}
