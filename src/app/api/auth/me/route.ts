import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getFirestoreUserById } from "@/lib/firestoreRest";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

// GET /api/auth/me -> resolves the current signed session (works for both
// password- and passcode-authenticated users, since neither the middleware
// nor this route depend on a live Firebase Auth client session) plus the
// caller's own profile fields needed for nav/header display.
export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const userDoc = await getFirestoreUserById(session.uid);

  return NextResponse.json({
    authenticated: true,
    uid: session.uid,
    role: session.role,
    name: userDoc?.name || "",
    email: userDoc?.email || "",
    passcodeConfigured: userDoc?.passcodeConfigured === true,
  });
}
