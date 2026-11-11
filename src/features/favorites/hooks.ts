import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listFavorites, toggleFavorite } from '../../api'

const favoritesKey = ['favorites'] as const

export function useFavorites() {
  return useQuery({ queryKey: favoritesKey, queryFn: listFavorites })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (ids) => qc.setQueryData(favoritesKey, ids),
  })
}
