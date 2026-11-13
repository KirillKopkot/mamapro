import { createContext } from 'react'
import type { LoginInput, RegisterInput } from '../../api'
import type { PublicUser } from '../../types'

export interface AuthValue {
  user: PublicUser | null
  /** true, пока читается сессия при загрузке приложения. */
  isLoading: boolean
  login: (input: LoginInput) => Promise<PublicUser>
  register: (input: RegisterInput) => Promise<PublicUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)
