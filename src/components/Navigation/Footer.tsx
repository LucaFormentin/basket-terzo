import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils/helpers'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Footer = () => {
  const pathname = usePathname()

  const routesNavActions = ROUTES.map((route) => {
    /**
     * Checks if the current pathname matches the given route's href
     * or if the route's href is not the root ('/') and the pathname starts with the route's href.
     */
    let isCurrentRoute =
      pathname === route.href ||
      (route.href !== '/' && pathname.startsWith(route.href))

    return (
      <BottomNavigationAction
        key={route.href}
        LinkComponent={Link}
        href={route.href}
        label={route.label}
        icon={<route.icon />}
        aria-current={isCurrentRoute ? 'page' : undefined}
        showLabel
        className={cn(
          'min-w-0 rounded-3xl transition-colors hover:bg-blue-800/40',
          isCurrentRoute && 'bg-blue-800 text-white'
        )}
      />
    )
  })

  return (
    <BottomNavigation
      component={'footer'}
      className={cn(
        'app-footer fixed left-3 right-3 z-50 mx-auto h-16 max-w-md',
        'gap-1 rounded-2xl border border-blue-800/60 bg-blue-950/90 p-2',
        'shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md'
      )}
    >
      {routesNavActions}
    </BottomNavigation>
  )
}

export default Footer
