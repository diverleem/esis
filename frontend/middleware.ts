import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware ini akan dijalankan pada setiap request (sesuai config matcher)
export function middleware(request: NextRequest) {
    // Mengecek apakah cookie otentikasi ('is_logged_in') ada
    const isLoggedIn = request.cookies.has('is_logged_in');
    
    // Mendapatkan URL saat ini
    const { pathname } = request.nextUrl;

    // Jika pengguna belum login dan mencoba mengakses halaman selain login,
    // maka arahkan secara paksa (redirect) ke halaman /login
    if (!isLoggedIn && !pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika pengguna sudah login tapi mencoba mengakses halaman login,
    // maka arahkan kembali ke halaman utama (dashboard)
    if (isLoggedIn && pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Lanjutkan request seperti biasa jika tidak ada masalah
    return NextResponse.next();
}

// Menentukan rute mana saja yang akan dicek oleh middleware ini
export const config = {
    // Konfigurasi matcher: Terapkan ke semua rute KECUALI api, _next/static, _next/image, favicon.ico
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
