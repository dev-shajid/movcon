export const AUTH_ROUTES = new Set([
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
])

export const PUBLIC_ROUTES = new Set<string>([])

export function isPublicRoute(pathname: string) {
    // Exact public pages or their subpaths (e.g., /verify?secret=...)
    const base = pathname.split('?')[0]
    if (PUBLIC_ROUTES.has(base)) return true

    // Allow Next.js static and metadata (redundant with matcher, but safe)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/sitemap.xml') ||
        pathname.startsWith('/robots.txt')
    ) {
        return true
    }

    return false
}

export function isAuthRoute(pathname: string) {
    // Exact auth pages or their subpaths (e.g., /verify?secret=...)
    const base = pathname.split('?')[0]
    if (AUTH_ROUTES.has(base)) return true

    return false
}

export const HOME_URL = '/'
export const AUTH_REDIRECT_URL = '/signin'
export const WAITING_VERIFICATION_URL = '/waiting-verification'