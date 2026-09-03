// The app's session cookie is HttpOnly and signed server-side (see
// src/lib/session.ts) — it is issued automatically via Set-Cookie by
// /api/auth (password login) and /api/auth/passcode (passcode login /
// setup), so there is nothing for client JS to "set" here anymore. This
// helper only clears it out again on logout.
export async function clearAuthCookies(): Promise<void> {
  try {
    await fetch("/api/auth", { method: "DELETE" });
  } catch {
    // Best-effort: if this fails the cookie will simply expire on its own.
  }
}
