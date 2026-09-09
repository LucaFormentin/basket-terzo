export type UserRole = 'ADMIN' | 'GUEST'

const ADMIN_ONLY_ROUTES = [
  '/lista-multe/aggiungi-multa',
  '/impostazioni/modifica-multe',
  '/impostazioni/modifica-giocatori',
]

const AUTHENTICATED_ROUTES = ['/lista-multe', '/impostazioni']

const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`)

export const getRequiredRole = (pathname: string): UserRole | 'AUTHENTICATED' | null => {
  if (ADMIN_ONLY_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return 'ADMIN'
  }

  if (AUTHENTICATED_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return 'AUTHENTICATED'
  }

  return null
}

export const canAccessRoute = (pathname: string, role: UserRole | null) => {
  const requiredRole = getRequiredRole(pathname)

  if (!requiredRole) return true
  if (requiredRole === 'AUTHENTICATED') return role !== null

  return role === requiredRole
}
