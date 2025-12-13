
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { mockUsers } from './data/mockData';

const routes = [
    
]

export function proxy(request: NextRequest) {
    // Exclude static files, login page, and public APIs if needed
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname.startsWith('/api') // Allow API for now, or protect them too? Let's protect them but maybe allow login API if we had one.
    ) {
        return NextResponse.next();
    }

    const userId = request.cookies.get('mock_user_id');
    const user = mockUsers.find(u => u.id === userId?.value);

    if (!userId) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
