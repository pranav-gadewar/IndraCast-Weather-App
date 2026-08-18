import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  const pathname = request.nextUrl.pathname;

  // Protect routes
  if (
    (!token || token.trim() === "") &&
    (pathname.startsWith("/services") ||
      pathname.startsWith("/admin"))
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path*", "/admin/:path*"],
};
