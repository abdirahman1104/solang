import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  try {
    // Create a response to modify
    const res = NextResponse.next();

    // Create supabase client
    const supabase = createMiddlewareClient(
      { req: request, res },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    );

    // Refresh session if it exists
    await supabase.auth.getSession();

    // Return response
    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // Return the original response on error
    return NextResponse.next();
  }
}

// Specify which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}; 