import { useUserCtx } from '@/app/context/UserContext'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils/helpers'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Footer = () => {
  const pathname = usePathname()
  const { role } = useUserCtx()

  const routesNavActions = ROUTES.map((route, index) => {
    if (role === 'GUEST' && route.href === '/impostazioni') return

    /**
     * Checks if the current pathname matches the given route's href
     * or if the route's href is not the root ('/') and the pathname starts with the route's href.
     */
    let isCurrentRoute =
      pathname === route.href ||
      (route.href !== '/' && pathname.startsWith(route.href))

    return (
      <BottomNavigationAction
        key={index}
        LinkComponent={Link}
        href={route.href}
        label={route.label}
        icon={<route.icon />}
        disabled={pathname === route.href}
        showLabel
        className={cn(
          'rounded-3xl hover:bg-blue-800/40',
          isCurrentRoute && 'bg-blue-800'
        )}
      />
    )
  })

  return (
    <BottomNavigation
      component={'footer'}
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-blue-950 h-14',
        'gap-3 p-1 rounded-t-3xl'
      )}
    >
      {routesNavActions}
    </BottomNavigation>
  )
}

export default Footer
