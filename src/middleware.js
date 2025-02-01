import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  try {
    // Create a response to modify
    const res = NextResponse.next();

    // Create supabase client
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if it exists
    const { data: { session }, error } = await supabase.auth.getSession();

    // Handle protected routes
    if (request.nextUrl.pathname.startsWith('/dashboards')) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    }

    // Handle auth page when already logged in
    if (request.nextUrl.pathname === '/auth') {
      if (session) {
        return NextResponse.redirect(new URL('/dashboards', request.url));
      }
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // On error, allow the request to continue
    return NextResponse.next();
  }
}

// Specify which routes to apply middleware to
export const config = {
  matcher: ['/auth', '/dashboards/:path*']
}; 