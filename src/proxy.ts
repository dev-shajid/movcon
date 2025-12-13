
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { mockUsers } from './data/mockData';
import type { UserRole } from './types';

// Define route access based on user roles
const roleRouteAccess: Record<UserRole, string[]> = {
    mt_office: [
        '/',
        '/requests/new',
        '/requests',
        '/certificates',
    ],
    adjutant: [
        '/',
        '/approvals',
        '/requests',
    ],
    co: [
        '/',
        '/approvals',
        '/requests',
    ],
    gso1: [
        '/',
        '/approvals',
        '/requests',
    ],
    col_staff: [
        '/',
        '/approvals',
        '/requests',
    ],
    mp_checkpost: [
        '/',
        '/movements',
        '/logs',
        '/requests',
    ],
};

// Helper function to check if user has access to a route
const hasAccessToRoute = (userRole: UserRole, pathname: string): boolean => {
    const allowedRoutes = roleRouteAccess[userRole];

    // Check exact match first
    if (allowedRoutes.includes(pathname)) {
        return true;
    }

    // Check if pathname starts with any allowed route (for dynamic routes like /requests/[id])
    return allowedRoutes.some(route => {
        if (route !== '/' && pathname.startsWith(route)) {
            return true;
        }
        return false;
    });
};

export function proxy(request: NextRequest) {
    // Exclude static files, login page, and public APIs if needed
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname.startsWith('/api')
    ) {
        return NextResponse.next();
    }

    const userId = request.cookies.get('mock_user_id');
    const user = mockUsers.find(u => u.id === userId?.value);

    // Redirect to login if no user is found
    if (!userId || !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has access to the requested route
    if (!hasAccessToRoute(user.role, request.nextUrl.pathname)) {
        // Redirect to dashboard (home) if user doesn't have access
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
