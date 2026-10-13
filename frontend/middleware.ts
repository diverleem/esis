import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/utils/auth';

// Middleware ini akan dijalankan pada setiap request yang cocok dengan matcher
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('session_token')?.value;

    let session = null;
    if (token) {
        session = await verifySession(token);
    }

    const isLoggedIn = !!session;

    // Jika pengguna belum login dan mencoba mengakses rute terproteksi (selain /login)
    if (!isLoggedIn && !pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika pengguna sudah login tapi mencoba mengakses halaman login
    if (isLoggedIn && pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Terapkan ke semua rute KECUALI api, _next/static, _next/image, favicon.ico
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
