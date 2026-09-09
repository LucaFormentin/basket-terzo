'use client'

import { useUserCtx } from '@/app/context/UserContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { canAccessRoute, getRequiredRole } from '@/lib/auth/access-control'

/**
 * Custom hook that applies middleware logic based on the user's role and the current pathname.
 *
 * This hook uses the `useUserCtx` hook to get the user's role, `useRouter` to navigate, and `usePathname` to get the current path.
 * It checks the `middlewareMatcherConfig` to see if the current path requires middleware checks.
 * If the user is not authorized (i.e., no role), it shows an error toast and redirects to the home page.
 *
 */
const useMiddleware = () => {
  const { role, isReady } = useUserCtx()
  const router = useRouter()
  const pathname = usePathname()
  const canAccess = isReady && canAccessRoute(pathname, role)

  useEffect(() => {
    if (!isReady || canAccess) return

    const requiredRole = getRequiredRole(pathname)
    const isMissingAdminRole = requiredRole === 'ADMIN' && role === 'GUEST'

    toast.error(
      isMissingAdminRole
        ? 'Permessi insufficienti!'
        : 'Utente non autorizzato!'
    )
    router.replace(isMissingAdminRole ? '/impostazioni' : '/')
  }, [canAccess, isReady, pathname, role, router])

  return canAccess
}

export default useMiddleware
