'use client'

import { useUserCtx } from '@/app/context/UserContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const middlewareMatcherConfig = ['/lista-multe', '/impostazioni']

/**
 * Custom hook that applies middleware logic based on the user's role and the current pathname.
 *
 * This hook uses the `useUserCtx` hook to get the user's role, `useRouter` to navigate, and `usePathname` to get the current path.
 * It checks the `middlewareMatcherConfig` to see if the current path requires middleware checks.
 * If the user is not authorized (i.e., no role), it shows an error toast and redirects to the home page.
 *
 */
const useMiddleware = () => {
  const { role } = useUserCtx()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    middlewareMatcherConfig.forEach((route) => {
      if (route !== pathname) return

      if (!role) {
        toast.error('Utente non autorizzato!')
        router.push('/')
        return
      }
    })
  }, [])

  return null
}

export default useMiddleware
