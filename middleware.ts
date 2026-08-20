import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("user-role")?.value;
  const pathname = request.nextUrl.pathname;

  // Protect /services route -> requires logged in user
  if (pathname.startsWith("/services")) {
    if (!token || token.trim() === "") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes -> requires admin role
  if (pathname.startsWith("/admin")) {
    if (!token || token.trim() === "") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      // Normal users trying to access admin dashboard are redirected to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path*", "/admin/:path*"],
};
