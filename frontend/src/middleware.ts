import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    // If no token, redirect to login
    if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
    
    // NOTE: In a real edge middleware, we can't easily decode JWT verification without external libs due to edge runtime constraints.
    // For a robust implementation, we might stick to client-side checks or use a lightweight JOSE library.
    // However, given the project scope, we will rely on our server actions and client components to also enforcing checks.
    // This middleware acts as a first line of defense.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
