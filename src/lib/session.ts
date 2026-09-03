// Signed, HttpOnly application session tokens (HMAC-SHA256 via Web Crypto).
// Used instead of trusting client-settable cookies. Works in both the
// Node.js and Edge runtimes since it only relies on globalThis.crypto.

const ALGO = { name: "HMAC", hash: "SHA-256" } as const;
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const SESSION_COOKIE_NAME = "indracast_session";
export const SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;

export interface SessionPayload {
  uid: string;
  role: string;
  exp: number; // epoch seconds
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "indracast-session-fallback-secret-2026";
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const padLength = (4 - (input.length % 4)) % 4;
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(getSecret()), ALGO, false, ["sign", "verify"]);
}

export async function createSessionToken(uid: string, role: string): Promise<string> {
  const payload: SessionPayload = {
    uid,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey();
  const signature = await crypto.subtle.sign(ALGO, key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      ALGO,
      key,
      fromBase64Url(signatureB64) as BufferSource,
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as SessionPayload;
    if (!payload?.uid || !payload?.role || !payload?.exp) return null;
    if (payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
