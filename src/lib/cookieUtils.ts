export function setAuthCookies(token: string, role: string) {
  if (typeof document === "undefined") return;

  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  document.cookie = `auth-token=${token}; Path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user-role=${role}; Path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;

  document.cookie = "auth-token=; Path=/; max-age=0; SameSite=Lax";
  document.cookie = "user-role=; Path=/; max-age=0; SameSite=Lax";
}
