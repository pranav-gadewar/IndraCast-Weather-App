import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string): { exp?: number; role?: string; uid?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
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

// 🔐 GET /api/auth -> Verify current token session status
export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("user-role")?.value || "user";

  if (!token) {
    return NextResponse.json({ authenticated: false, role: null, expiresAt: null });
  }

  const payload = parseJwt(token);
  const isValid = Boolean(
    token && (payload?.exp ? payload.exp * 1000 > Date.now() : token.length > 20)
  );

  return NextResponse.json({
    authenticated: isValid,
    role: isValid ? role : null,
    expiresAt: payload?.exp ? payload.exp * 1000 : null,
  });
}

// 🔐 POST /api/auth -> Tokenize & synchronize authentication session cookies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, role = "user", action = "set" } = body;

    const response = NextResponse.json({
      success: true,
      action,
      timestamp: Date.now(),
    });

    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

    if (action === "clear" || !token) {
      response.cookies.set("auth-token", "", {
        path: "/",
        maxAge: 0,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      response.cookies.set("user-role", "", {
        path: "/",
        maxAge: 0,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      response.cookies.set("auth-token", token, {
        path: "/",
        maxAge,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      response.cookies.set("user-role", role, {
        path: "/",
        maxAge,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (err) {
    console.error("Error tokenizing auth cookies:", err);
    return NextResponse.json({ success: false, error: "Failed to set auth cookies" }, { status: 400 });
  }
}
