import type { ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, login, logout, register } from '../../api'
import type { PublicUser } from '../../types'
import { AuthContext, type AuthValue } from './AuthContext'

const userKey = ['auth', 'user'] as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: userKey,
    queryFn: getCurrentUser,
    staleTime: Infinity,
  })
  const setUser = (user: PublicUser | null) => qc.setQueryData(userKey, user)

  const loginMutation = useMutation({ mutationFn: login, onSuccess: setUser })
  const registerMutation = useMutation({ mutationFn: register, onSuccess: setUser })
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => setUser(null),
  })

  const value: AuthValue = {
    user: query.data ?? null,
    isLoading: query.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
