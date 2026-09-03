// Shared server-side helpers for talking to Firebase Auth / Firestore over
// their public REST APIs. This project has no firebase-admin service
// account, so these helpers are the closest we can get to trusted
// server-side access: they either forward the caller's own Firebase ID
// token (preferred, ties every request back to a real authenticated user)
// or fall back to a short-lived anonymous token purely so unauthenticated
// requests (e.g. passcode login, before any session exists) can perform the
// narrow, rules-permitted lookups they need.

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export type FirestoreFieldValue = string | boolean | number;

export interface ParsedUserDoc {
  id: string;
  name: string;
  email: string;
  role: string;
  passcodeHash: string | null;
  passcodeConfigured: boolean;
  failedPasscodeAttempts: number;
  failedPasswordAttempts: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseFirestoreDoc(doc: { name: string; fields?: Record<string, any> }): ParsedUserDoc {
  const fields = doc.fields || {};
  const nameParts = doc.name.split("/");
  const docId = nameParts[nameParts.length - 1];

  return {
    id: docId,
    name: fields.name?.stringValue || "",
    email: fields.email?.stringValue || "",
    role: fields.role?.stringValue || "user",
    passcodeHash: fields.passcodeHash?.stringValue || null,
    passcodeConfigured: fields.passcodeConfigured?.booleanValue || false,
    failedPasscodeAttempts: fields.failedPasscodeAttempts?.integerValue
      ? Number(fields.failedPasscodeAttempts.integerValue)
      : 0,
    failedPasswordAttempts: fields.failedPasswordAttempts?.integerValue
      ? Number(fields.failedPasswordAttempts.integerValue)
      : 0,
  };
}

// Obtains a short-lived anonymous Firebase Auth token, used only when no
// real user ID token is available (e.g. an unauthenticated passcode-login
// attempt). Requires the Anonymous sign-in provider to be enabled; if it
// isn't, this returns null and callers fall back to an unauthenticated
// request (still permitted for the narrow reads Firestore rules allow).
async function getServerAuthToken(): Promise<string | null> {
  if (!FIREBASE_API_KEY) return null;
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnSecureToken: true }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.idToken || null;
  } catch (err) {
    console.error("[firestoreRest] Error obtaining anonymous bootstrap token:", err);
    return null;
  }
}

async function resolveToken(idToken?: string): Promise<string | undefined> {
  if (idToken) return idToken;
  return (await getServerAuthToken()) || undefined;
}

// Verifies a Firebase Auth ID token by asking Identity Toolkit about it
// directly. This is the REST-only equivalent of firebase-admin's
// verifyIdToken(): if the token is malformed, expired, or forged, Google
// rejects the lookup and we return null.
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ uid: string; email: string | null } | null> {
  if (!FIREBASE_API_KEY || !idToken) return null;

  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const user = data.users?.[0];
    if (!user?.localId) return null;

    return { uid: user.localId, email: user.email || null };
  } catch (err) {
    console.error("[firestoreRest] verifyFirebaseIdToken failed:", err);
    return null;
  }
}

export async function getFirestoreUserById(uid: string, idToken?: string): Promise<ParsedUserDoc | null> {
  if (!FIREBASE_PROJECT_ID || !FIREBASE_API_KEY || !uid) return null;

  const token = await resolveToken(idToken);
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const doc = await res.json();
    return parseFirestoreDoc(doc);
  } catch (err) {
    console.error("[firestoreRest] getFirestoreUserById failed:", err);
    return null;
  }
}

// Looks a user up by email. Firestore REST queries are case-sensitive, so
// the primary runQuery attempt normalizes the target email but relies on
// the stored `email` field already being normalized too; the full-collection
// fallback normalizes both sides defensively in case older records aren't.
export async function getFirestoreUserByEmail(email: string, idToken?: string): Promise<ParsedUserDoc | null> {
  if (!FIREBASE_PROJECT_ID || !FIREBASE_API_KEY) return null;

  const targetEmail = email.toLowerCase().trim();
  const token = await resolveToken(idToken);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Method 1: indexed equality query by email (fast path)
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "users" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "email" },
              op: "EQUAL",
              value: { stringValue: targetEmail },
            },
          },
          limit: 1,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.document) {
        return parseFirestoreDoc(data[0].document);
      }
    } else {
      console.warn("[firestoreRest] runQuery-by-email non-OK status:", res.status);
    }
  } catch (err) {
    console.error("[firestoreRest] runQuery-by-email failed:", err);
  }

  // Method 2: full collection scan with case-insensitive compare (fallback
  // for legacy records whose stored email wasn't normalized at write time)
  try {
    const listUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users?key=${FIREBASE_API_KEY}`;
    const res = await fetch(listUrl, { headers });
    if (res.ok) {
      const data = await res.json();
      const docs = data.documents || [];
      for (const docItem of docs) {
        const parsed = parseFirestoreDoc(docItem);
        if (parsed.email.toLowerCase().trim() === targetEmail) {
          return parsed;
        }
      }
    } else {
      console.warn("[firestoreRest] list-users fallback non-OK status:", res.status);
    }
  } catch (err) {
    console.error("[firestoreRest] list-users fallback failed:", err);
  }

  return null;
}

export async function updateFirestoreUserFields(
  docId: string,
  fields: Record<string, FirestoreFieldValue>,
  idToken?: string
): Promise<boolean> {
  if (!FIREBASE_PROJECT_ID || !FIREBASE_API_KEY || !docId) return false;

  const token = await resolveToken(idToken);

  try {
    const updateMask = Object.keys(fields)
      .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
      .join("&");
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${docId}?key=${FIREBASE_API_KEY}&${updateMask}`;

    const formattedFields: Record<string, Record<string, unknown>> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (typeof v === "string") formattedFields[k] = { stringValue: v };
      else if (typeof v === "boolean") formattedFields[k] = { booleanValue: v };
      else if (typeof v === "number") formattedFields[k] = { integerValue: v };
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ fields: formattedFields }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[firestoreRest] update failed:", res.status, errText);
    }

    return res.ok;
  } catch (err) {
    console.error("[firestoreRest] updateFirestoreUserFields failed:", err);
    return false;
  }
}
