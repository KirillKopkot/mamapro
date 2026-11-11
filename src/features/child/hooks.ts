import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getChildren, saveChild } from '../../api'

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
