import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  matcher: [
    "/vendor/:path*",
    "/buyer/:path*",
    "/main/vendor/:path*",
    "/main/buyer/:path*",
    "/login",
    "/register",
  ],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isProtectedRoute =
    pathname.startsWith("/vendor") || pathname.startsWith("/buyer") ||
    pathname.startsWith("/main/vendor") || pathname.startsWith("/main/buyer");

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/main", req.url));
  }

  return res;
}
