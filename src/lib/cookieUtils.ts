export interface JwtTokenPayload {
  exp?: number;
  iat?: number;
  auth_time?: number;
  user_id?: string;
  sub?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * 🔐 Safely decodes and validates a JWT token structure and expiration
 */
export function verifyJwtToken(token: string): JwtTokenPayload | null {
  if (!token || typeof token !== "string") return null;

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

    const payload: JwtTokenPayload = JSON.parse(jsonPayload);

    // Verify expiration timestamp if present
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null; // Token expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * 🔐 Tokenizes and synchronizes authentication session cookies on client & server
 */
export function setAuthCookies(token: string, role: string) {
  if (typeof document === "undefined") return;

  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  document.cookie = `auth-token=${token}; Path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user-role=${role}; Path=/; max-age=${maxAge}; SameSite=Lax`;

  // Asynchronously synchronize with server auth endpoint
  try {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, role, action: "set" }),
    }).catch(() => {
      // Ignore background sync errors
    });
  } catch {
    // Ignore background sync errors
  }
}

/**
 * 🔐 Clears tokenized authentication session cookies on client & server
 */
export function clearAuthCookies() {
  if (typeof document === "undefined") return;

  document.cookie = "auth-token=; Path=/; max-age=0; SameSite=Lax";
  document.cookie = "user-role=; Path=/; max-age=0; SameSite=Lax";

  // Asynchronously clear on server auth endpoint
  try {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    }).catch(() => {
      // Ignore background sync errors
    });
  } catch {
    // Ignore background sync errors
  }
}
