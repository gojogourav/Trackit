// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export default async function middleware(request: NextRequest) {
  
  const path = request.nextUrl.pathname;

  const publicRoutes = [
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register'
  ];

  // Allow access to public routes
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;


  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jose.jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile'],
};