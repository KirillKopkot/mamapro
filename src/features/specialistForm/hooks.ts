import { useMutation, useQuery } from '@tanstack/react-query'
import { clearSpecialistDraft, getSpecialistDraft, saveSpecialistDraft } from '../../api'
import type { SpecialistFormValues } from '../../types'

export function useSpecialistDraft() {
  return useQuery({
    queryKey: ['specialistDraft'],
    queryFn: getSpecialistDraft,
    gcTime: 0,
    staleTime: Infinity,
  })
}

export function useSaveSpecialistDraft() {
  return useMutation({ mutationFn: (v: SpecialistFormValues) => saveSpecialistDraft(v) })
}

export function useClearSpecialistDraft() {
  return useMutation({ mutationFn: clearSpecialistDraft })
}
