// proxy.ts — Next.js 16 successor to middleware.ts
//
// Gates /admin/* routes. Unauthenticated requests are redirected to
// /admin/login. Public routes pass through unchanged.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — essential for keeping users logged in
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");
  const isAuthCallback = pathname.startsWith("/admin/auth");

  // Redirect unauthenticated users hitting /admin/* to login
  // Exception: /admin/login and /admin/auth/callback are always accessible
  if (isAdminRoute && !user && !isLoginRoute && !isAuthCallback) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Logged-in user hitting /admin/login → redirect to /admin
  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * Feel free to modify to add more public routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
