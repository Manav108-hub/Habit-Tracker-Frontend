// middleware.ts - Fixed for localStorage token auth
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes with middleware
  // Dashboard auth is handled client-side since we use localStorage
  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get('access_token');

    // If no token, redirect to login
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify user is admin by checking with backend
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const user = await response.json();

      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware auth check failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Don't check dashboard routes in middleware - localStorage isn't accessible here
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],  // Only protect admin routes
};