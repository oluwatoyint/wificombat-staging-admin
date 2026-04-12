import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token'); // Or however you manage authentication tokens

    // If user is authenticated, redirect them away from the login page
    if (token && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url)); // Redirect to the home page or dashboard
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/login', // Apply middleware only on the login page
};
