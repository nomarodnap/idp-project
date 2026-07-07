import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if session cookie exists
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/idp") || request.nextUrl.pathname.startsWith("/profile") || request.nextUrl.pathname === "/";

  // If trying to access a protected route without a session, redirect to login
  if (!sessionCookie && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access login page while already authenticated, redirect to home
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
