// Server-only Firebase Admin SDK access (Node.js runtime API routes only —
// never import this from middleware.ts, which runs on the Edge runtime).
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are not configured.");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

// Mints a genuine, short-lived Firebase custom token for `uid`. The client
// exchanges this via signInWithCustomToken() to get a real Firebase Auth
// session — used after a successful passcode login, which otherwise has no
// way to establish one (there's no password to sign in with).
export async function mintCustomToken(uid: string, claims?: Record<string, unknown>): Promise<string | null> {
  try {
    const app = getAdminApp();
    return await getAuth(app).createCustomToken(uid, claims);
  } catch (err) {
    console.error("[firebaseAdmin] mintCustomToken failed:", err);
    return null;
  }
}
