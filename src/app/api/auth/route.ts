import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyFirebaseIdToken, getFirestoreUserById } from "@/lib/firestoreRest";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE, verifySessionToken } from "@/lib/session";

// GET /api/auth -> lightweight session status check (no profile fields)
export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  return NextResponse.json({
    authenticated: Boolean(session),
    role: session?.role || null,
    expiresAt: session ? session.exp * 1000 : null,
  });
}

// POST /api/auth -> establishes the app's own signed session cookie after a
// successful Firebase Authentication password sign-in. The client only ever
// hands us its Firebase ID token; we independently verify that token with
// Google (accounts:lookup) instead of trusting anything the client claims
// about its own identity or role.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ success: false, error: "idToken is required." }, { status: 400 });
    }

    const verified = await verifyFirebaseIdToken(idToken);
    if (!verified) {
      return NextResponse.json({ success: false, error: "Invalid or expired session." }, { status: 401 });
    }

    const userDoc = await getFirestoreUserById(verified.uid, idToken);
    const role = userDoc?.role || "user";

    const sessionToken = await createSessionToken(verified.uid, role);
    const response = NextResponse.json({
      success: true,
      uid: verified.uid,
      role,
      passcodeConfigured: userDoc?.passcodeConfigured === true,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Error in POST /api/auth:", errorObj.message || err);
    return NextResponse.json({ success: false, error: "Server error establishing session." }, { status: 500 });
  }
}

// DELETE /api/auth -> clears the session cookie (logout)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
