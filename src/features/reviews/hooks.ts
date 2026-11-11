import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addReview, listReviews } from '../../api'

const reviewsKey = (specialistId: string) => ['reviews', specialistId] as const

export function useReviews(specialistId: string) {
  return useQuery({
    queryKey: reviewsKey(specialistId),
    queryFn: () => listReviews(specialistId),
  })
}

export function useAddReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addReview,
    onSuccess: (review) =>
      qc.invalidateQueries({ queryKey: reviewsKey(review.specialistId) }),
  })
}
