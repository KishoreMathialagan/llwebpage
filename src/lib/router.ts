import { useEffect, useState } from 'react'

export function normalizePath(path: string): string {
  // Strip trailing slashes, keep root as '/'
  const clean = path.replace(/\/+$/, '')
  return clean || '/'
}

export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false
  const path = normalizePath(window.location.pathname.toLowerCase())
  const hash = normalizePath(window.location.hash.replace(/^#\/?/, '').toLowerCase())
  return path === '/adminpanel' || hash === 'adminpanel'
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(isAdminRoute)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdmin(isAdminRoute())
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  return isAdmin
}
