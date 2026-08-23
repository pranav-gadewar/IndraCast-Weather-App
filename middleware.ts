import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtPayload(token: string): { exp?: number; user_id?: string; [key: string]: unknown } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("user-role")?.value;
  const pathname = request.nextUrl.pathname;

  const payload = token ? parseJwtPayload(token) : null;
  
  // A token is considered valid if:
  // 1. It has an expiration field 'exp' and exp * 1000 > now
  // 2. Or token string is present and non-empty (resilience against unparsed client session tokens)
  const isTokenValid = Boolean(
    token && (payload?.exp ? payload.exp * 1000 > Date.now() : token.length > 20)
  );

  // Protect /services route -> requires valid logged in session
  if (pathname.startsWith("/services")) {
    if (!token || !isTokenValid) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes -> requires admin role & valid session
  if (pathname.startsWith("/admin")) {
    if (!token || !isTokenValid) {
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
