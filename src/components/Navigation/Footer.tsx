import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils/helpers'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()

  const routesNavActions = ROUTES.map((route, index) => (
    <BottomNavigationAction
      key={index}
      LinkComponent={Link}
      href={route.href}
      label={route.label}
      icon={<route.icon />}
      disabled={pathname === route.href}
      showLabel
      className={cn(
        'rounded-full',
        pathname === route.href && 'bg-blue-800',
        'hover:bg-blue-800/40'
      )}
    />
  ))

  return (
    <BottomNavigation
      component={'footer'}
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-blue-950 h-14',
        'gap-3 p-1',
        'rounded-t-3xl'
      )}
    >
      {routesNavActions}
    </BottomNavigation>
  )
}

export default Footer
