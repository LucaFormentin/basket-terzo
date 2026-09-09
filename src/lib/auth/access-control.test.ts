import { describe, expect, it } from 'vitest'
import { canAccessRoute, getRequiredRole } from './access-control'

describe('client route access control', () => {
  it.each([
    '/lista-multe',
    '/lista-multe/player-1',
    '/impostazioni',
    '/impostazioni/controlla-cassa',
  ])('allows authenticated roles to access %s', (pathname) => {
    expect(canAccessRoute(pathname, 'ADMIN')).toBe(true)
    expect(canAccessRoute(pathname, 'GUEST')).toBe(true)
    expect(canAccessRoute(pathname, null)).toBe(false)
  })

  it.each([
    '/lista-multe/aggiungi-multa',
    '/impostazioni/modifica-multe',
    '/impostazioni/modifica-giocatori',
  ])('restricts %s to admins, including nested paths', (pathname) => {
    expect(getRequiredRole(pathname)).toBe('ADMIN')
    expect(canAccessRoute(pathname, 'ADMIN')).toBe(true)
    expect(canAccessRoute(pathname, 'GUEST')).toBe(false)
    expect(canAccessRoute(pathname, null)).toBe(false)
  })

  it('does not match unrelated paths with a shared prefix', () => {
    expect(getRequiredRole('/impostazioni-extra')).toBeNull()
    expect(getRequiredRole('/lista-multe-extra')).toBeNull()
  })
})
