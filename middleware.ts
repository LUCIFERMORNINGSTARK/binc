import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // Protected routes
    // if (request.nextUrl.pathname.startsWith('/admin')) {
    //     if (!session) {
    //         return NextResponse.redirect(new URL('/login', request.url));
    //     }

    //     const payload = await verifyToken(session.value);
    //     if (!payload || payload.role !== 'admin') {
    //         return NextResponse.redirect(new URL('/', request.url));
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
