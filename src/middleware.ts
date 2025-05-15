import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("authjs.session-token")?.value

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth");

  if (!token && !isAuthPage) {
    // Not authenticated and trying to access a protected route
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthPage) {
    // Authenticated user should not access login/register
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/draw/:path*"],
};