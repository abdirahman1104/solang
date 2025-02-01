import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  if (!request.nextUrl.pathname.startsWith('/dashboards')) {
    return NextResponse.next();
  }

  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboards/:path*']
}; 