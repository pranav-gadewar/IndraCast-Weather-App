import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(sessionCookie);
  const pathname = request.nextUrl.pathname;

  // Protect /services route -> requires a valid signed session
  if (pathname.startsWith("/services")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes -> requires a valid signed session with admin role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "admin") {
      // Normal users trying to access admin dashboard are redirected to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path*", "/admin/:path*"],
};
