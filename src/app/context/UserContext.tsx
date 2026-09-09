'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type UserRole } from '@/lib/auth/access-control'

const USER_ROLE_STORAGE_KEY = 'basket-terzo:user-role'

type UserContextType = {
  role: UserRole | null
  isReady: boolean
  setRole: (role: UserRole) => void
}

const UserContext = createContext<UserContextType | null>(null)

export const useUserCtx = () => {
  const ctx = useContext(UserContext)

  if (!ctx) {
    throw new Error('useUserCtx must be used within a UserContextProvider')
  }

  return ctx
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [role, setCurrentRole] = useState<UserRole | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      const storedRole = sessionStorage.getItem(USER_ROLE_STORAGE_KEY)

      if (storedRole === 'ADMIN' || storedRole === 'GUEST') {
        setCurrentRole(storedRole)
      }
    } catch {
      // Continue with no role when session storage is unavailable.
    } finally {
      setIsReady(true)
    }
  }, [])

  const setRole = useCallback((newRole: UserRole) => {
    setCurrentRole(newRole)

    try {
      sessionStorage.setItem(USER_ROLE_STORAGE_KEY, newRole)
    } catch {
      // The in-memory role still works when session storage is unavailable.
    }
  }, [])

  const ctxValue = useMemo(
    () => ({ role, isReady, setRole }),
    [role, isReady, setRole]
  )

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  )
}
