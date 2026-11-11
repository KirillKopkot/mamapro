import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSpecialist, getSpecialist, listSpecialists } from '../../api'

export const specialistKeys = {
  all: ['specialists'] as const,
  detail: (id: string) => ['specialists', id] as const,
}

export function useSpecialists() {
  return useQuery({ queryKey: specialistKeys.all, queryFn: listSpecialists })
}

export function useSpecialist(id: string) {
  return useQuery({
    queryKey: specialistKeys.detail(id),
    queryFn: () => getSpecialist(id),
  })
}

export function useCreateSpecialist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSpecialist,
    onSuccess: () => qc.invalidateQueries({ queryKey: specialistKeys.all }),
  })
}
