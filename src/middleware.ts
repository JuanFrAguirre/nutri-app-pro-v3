import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Define protected routes and their requirements
const protectedRoutes = {
  // API routes that require authentication
  api: [
    // Add more API routes here
  ],
  // Page routes that require authentication
  pages: [
    '/registros',
    '/comidas',
    '/productos',
    '/calculadora',
    '/dashboard',
    // Add more page routes here
  ],
};

// Check if the current path matches any protected route
function isProtectedRoute(pathname: string): boolean {
  return [...protectedRoutes.api, ...protectedRoutes.pages].some((route) =>
    pathname.startsWith(route),
  );
}

// Handle API routes differently from page routes
function handleUnauthorized(isApiRoute: boolean) {
  if (isApiRoute) {
    return NextResponse.json(
      { message: 'Unauthorized, no token set' },
      { status: 401 },
    );
  }
  // For page routes, redirect to login
  return NextResponse.redirect(
    new URL('/iniciar-sesion', process.env.BASE_URL),
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for non-protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('Authorization')?.value;
  if (!token) {
    return handleUnauthorized(pathname.startsWith('/api'));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.replace('Bearer ', ''), secret);
    const decoded = payload as unknown as JwtPayload;
    const response = NextResponse.next();

    // Set user ID header for API routes
    if (pathname.startsWith('/api')) {
      response.headers.set('x-user-id', decoded.id);
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return handleUnauthorized(pathname.startsWith('/api'));
  }
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all page routes that need protection
    '/dashboard/:path*',
    '/profile/:path*',
    '/comidas/:path*',
    '/productos/:path*',
    '/calculadora/:path*',
    '/registros/:path*',
    // Add more matchers as needed
  ],
};
