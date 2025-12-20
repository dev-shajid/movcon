
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { TUserRole } from './types';
import { getUserProfile } from './services/auth.service';
import { UserRole } from './lib/UserRole';
import { AUTH_REDIRECT_URL, AUTH_ROUTES, HOME_URL, isAuthRoute, isPublicRoute, PUBLIC_ROUTES } from './route';

// Define route access based on user roles
const roleRouteAccess: Record<TUserRole, string[]> = {
    admin: [
        '/'
    ],
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

// Common routes accessible to all authenticated users
const commonRoutes = ['/', '/profile'];

// Helper function to check if user has access to a route
const hasAccessToRoute = (TUserRole: TUserRole, pathname: string): boolean => {
    // Allow all common routes for any authenticated user
    if (commonRoutes.includes(pathname)) {
        return true;
    }
    const allowedRoutes = roleRouteAccess[TUserRole];

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


export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Allow all public routes
    if (isPublicRoute(path)) return NextResponse.next();

    // Get user profile from Supabase
    const profileRes = await getUserProfile();
    const user = profileRes.success ? profileRes.data : null;
    const validRoles = Object.values(UserRole);
    const isRoleValid = user?.role && validRoles.includes(user.role);

    // Authenticated users should not access auth routes
    if (user && isAuthRoute(path)) {
        return NextResponse.redirect(new URL(HOME_URL, request.url));
    }

    // Unauthenticated users can only access auth/public routes
    if (!user && !isAuthRoute(path)) {
        return NextResponse.redirect(new URL(AUTH_REDIRECT_URL, request.url));
    }

    // Unverified users (invalid role) can only access /waiting-verification
    if (user && !isRoleValid) {
        if (path !== '/waiting-verification') {
            return NextResponse.redirect(new URL('/waiting-verification', request.url));
        }
        return NextResponse.next();
    }

    // Verified users: check route access
    if (user && isRoleValid) {
        if (!hasAccessToRoute(user.role, path)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
