'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

type UserContextType = {
  role: 'ADMIN' | 'GUEST' | null
  setRole: (role: 'ADMIN' | 'GUEST') => void
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
  const [userCtx, setUserCtx] = useState<UserContextType>({
    role: null,
    setRole: (newRole) => setUserCtx({ ...userCtx, role: newRole }),
  })

  const ctxValue = {
    role: userCtx.role,
    setRole: userCtx.setRole,
  }

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  )
}
