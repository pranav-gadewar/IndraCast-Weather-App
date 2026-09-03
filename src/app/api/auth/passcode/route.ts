import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { isValidPasscode, isRestrictedPasscode } from "@/lib/passcodeUtils";
import {
  getFirestoreUserByEmail,
  updateFirestoreUserFields,
} from "@/lib/firestoreRest";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";
import { mintCustomToken } from "@/lib/firebaseAdmin";

const MAX_PASSCODE_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    let idToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

    const body = await request.json();
    const { action, email, passcode, newPasscode, uid, role, idToken: bodyToken } = body;
    if (!idToken && bodyToken) {
      idToken = bodyToken;
    }

    // 1. CHECK PASSCODE CONFIGURATION STATUS
    if (action === "check-status") {
      if (!email) {
        return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
      }

      const user = await getFirestoreUserByEmail(email, idToken);
      if (!user) {
        return NextResponse.json({
          success: true,
          passcodeConfigured: true,
          failedPasscodeAttempts: 0,
        });
      }

      return NextResponse.json({
        success: true,
        passcodeConfigured: user.passcodeConfigured,
        failedPasscodeAttempts: user.failedPasscodeAttempts,
      });
    }

    // 2. VERIFY PASSCODE AUTHENTICATION
    if (action === "verify") {
      if (!email || !passcode) {
        return NextResponse.json({ success: false, error: "Email and passcode are required." }, { status: 400 });
      }

      if (!isValidPasscode(passcode)) {
        return NextResponse.json({ success: false, error: "Passcode must be exactly 6 digits." }, { status: 400 });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const user = await getFirestoreUserByEmail(normalizedEmail, idToken);

      if (!user) {
        console.warn(`[PASSCODE VERIFY] reason=user-not-found email="${normalizedEmail}"`);
        return NextResponse.json({
          success: false,
          error: "Invalid email or passcode.",
          lockout: false,
        }, { status: 401 });
      }

      if (!user.passcodeConfigured || !user.passcodeHash) {
        console.warn(`[PASSCODE VERIFY] reason=not-configured uid=${user.id}`);
        return NextResponse.json({
          success: false,
          error: "Invalid email or passcode.",
          lockout: false,
        }, { status: 401 });
      }

      if (user.failedPasscodeAttempts >= MAX_PASSCODE_ATTEMPTS) {
        console.warn(`[PASSCODE VERIFY] reason=locked-out uid=${user.id} attempts=${user.failedPasscodeAttempts}`);
        return NextResponse.json({
          success: false,
          error: "You've reached the maximum passcode attempts. Please login using your password.",
          lockout: true,
          failedAttempts: user.failedPasscodeAttempts,
        }, { status: 403 });
      }

      const match = await bcrypt.compare(passcode, user.passcodeHash);

      if (!match) {
        const newFailCount = user.failedPasscodeAttempts + 1;
        await updateFirestoreUserFields(user.id, { failedPasscodeAttempts: newFailCount }, idToken);
        console.warn(`[PASSCODE VERIFY] reason=hash-mismatch uid=${user.id} attempts=${newFailCount}`);

        if (newFailCount >= MAX_PASSCODE_ATTEMPTS) {
          return NextResponse.json({
            success: false,
            error: "You've reached the maximum passcode attempts. Please login using your password.",
            lockout: true,
            failedAttempts: newFailCount,
          }, { status: 403 });
        }

        return NextResponse.json({
          success: false,
          error: "Invalid email or passcode.",
          lockout: false,
          failedAttempts: newFailCount,
        }, { status: 401 });
      }

      // Successful passcode match: reset failed-attempt counter, issue our
      // own signed session for middleware/route gating, AND mint a real
      // Firebase custom token so the client can establish a genuine
      // Firebase Auth session too (needed for direct Firestore client SDK
      // reads elsewhere in the app, e.g. the admin panel).
      await updateFirestoreUserFields(user.id, { failedPasscodeAttempts: 0 }, idToken);
      console.log(`[PASSCODE VERIFY] reason=success uid=${user.id}`);

      const sessionToken = await createSessionToken(user.id, user.role);
      const customToken = await mintCustomToken(user.id, { role: user.role });
      const response = NextResponse.json({
        success: true,
        uid: user.id,
        role: user.role,
        customToken,
        message: "Passcode verified successfully.",
      });
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      return response;
    }

    // 3. SETUP / RESET PASSCODE (requires the caller's real Firebase ID token)
    if (action === "setup") {
      if (!idToken) {
        return NextResponse.json({ success: false, error: "Authentication required to configure a passcode." }, { status: 401 });
      }

      if (!newPasscode || (!uid && !email)) {
        return NextResponse.json({ success: false, error: "Passcode and User ID/Email are required." }, { status: 400 });
      }

      if (!isValidPasscode(newPasscode)) {
        return NextResponse.json({ success: false, error: "Passcode must be exactly 6 digits." }, { status: 400 });
      }

      if (isRestrictedPasscode(newPasscode)) {
        return NextResponse.json({
          success: false,
          error: "This passcode is too simple or predictable (e.g. 123456, 000000). Please choose a more secure 6-digit passcode.",
        }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      const passcodeHash = await bcrypt.hash(newPasscode, salt);

      let targetDocId = uid;
      if (email && (!targetDocId || targetDocId.length < 5)) {
        const uByEmail = await getFirestoreUserByEmail(email, idToken);
        if (uByEmail) targetDocId = uByEmail.id;
      }

      if (!targetDocId) {
        return NextResponse.json({ success: false, error: "Could not resolve the target user account." }, { status: 404 });
      }

      const fieldsToUpdate: Record<string, string | boolean | number> = {
        passcodeHash,
        passcodeConfigured: true,
        failedPasscodeAttempts: 0,
      };

      if (email) {
        fieldsToUpdate.email = String(email).toLowerCase().trim();
      }

      const ok = await updateFirestoreUserFields(targetDocId, fieldsToUpdate, idToken);

      if (!ok) {
        console.error(`[PASSCODE SETUP] Firestore update failed for uid=${targetDocId}`);
        return NextResponse.json({ success: false, error: "Failed to save passcode to user profile." }, { status: 500 });
      }

      const response = NextResponse.json({
        success: true,
        message: "6-digit passcode configured successfully.",
      });

      // Establish/refresh the app session now that identity + role are
      // confirmed, so the caller lands in an authenticated state without a
      // second round trip. `role` is trusted here because the client just
      // read it directly from this same user's own Firestore document.
      const sessionToken = await createSessionToken(targetDocId, typeof role === "string" ? role : "user");
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Error in /api/auth/passcode:", errorObj.message || err);
    return NextResponse.json({ success: false, error: errorObj.message || "Server error handling passcode operation." }, { status: 500 });
  }
}
